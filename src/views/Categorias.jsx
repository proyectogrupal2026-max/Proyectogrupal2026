import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

// Librerías para exportar a PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Dependencia para envío de correos
import emailjs from '@emailjs/browser';

// Importación de componentes
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";
import TablaCategorias from "../components/categorias/TablaCategorias";
import TarjetaCategoria from "../components/categorias/TarjetaCategoria";
import NotificacionOperacion from "../components/NotificacionOperacion";

// NUEVOS COMPONENTES DE LÓGICA
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

// MODAL PARA EL ENVÍO DE CORREOS
import ModalEnvioCorreoCategorias from "../components/categorias/ModalEnvioCorreoCategorias";

const Categorias = () => {
  // --- ESTADOS PRINCIPALES ---
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  // --- NUEVOS ESTADOS: BÚSQUEDA Y PAGINACIÓN ---
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  // --- ESTADOS DE MODALES ---
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  // --- NUEVOS ESTADOS: ENVÍO DE CORREO ---
  const [mostrarModalCorreo, setMostrarModalCorreo] = useState(false);
  const [emailDestino, setEmailDestino] = useState("");
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  const [categoriaEditar, setCategoriaEditar] = useState({
    id: "",
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  // --- CARGA DE DATOS ---
  useEffect(() => {
    cargarCategorias();
  }, []);

  // Inicializar EmailJS con la clave pública de las variables de entorno
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const cargarCategorias = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error("Error al cargar categorías:", error.message);
      setToast({
        mostrar: true,
        mensaje: "Error al cargar las categorías.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  // --- LÓGICA: FILTRADO ---
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setCategoriasFiltradas(categorias);
    } else {
      const term = textoBusqueda.toLowerCase().trim();
      const filtradas = Antiquas = categorias.filter(
        (cat) =>
          cat.nombre_categoria.toLowerCase().includes(term) ||
          (cat.descripcion_categoria && cat.descripcion_categoria.toLowerCase().includes(term))
      );
      setCategoriasFiltradas(filtradas);
    }
    establecerPaginaActual(1);
  }, [textoBusqueda, categorias]);

  // --- LÓGICA: PAGINACIÓN ---
  const categoriasPaginadas = categoriasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  // --- ABRIR MODALES ---
  const abrirModalEdicion = (categoria) => {
    setCategoriaEditar({
      id: categoria.id,
      nombre_categoria: categoria.nombre_categoria,
      descripcion_categoria: categoria.descripcion_categoria || "",
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminacion(true);
  };

  // --- LÓGICA: CORREO ELECTRÓNICO ---
  const abrirModalCorreo = () => {
    setEmailDestino("");
    setMostrarModalCorreo(true);
  };

  const formatearCategoriasParaCorreo = () => {
    if (categorias.length === 0) return "No hay categorías registradas.";
    let texto = `LISTADO DE CATEGORÍAS\n\n`;
    texto += `Fecha: ${new Date().toLocaleDateString("es-NI")}\n`;
    texto += `Total de categorías: ${categorias.length}\n\n`;
    
    categorias.forEach((cat, index) => {
      texto += `${index + 1}. ${cat.nombre_categoria}\n`;
      if (cat.descripcion_categoria) {
        texto += `Descripción: ${cat.descripcion_categoria}\n`;
      }
      texto += `\n`;
    });
    return texto;
  };

  const enviarCorreoCategorias = () => {
    if (!emailDestino.trim()) {
      setToast({
        mostrar: true,
        mensaje: "Por favor ingresa un correo destino.",
        tipo: "advertencia",
      });
      return;
    }

    setEnviandoCorreo(true);
    const mensaje = formatearCategoriasParaCorreo();

    const templateParams = {
      to_name: "Administrador",
      user_email: emailDestino,
      message: mensaje,
      fecha_envio: new Date().toLocaleDateString("es-NI")
    };

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    )
    .then(() => {
      setToast({
        mostrar: true,
        mensaje: "Correo enviado correctamente.",
        tipo: "exito",
      });
      setMostrarModalCorreo(false);
      setEmailDestino("");
    })
    .catch((error) => {
      console.error("Error EmailJS:", error);
      setToast({
        mostrar: true,
        mensaje: "Error al enviar el correo.",
        tipo: "error",
      });
    })
    .finally(() => {
      setEnviandoCorreo(false);
    });
  };

  // --- LÓGICA: COPIAR AL PORTAPAPELES ---
  const copiarCategoria = async (categoria) => {
    if (!categoria) return;
    const texto = `ID: ${categoria.id}\nCategoría: ${categoria.nombre_categoria}\nDescripción: ${categoria.descripcion_categoria || "Sin descripción"}`;
    try {
      await navigator.clipboard.writeText(texto);
      setToast({ mostrar: true, mensaje: `Categoría "${categoria.nombre_categoria}" copiada`, tipo: "exito" });
    } catch (err) {
      setToast({ mostrar: true, mensaje: "Error al copiar", tipo: "error" });
    }
  };

  // --- LÓGICA DE EXPORTACIÓN PDF ---
  const generarPDFCategoria = (categoria) => {
    const doc = new jsPDF();

    // Encabezado Corporativo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(33, 37, 41);
    doc.text("MARTITATOOLS - REPORTE DE CATEGORÍA", 14, 20);

    // Subtítulo con marca de tiempo local
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(108, 117, 125);
    const fechaEmision = new Date().toLocaleString("es-NI");
    doc.text(`Fecha de emisión: ${fechaEmision}`, 14, 26);

    // Línea divisoria decorativa azul institucional
    doc.setDrawColor(13, 110, 253);
    doc.setLineWidth(1);
    doc.line(14, 30, 196, 30);

    // Renderizar estructura del reporte en tabla
    autoTable(doc, {
      startY: 38,
      theme: "striped",
      headStyles: {
        fillColor: [13, 110, 253],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      head: [["Campo", "Detalle del Registro"]],
      body: [
        ["Código Interno (ID)", `#${categoria.id || "-"}`],
        ["Nombre de la Categoría", `${categoria.nombre_categoria || "-"}`],
        ["Descripción / Notas", `${categoria.descripcion_categoria || "Sin descripción disponible."}`],
      ],
      styles: { fontSize: 11, cellPadding: 5 },
      columnStyles: {
        0: { fontStyle: "bold", width: 50 },
      },
    });

    // Pie de página
    const finalY = doc.lastAutoTable.finalY || 40;
    doc.setFontSize(9);
    doc.setTextColor(140, 140, 140);
    doc.text("Sistema de Control de Inventario - Ferretería Martita Castilla", 14, finalY + 15);

    // Descarga automática del archivo
    doc.save(`categoria_${categoria.nombre_categoria || "registro"}_${categoria.id}.pdf`);
  };

  // --- MANEJO DE INPUTS ---
  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setCategoriaEditar((prev) => ({ ...prev, [name]: value }));
  };

  // --- CRUD ---
  const agregarCategoria = async () => {
    if (!nuevaCategoria.nombre_categoria.trim()) {
      setToast({ mostrar: true, mensaje: "El nombre es obligatorio.", tipo: "advertencia" });
      return;
    }
    try {
      const { error } = await supabase.from("categorias").insert([nuevaCategoria]);
      if (error) throw error;
      setToast({ mostrar: true, mensaje: `Categoría registrada con éxito.`, tipo: "exito" });
      setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
      setMostrarModalRegistro(false);
      await cargarCategorias();
    } catch (error) {
      setToast({ mostrar: true, mensaje: "Error al registrar.", tipo: "error" });
    }
  };

  const actualizarCategoria = async () => {
    if (!categoriaEditar.nombre_categoria.trim()) {
      setToast({ mostrar: true, mensaje: "El nombre es obligatorio.", tipo: "advertencia" });
      return;
    }
    try {
      const { error } = await supabase
        .from("categorias")
        .update({
          nombre_categoria: categoriaEditar.nombre_categoria,
          descripcion_categoria: categoriaEditar.descripcion_categoria,
        })
        .eq("id", categoriaEditar.id);
      if (error) throw error;
      setToast({ mostrar: true, mensaje: `Categoría actualizada correctamente.`, tipo: "exito" });
      setMostrarModalEdicion(false);
      await cargarCategorias();
    } catch (error) {
      setToast({ mostrar: true, mensaje: "Error al actualizar.", tipo: "error" });
    }
  };

  const eliminarCategoria = async () => {
    if (!categoriaAEliminar) return;
    try {
      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id", categoriaAEliminar.id);
      if (error) throw error;
      setToast({ mostrar: true, mensaje: `Categoría personalizada removida.`, tipo: "exito" });
      setMostrarModalEliminacion(false);
      await cargarCategorias();
    } catch (error) {
      setToast({ mostrar: true, mensaje: "Error al eliminar.", tipo: "error" });
    }
  };

  return (
    <Container className="mt-4">
      {/* Cabecera */}
      <div className="d-flex align-items-center justify-content-between mb-4 mt-2">
        <div className="d-flex align-items-center">
          <h3 className="mb-0 fw-bold">
            <i className="bi bi-tags-fill me-2 text-primary"></i>
            Gestión de Categorías
          </h3>
        </div>

        {/* Contenedor de Botones de Acción */}
        <div className="ms-2 d-flex gap-2">
          {/* BOTÓN NUEVO: ENVIAR POR CORREO */}
          <Button
            variant="outline-primary"
            onClick={abrirModalCorreo}
            className="d-flex align-items-center justify-content-center shadow-sm px-3"
            style={{
              height: '42px',
              borderRadius: '10px',
            }}
          >
            <i className="bi bi-envelope"></i>
            <span className="d-none d-sm-inline ms-2 fw-semibold" style={{ whiteSpace: 'nowrap' }}>
              Enviar por Correo
            </span>
          </Button>

          <Button
            onClick={() => setMostrarModalRegistro(true)}
            className="d-flex align-items-center justify-content-center shadow-sm px-3"
            style={{
              height: '42px',
              borderRadius: '10px',
              minWidth: '45px'
            }}
          >
            <i className="bi bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2 fw-semibold" style={{ whiteSpace: 'nowrap' }}>
              Nueva categoría
            </span>
          </Button>
        </div>
      </div>

      <hr />

      {/* CUADRO DE BÚSQUEDA */}
      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por nombre o descripción..."
          />
        </Col>
      </Row>

      {/* MENSAJE SI NO HAY COINCIDENCIAS */}
      {!cargando && textoBusqueda.trim() && categoriasFiltradas.length === 0 && (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          No se encontraron categorías que coincidan con "{textoBusqueda}".
        </Alert>
      )}

      {/* Contenido Principal */}
      {cargando ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted fw-bold">Cargando categorías...</p>
        </div>
      ) : (
        <>
          {categoriasFiltradas.length > 0 && (
            <>
              {/* Vista en tarjetas (móviles) */}
              <div className="d-lg-none">
                <TarjetaCategoria
                  categorias={categoriasPaginadas}
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                  generarPDFCategoria={generarPDFCategoria}
                  copiarCategoria={copiarCategoria}
                />
              </div>

              {/* Vista en tabla (escritorio) */}
              <div className="d-none d-lg-block">
                <TablaCategorias
                  categorias={categoriasPaginadas}
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                  generarPDFCategoria={generarPDFCategoria}
                  copiarCategoria={copiarCategoria}
                />
              </div>

              {/* COMPONENTE DE PAGINACIÓN */}
              <Paginacion
                registrosPorPagina={registrosPorPagina}
                totalRegistros={categoriasFiltradas.length}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
                establecerRegistrosPorPagina={establecerRegistrosPorPagina}
              />
            </>
          )}
        </>
      )}

      {/* Modales Existentes */}
      <ModalRegistroCategoria
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevaCategoria={nuevaCategoria}
        manejoCambioInput={manejoCambioInput}
        agregarCategoria={agregarCategoria}
      />

      <ModalEdicionCategoria
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        categoriaEditar={categoriaEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarCategoria={actualizarCategoria}
      />

      <ModalEliminacionCategoria
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCategoria={eliminarCategoria}
        categoria={categoriaAEliminar}
      />

      {/* NUEVO COMPONENTE MODAL DE EMAILJS */}
      <ModalEnvioCorreoCategorias
        mostrarModalCorreo={mostrarModalCorreo}
        setMostrarModalCorreo={setMostrarModalCorreo}
        emailDestino={emailDestino}
        setEmailDestino={setEmailDestino}
        enviandoCorreo={enviandoCorreo}
        enviarCorreoCategorias={enviarCorreoCategorias}
        totalCategorias={categorias.length}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Categorias;