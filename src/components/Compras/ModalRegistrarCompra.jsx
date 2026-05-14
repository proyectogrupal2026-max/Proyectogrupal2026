import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Image, InputGroup, Form, Spinner, Alert } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import { supabase } from "../../database/supabaseconfig";

const ModalRegistrarCompra = ({ show, onHide, recargar }) => {
  const [carrito, setCarrito] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [estadoCompra, setEstadoCompra] = useState("idle"); // idle | exito | error
  const [mensajeFeedback, setMensajeFeedback] = useState("");

  useEffect(() => {
    if (show) {
      setCarrito([]);
      setProveedorSeleccionado(null);
      setEstadoCompra("idle");
      setMensajeFeedback("");
    }
  }, [show]);

  // --- CONTROLADORES DE CARGA ASÍNCRONA ---
  const cargarProveedores = async (inputValue) => {
    try {
      const query = supabase.from("proveedores").select("id, nombre");
      
      if (inputValue) {
        query.ilike("nombre", `%${inputValue}%`);
      }
      
      const { data, error } = await query.limit(10);
      if (error) throw error;

      return (data || []).map((p) => ({
        value: p.id,
        label: `🏢 ${p.nombre}`,
      }));
    } catch (err) {
      console.error("Error cargando proveedores:", err);
      setMensajeFeedback("Error de conexión al cargar la lista de proveedores.");
      return [];
    }
  };

  const cargarProductos = async (inputValue) => {
    try {
      const query = supabase.from("productos").select("id, nombre, precio_compra, stock, url_imagen");

      if (inputValue) {
        query.ilike("nombre", `%${inputValue}%`);
      }

      const { data, error } = await query.limit(10);
      if (error) throw error;

      return (data || []).map((p) => ({
        value: p.id,
        label: `📦 ${p.nombre} (Stock: ${p.stock})`,
        producto: p,
      }));
    } catch (err) {
      console.error("Error cargando productos:", err);
      setMensajeFeedback("Error de conexión al buscar productos.");
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
        precio_compra: parseFloat(prod.precio_compra || 0),
        stock: prod.stock,
        url_imagen: prod.url_imagen,
        cantidad: 1 
      }]);
    }
  };

  const actualizarCantidad = (id, nuevaCant) => {
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
          return { ...item, cantidad: isNaN(valor) ? 0 : valor };
        }
        return item;
      })
    );
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, item) => {
      const cantidadNumerica = item.cantidad === "" ? 0 : item.cantidad;
      return acc + (item.precio_compra * cantidadNumerica);
    }, 0);
  };

  const guardarCompra = async () => {
    if (!proveedorSeleccionado || carrito.length === 0 || cargando) return;
    setCargando(true);
    setEstadoCompra("idle");
    setMensajeFeedback("");
    try {
      const { data: comp, error: errC } = await supabase
        .from("compras")
        .insert([{ proveedor_id: proveedorSeleccionado.value }])
        .select()
        .single();
        
      if (errC) throw errC;

      const detalles = carrito.map((item) => ({
        compra_id: comp.id,
        producto_id: item.id,
        cantidad: item.cantidad === "" ? 0 : item.cantidad,
        precio_compra: item.precio_compra 
      }));

      const { error: errDetalles } = await supabase.from("detalles_compras").insert(detalles);
      if (errDetalles) throw errDetalles;

      // Actualizar existencias en inventario
      for (const item of carrito) {
        const cantidadSumar = item.cantidad === "" ? 0 : item.cantidad;
        await supabase
          .from("productos")
          .update({ stock: item.stock + cantidadSumar })
          .eq("id", item.id);
      }

      setEstadoCompra("exito");
      setMensajeFeedback("Entrada de mercancía registrada con éxito.");
      setTimeout(() => { recargar(); onHide(); }, 1500);
    } catch (e) {
      console.error(e);
      setEstadoCompra("error");
      setMensajeFeedback("Ocurrió un error al registrar la compra. Intente nuevamente.");
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
            <i className="bi bi-cart-check fs-4"></i>
          </div>
          Nueva Mercancía
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-3 p-md-4 pt-2">
        {/* ALERTAS DE FEEDBACK OPERACIONAL */}
        {mensajeFeedback && (
          <Alert variant={estadoCompra === "exito" ? "success" : "danger"} className="rounded-4 mb-3 border-0 shadow-sm fw-medium small">
            <i className={`bi ${estadoCompra === "exito" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} me-2`}></i>
            {mensajeFeedback}
          </Alert>
        )}

        {/* CABECERA DE SELECCIÓN */}
        <div className="bg-light rounded-4 p-3 mb-4 border border-white shadow-sm">
          <Row className="g-3 align-items-center">
            <Col xs={12} md={6}>
              <span className="text-muted small fw-bold text-uppercase d-block mb-2" style={{ fontSize: '0.65rem' }}>Proveedor</span>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={cargarProveedores}
                onChange={setProveedorSeleccionado}
                value={proveedorSeleccionado}
                placeholder="Buscar proveedor..."
                styles={customSelectStyles}
                isClearable
                noOptionsMessage={() => "No se encontraron proveedores"}
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
                noOptionsMessage={() => "No se encontraron productos"}
                loadingMessage={() => "Buscando..."}
              />
            </Col>
          </Row>
        </div>

        {/* LISTADO DE ARTÍCULOS (ALTURA CONTROLADA Y DISEÑO REDUCIDO) */}
        <div className="d-flex flex-column gap-2 mb-4" style={{ maxHeight: "240px", overflowY: "auto" }}>
          {carrito.length === 0 ? (
            <div className="text-center py-5 text-muted bg-light rounded-4 border border-dashed small fw-medium">
              No hay productos añadidos a la lista de compra
            </div>
          ) : (
            carrito.map((item) => (
              <div key={item.id} className="p-3 bg-white rounded-4 border shadow-sm">
                <Row className="g-3 align-items-center text-center text-sm-start">
                  
                  {/* Imagen del Producto */}
                  <Col xs={12} sm="auto" className="d-flex justify-content-center">
                    <Image 
                      src={item.url_imagen || "https://via.placeholder.com/52?text=📦"} 
                      rounded-3
                      style={{ width: "52px", height: "52px", objectFit: "cover" }}
                      className="bg-light border"
                    />
                  </Col>
                  
                  {/* Nombre y Costo de Compra */}
                  <Col xs={12} sm className="text-truncate">
                    <div className="fw-bold text-dark fs-6 text-truncate">{item.nombre}</div>
                    <div className="text-muted small">
                      C$ {item.precio_compra.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                    </div>
                  </Col>

                  {/* Input de Control de Cantidad (Permite borrar el 0 completamente) */}
                  <Col xs={12} sm="auto" className="d-flex justify-content-center">
                    <InputGroup size="md" className="bg-light rounded-3 p-2 border-0" style={{ width: '110px', margin: '0 auto' }}>
                      <Form.Control
                        type="number"
                        className="text-center fw-extrabold border-0 bg-transparent p-0 fs-6 text-dark"
                        value={item.cantidad}
                        onChange={(e) => actualizarCantidad(item.id, e.target.value)}
                        style={{ boxShadow: 'none' }}
                      />
                    </InputGroup>
                  </Col>
                  
                  {/* Subtotal y Botón Eliminar */}
                  <Col xs={12} sm="auto" className="d-flex align-items-center justify-content-end gap-2">
                    <div className="fw-bolder text-primary fs-6" style={{ minWidth: '95px', textAlign: 'right' }}>
                      C$ {((item.cantidad === "" ? 0 : item.cantidad) * item.precio_compra).toLocaleString('es-NI', { minimumFractionDigits: 2 })}
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

        {/* COSTO TOTAL GENERAL */}
        <div className="d-flex justify-content-between align-items-center mt-2 pt-3 border-top px-2">
          <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.85rem' }}>Total Facturado</span>
          <div className="text-end">
            <h3 className="fw-bolder text-primary mb-0" style={{ letterSpacing: '-1px' }}>
              C$ {calcularTotal().toLocaleString('es-NI', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </Modal.Body>

      {/* FOOTER ACCIONES */}
      <Modal.Footer className="border-0 px-4 pb-4 pt-0 gap-2">
        <Button variant="light" className="fw-bold text-secondary rounded-3 border-0 px-4" onClick={onHide} disabled={cargando}>
          Cerrar
        </Button>
        <Button 
          variant={estadoCompra === "exito" ? "success" : estadoCompra === "error" ? "danger" : "primary"} 
          className="px-4 fw-bold rounded-3 shadow-sm" 
          onClick={guardarCompra}
          disabled={cargando || carrito.length === 0 || !proveedorSeleccionado || estadoCompra === "exito"}
          style={{ minWidth: '150px' }}
        >
          {cargando ? (
            <Spinner animation="border" size="sm" />
          ) : estadoCompra === "exito" ? (
            "¡Ingreso Listo! ✅"
          ) : estadoCompra === "error" ? (
            "Reintentar ⚠️"
          ) : (
            "Registrar Compra"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistrarCompra;