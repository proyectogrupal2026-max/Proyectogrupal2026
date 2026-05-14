import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Image, InputGroup, Form, Spinner, Alert } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import { supabase } from "../../database/supabaseconfig";

const ModalRegistrarVenta = ({ show, onHide, recargar }) => {
  const [carrito, setCarrito] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [estadoVenta, setEstadoVenta] = useState("idle"); // idle | exito | error
  const [mensajeFeedback, setMensajeFeedback] = useState("");

  useEffect(() => {
    if (show) {
      setCarrito([]);
      setClienteSeleccionado(null);
      setEstadoVenta("idle");
      setMensajeFeedback("");
    }
  }, [show]);

  // --- CONTROLADORES DE CARGA ASÍNCRONA CORREGIDOS ---
  const cargarClientes = async (inputValue) => {
    try {
      const query = supabase.from("clientes").select("id, nombre, apellido");
      
      if (inputValue) {
        query.or(`nombre.ilike.%${inputValue}%,apellido.ilike.%${inputValue}%`);
      }
      
      const { data, error } = await query.limit(10);
      if (error) throw error;

      return (data || []).map((c) => ({
        value: c.id,
        label: `👤 ${c.nombre} ${c.apellido || ""}`,
      }));
    } catch (err) {
      console.error("Error cargando clientes:", err);
      setMensajeFeedback("Error de conexión al cargar la lista de clientes.");
      return [];
    }
  };

  const cargarProductos = async (inputValue) => {
    try {
      const query = supabase
        .from('productos') 
        .select("id, nombre, precio_venta, stock, url_imagen")
        .gt("stock", 0);

      if (inputValue) {
        query.ilike("nombre", `%${inputValue}%`);
      }

      const { data, error } = await query.limit(10);
      if (error) throw error;

      return (data || []).map((p) => ({
        value: p.id,
        label: `📦 ${p.nombre} (Dispo: ${p.stock})`,
        producto: p,
      }));
    } catch (err) {
      console.error("Error cargando productos:", err);
      setMensajeFeedback("Error de conexión al buscar productos en inventario.");
      return [];
    }
  };

  const alSeleccionarProducto = (seleccion) => {
    if (!seleccion) return;
    const prod = seleccion.producto;
    const itemEnCarrito = carrito.find((item) => item.id === prod.id);
    if (itemEnCarrito) {
      actualizarCantidad(prod.id, itemEnCarrito.cantidad + 1);
    } else {
      setCarrito([...carrito, { 
        id: prod.id,
        nombre: prod.nombre,
        precio_venta: parseFloat(prod.precio_venta || 0),
        stock: prod.stock,
        url_imagen: prod.url_imagen,
        cantidad: 1 
      }]);
    }
  };

  const actualizarCantidad = (id, nuevaCant) => {
    // Si está vacío, permitimos el string vacío para que el usuario pueda borrar el 0 sin problemas
    if (nuevaCant === "") {
      setCarrito((prev) =>
        prev.map((item) => (item.id === id ? { ...item, cantidad: "" } : item))
      );
      return;
    }

    const valor = parseInt(nuevaCant);
    setCarrito((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (valor > item.stock) return { ...item, cantidad: item.stock };
          return { ...item, cantidad: isNaN(valor) ? 0 : valor };
        }
        return item;
      })
    );
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, item) => {
      const cantidadNumerica = item.cantidad === "" ? 0 : item.cantidad;
      return acc + (item.precio_venta * cantidadNumerica);
    }, 0);
  };

  const registrarVentaFinal = async () => {
    if (carrito.length === 0 || cargando) return;
    setCargando(true);
    setEstadoVenta("idle");
    setMensajeFeedback("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: venta, error: errVenta } = await supabase
        .from("ventas")
        .insert([{ 
          vendedor_id: user.id, 
          cliente_id: clienteSeleccionado?.value || null, 
          total: calcularTotal(), 
          estado: 'completado' 
        }]).select();

      if (errVenta) throw errVenta;

      const detalles = carrito.map((item) => ({
        venta_id: venta[0].id,
        producto_id: item.id,
        cantidad: item.cantidad === "" ? 0 : item.cantidad,
        precio_venta: item.precio_venta 
      }));

      const { error: errDetalles } = await supabase.from("detalles_ventas").insert(detalles);
      if (errDetalles) throw errDetalles;

      setEstadoVenta("exito");
      setMensajeFeedback("Venta procesada con éxito. Cerrando...");
      setTimeout(() => { recargar(); onHide(); }, 1500);
    } catch (e) {
      console.error(e);
      setEstadoVenta("error");
      setMensajeFeedback("Ocurrió un error al registrar la venta. Por favor, intente de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: '12px',
      border: 'none',
      backgroundColor: '#f8fafc',
      padding: '4px',
      boxShadow: 'none'
    })
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="border-0">
      <Modal.Header closeButton className="bg-white border-0 pt-4 px-4">
        <Modal.Title className="fw-bold d-flex align-items-center">
          <div className="bg-primary-subtle rounded-3 p-2 me-3 text-primary d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <i className="bi bi-cart-plus fs-4"></i>
          </div>
          Nueva Venta
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-3 p-md-4 pt-2">
        {/* ALERTAS DE FEEDBACK OPERACIONAL */}
        {mensajeFeedback && (
          <Alert variant={estadoVenta === "exito" ? "success" : "danger"} className="rounded-4 mb-3 border-0 shadow-sm fw-medium small">
            <i className={`bi ${estadoVenta === "exito" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} me-2`}></i>
            {mensajeFeedback}
          </Alert>
        )}

        {/* CABECERA DE SELECCIÓN */}
        <div className="bg-light rounded-4 p-3 mb-4 border border-white shadow-sm">
          <Row className="g-3 align-items-center">
            <Col xs={12} md={6}>
              <span className="text-muted small fw-bold text-uppercase d-block mb-2" style={{ fontSize: '0.65rem' }}>Cliente</span>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={cargarClientes}
                onChange={setClienteSeleccionado}
                placeholder="Buscar cliente..."
                styles={customSelectStyles}
                isClearable
                noOptionsMessage={() => "No se encontraron clientes"}
                loadingMessage={() => "Buscando..."}
              />
            </Col>
            <Col xs={12} md={6}>
              <span className="text-muted small fw-bold text-uppercase d-block mb-2" style={{ fontSize: '0.65rem' }}>Añadir Producto</span>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={cargarProductos}
                onChange={alSeleccionarProducto}
                placeholder="Escribe el nombre..."
                value={null}
                styles={customSelectStyles}
                noOptionsMessage={() => "No se encontraron productos disponibles"}
                loadingMessage={() => "Buscando..."}
              />
            </Col>
          </Row>
        </div>

        {/* LISTADO DE ARTÍCULOS (ALTURA AJUSTADA PARA HACER EL MODAL MÁS PEQUEÑO) */}
        <div className="d-flex flex-column gap-2 mb-4" style={{ maxHeight: "240px", overflowY: "auto" }}>
          {carrito.length === 0 ? (
            <div className="text-center py-5 text-muted bg-light rounded-4 border border-dashed small fw-medium">
              No hay productos en el carrito
            </div>
          ) : (
            carrito.map((item) => (
              <div key={item.id} className="p-3 bg-white rounded-4 border shadow-sm">
                <Row className="g-3 align-items-center text-center text-sm-start">
                  
                  {/* Imagen */}
                  <Col xs={12} sm="auto" className="d-flex justify-content-center">
                    <Image 
                      src={item.url_imagen || "https://via.placeholder.com/52?text=📦"} 
                      rounded-3
                      style={{ width: "52px", height: "52px", objectFit: "cover" }}
                      className="bg-light border"
                    />
                  </Col>
                  
                  {/* Nombre y Precio base */}
                  <Col xs={12} sm className="text-truncate">
                    <div className="fw-bold text-dark fs-6 text-truncate">{item.nombre}</div>
                    <div className="text-muted small">
                      C$ {item.precio_venta.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                    </div>
                  </Col>

                  {/* Input de control de cantidad */}
                  <Col xs={6} sm="auto" className="d-flex justify-content-start justify-content-sm-center">
                    <InputGroup size="md" className="bg-light rounded-3 p-2 border-0" style={{ width: '125px', margin: '0 auto' }}>
                      <Form.Control
                        type="number"
                        className="text-center fw-extrabold border-0 bg-transparent p-0 fs-6 text-dark"
                        value={item.cantidad}
                        onChange={(e) => actualizarCantidad(item.id, e.target.value)}
                        style={{ boxShadow: 'none' }}
                      />
                      <span className="text-muted small align-self-center opacity-60 ps-1">/{item.stock}</span>
                    </InputGroup>
                  </Col>
                  
                  {/* Totales y Botón eliminar */}
                  <Col xs={6} sm="auto" className="d-flex align-items-center justify-content-end gap-2">
                    <div className="fw-bolder text-primary fs-6" style={{ minWidth: '95px', textAlign: 'right' }}>
                      C$ {((item.cantidad === "" ? 0 : item.cantidad) * item.precio_venta).toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                    </div>
                    <Button 
                      variant="link" 
                      className="text-danger p-1 shadow-none" 
                      onClick={() => setCarrito(carrito.filter(i => i.id !== item.id))}
                    >
                      <i className="bi bi-x-circle-fill fs-5"></i>
                    </Button>
                  </Col>

                </Row>
              </div>
            ))
          )}
        </div>

        {/* TOTAL TOTAL */}
        <div className="d-flex justify-content-between align-items-center mt-2 pt-3 border-top px-2">
          <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.85rem' }}>Total a Pagar</span>
          <div className="text-end">
            <h3 className="fw-bolder text-primary mb-0" style={{ letterSpacing: '-1px' }}>
              C$ {calcularTotal().toLocaleString('es-NI', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </Modal.Body>

      {/* FOOTER */}
      <Modal.Footer className="border-0 px-4 pb-4 pt-0 gap-2">
        <Button variant="light" className="fw-bold text-secondary rounded-3 border-0 px-4" onClick={onHide} disabled={cargando}>
          Cerrar
        </Button>
        <Button 
          variant={estadoVenta === "exito" ? "success" : estadoVenta === "error" ? "danger" : "primary"} 
          className="px-4 fw-bold rounded-3 shadow-sm" 
          onClick={registrarVentaFinal}
          disabled={cargando || carrito.length === 0 || estadoVenta === "exito"}
          style={{ minWidth: '140px' }}
        >
          {cargando ? (
            <Spinner animation="border" size="sm" />
          ) : estadoVenta === "exito" ? (
            "¡Venta Lista! ✅"
          ) : estadoVenta === "error" ? (
            "Reintentar ⚠️"
          ) : (
            "Guardar Venta"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistrarVenta;