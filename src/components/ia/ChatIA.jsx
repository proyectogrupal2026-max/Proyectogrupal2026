import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Table } from 'react-bootstrap';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../../database/supabaseconfig';

const ChatIA = ({ mostrar, onCerrar }) => {
  const [mensajes, setMensajes] = useState([]);
  const [entrada, setEntrada] = useState('');
  const [cargando, setCargando] = useState(false);
  const finChatRef = useRef(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  // Estructura extraída exactamente de tu diagrama (todo en minúsculas)
  const contextoBaseDatos = `
  ESTRUCTURA DE BASE DE DATOS DE MARTITATOOLS:
  - perfiles (user_id, nombre_completo, rol, telefono)
  - categorias (id, nombre_categoria, descripcion_categoria)
  - proveedores (id, nombre, telefono, direccion)
  - clientes (id, nombre, apellido, telefono)
  - productos (id, nombre, categoria_producto, precio_compra, precio_venta, stock, url_imagen) -> ¡REGLA CRÍTICA! Todo en minúsculas. NUNCA uses "Productos" con mayúscula ni comillas.
  - ventas (id, fecha_venta, vendedor_id, estado, cliente_id, total)
  - detalles_ventas (id, venta_id, producto_id, cantidad, precio_venta, total)
  - compras (id, fecha_compra, proveedor_id, total)
  - detalles_compras (id, compra_id, producto_id, cantidad, precio_compra)
  `;

  const enviarConsulta = async () => {
    if (!entrada.trim()) return;

    const mensajeUsuario = { tipo: 'usuario', contenido: entrada };
    setMensajes(prev => [...prev, mensajeUsuario]);
    const consultaActual = entrada;
    setEntrada('');
    setCargando(true);

    try {
      const modelo = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
      Eres un experto en PostgreSQL. Tu única tarea es generar una consulta SELECT válida basada estrictamente en el esquema provisto para la ferretería MartitaTools.
      
      ${contextoBaseDatos}

      REGLAS DE SINTAXIS OBLIGATORIAS:
      1. Todas las tablas y columnas van estrictamente en minúsculas y SIN comillas dobles (productos, detalles_ventas, clientes, etc.). PROHIBIDO generar "Productos".
      2. NUNCA uses alias cortos para los nombres de las tablas en las cláusulas FROM o JOIN (PROHIBIDO hacer "FROM productos p" o "FROM clientes c"). Escribe siempre el nombre completo de la tabla al invocar columnas (Ejemplo correcto: clientes.nombre, productos.nombre).
      3. Para unir productos con categorías, la columna correcta es: productos.categoria_producto = categorias.id
      4. REGLA DE AGRUPACIÓN: En las cláusulas "GROUP BY", usa siempre el nombre real de la tabla y su columna original (Ejemplo: GROUP BY productos.nombre).
      5. Alias de Columnas: En el SELECT usa siempre alias cortos usando "AS" con nombres limpios de una sola palabra en MINÚSCULAS para las columnas de datos resultantes (Ejemplo: SELECT productos.nombre AS producto, SUM(detalles_ventas.cantidad) AS vendidos).
      6. NO uses punto y coma (;) al final del SQL.
      7. Devuelve EXCLUSIVAMENTE un objeto JSON válido, sin bloques de código markdown extra.

      Estructura de respuesta requerida:
      {
        "explicacion": "Una descripción breve en español de lo que calcula la consulta",
        "consulta_sql": "SELECT ...",
        "columnas": ["alias1", "alias2"]
      }

      Consulta del usuario: "${consultaActual}"
      `;

      const resultado = await modelo.generateContent(prompt);
      const textoOriginal = resultado.response.text().trim();

      const inicioJson = textoOriginal.indexOf('{');
      const finJson = textoOriginal.lastIndexOf('}');

      if (inicioJson === -1 || finJson === -1) {
        throw new Error("La IA no retornó el formato JSON esperado.");
      }

      const textoJsonLimpio = textoOriginal.substring(inicioJson, finJson + 1);
      const respuestaIA = JSON.parse(textoJsonLimpio);
      
      let sqlLimpio = respuestaIA.consulta_sql.trim();
      
      // Filtro de seguridad por si la IA se salta las reglas: forzar minúsculas en productos
      sqlLimpio = sqlLimpio.replace(/"Productos"/g, "productos").replace(/Productos/g, "productos");

      const { data, error } = await supabase.rpc('ejecutar_consulta_segura', {
        query_sql: sqlLimpio
      });

      if (error) {
        console.error("Error Supabase:", error);
        throw new Error(`SQL_ERROR: ${error.message}`);
      }

      const datosExtraidos = data ? data.map(item => {
        if (item && typeof item === 'object') {
          return item.row_to_json || item.datos || item;
        }
        return item;
      }) : [];
      
      const columnasFinales = datosExtraidos.length > 0 
        ? Object.keys(datosExtraidos[0]) 
        : (respuestaIA.columnas || []);

      const mensajeRespuesta = {
        tipo: 'ia',
        explicacion: respuestaIA.explicacion || "Reporte generado con éxito.",
        columnas: columnasFinales,
        datos: datosExtraidos,
        error: false
      };

      setMensajes(prev => [...prev, mensajeRespuesta]);

    } catch (error) {
      console.error("Error detectado en ChatIA:", error);
      
      let mensajeAmigable = "No logré procesar el análisis de datos. Por favor, intenta de nuevo.";
      if (error.message.includes("SQL_ERROR")) {
        mensajeAmigable = `Error en base de datos: ${error.message.replace("SQL_ERROR:", "")}`;
      }

      setMensajes(prev => [...prev, {
        tipo: 'ia',
        explicacion: mensajeAmigable,
        error: true
      }]);
    }

    setCargando(false);
  };

  useEffect(() => {
    finChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  return (
    <Modal show={mostrar} onHide={onCerrar} size="xl" centered backdrop="static">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title><i className="bi bi-robot me-2"></i>Módulo Analítico Inteligente (MartitaTools)</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "65vh", overflowY: "auto" }} className="bg-light">
        <div className="d-flex flex-column h-100">
          <div className="flex-grow-1 overflow-auto mb-3 pe-2">
            
            {mensajes.length === 0 && (
              <div className="text-center text-muted mt-5">
                <h4>Asistente Estadístico de Inventario y Ventas</h4>
                <p className="mt-2">Métricas en tiempo real de tu negocio:</p>
                <div className="d-inline-block text-start bg-white p-3 rounded shadow-sm">
                  <ul className="mb-0">
                    <li>¿Cuáles son los 10 productos más vendidos?</li>
                    <li>Listar el stock de los productos</li>
                    <li>Monto total de ventas de este mes</li>
                  </ul>
                </div>
              </div>
            )}

            {mensajes.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.tipo === 'usuario' ? 'text-end' : ''}`}>
                <div className={`d-inline-block p-3 rounded-3 shadow-sm ${msg.tipo === 'usuario' ? 'bg-primary text-white' : 'bg-white border text-dark'}`}
                  style={{ maxWidth: '90%', textAlign: 'left' }}>
                  <strong>{msg.tipo === 'usuario' ? 'Tú:' : '🤖 Asistente IA:'}</strong>
                  <p className="mb-0 mt-1" style={{ whiteSpace: "pre-line" }}>
                    {msg.tipo === 'usuario' ? msg.contenido : msg.explicacion}
                  </p>

                  {msg.datos && msg.datos.length > 0 && !msg.error && (
                    <Table striped bordered hover size="sm" responsive className="mt-3 bg-white">
                      <thead className="table-dark">
                        <tr>
                          {msg.columnas.map((col, i) => (
                            <th key={i}>{col.replace(/_/g, ' ').toUpperCase()}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {msg.datos.map((fila, i) => (
                          <tr key={i}>
                            {msg.columnas.map((col, j) => {
                              const valor = fila[col];
                              const columnaMinuscula = col.toLowerCase();
                              
                              const esMoneda = columnaMinuscula.includes('total') || 
                                               columnaMinuscula.includes('monto') || 
                                               columnaMinuscula.includes('precio') ||
                                               columnaMinuscula.includes('pago');

                              return (
                                <td key={j}>
                                  {typeof valor === 'number'
                                    ? esMoneda 
                                      ? `C$ ${valor.toFixed(2)}` 
                                      : valor 
                                    : String(valor ?? 'N/A')}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              </div>
            ))}

            {cargando && (
              <div className="text-center py-3 text-primary fw-bold">
                <Spinner animation="border" size="sm" className="me-2" /> 
                Analizando base de datos...
              </div>
            )}
            <div ref={finChatRef} />
          </div>

          <Form onSubmit={(e) => { e.preventDefault(); enviarConsulta(); }}>
            <div className="d-flex gap-2">
              <Form.Control
                value={entrada}
                onChange={(e) => setEntrada(e.target.value)}
                placeholder={cargando ? "Por favor espera..." : "Escribe tu consulta analítica..."}
                disabled={cargando}
                className="shadow-sm"
              />
              <Button variant="primary" onClick={enviarConsulta} disabled={cargando || !entrada.trim()}>
                Enviar
              </Button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ChatIA;