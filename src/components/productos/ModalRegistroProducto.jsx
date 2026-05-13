import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroProducto = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  manejoCambioInput,
  manejoCambioArchivo,
  agregarProducto,
  categorias,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleAgregar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await agregarProducto();
    setDeshabilitado(false);
  };

  const manejarKeyDown = (e) => {
    if (e.key === "Enter" && !deshabilitado) {
      e.preventDefault();
      handleAgregar();
    }
  };

  const estilos = {
    modalContent: {
      borderRadius: "20px",
      border: "none",
      boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
    },
    header: {
      borderBottom: "1px solid #f1f5f9",
      padding: "20px 25px",
    },
    title: {
      fontWeight: "800",
      color: "#1e293b",
      fontSize: "1.4rem",
    },
    label: {
      fontWeight: "600",
      color: "#475569",
      fontSize: "0.9rem",
      marginBottom: "8px",
    },
    input: {
      borderRadius: "10px",
      padding: "10px 15px",
      border: "1px solid #e2e8f0",
      backgroundColor: "#f8fafc",
      fontSize: "1rem",
    },
    footer: {
      borderTop: "1px solid #f1f5f9",
      padding: "15px 25px 25px 25px",
      display: "flex",
      flexDirection: "row", // Alineación horizontal
      flexWrap: "nowrap",   // Evita que se apilen en móvil
      justifyContent: "flex-end",
      gap: "10px",
    },
    btnCancel: {
      borderRadius: "12px",
      padding: "10px 20px",
      fontWeight: "600",
      border: "none",
      backgroundColor: "#f1f5f9",
      color: "#475569",
      fontSize: "0.95rem",
      whiteSpace: "nowrap",
    },
    btnSave: {
      borderRadius: "12px",
      padding: "10px 20px",
      fontWeight: "700",
      backgroundColor: "#3b82f6",
      border: "none",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
      fontSize: "0.95rem",
      whiteSpace: "nowrap",
    }
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      centered
      size="lg"
      style={{ backdropFilter: "blur(6px)" }}
    >
      <div style={estilos.modalContent}>
        <Modal.Header closeButton style={estilos.header}>
          <Modal.Title style={estilos.title}>
            <i className="bi bi-box-seam me-2 text-primary"></i>
            Nuevo Producto
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          <Form onKeyDown={manejarKeyDown}>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Categoría *</Form.Label>
                  <Form.Select
                    name="categoria_producto"
                    value={nuevoProducto.categoria_producto || ""}
                    onChange={manejoCambioInput}
                    required
                    style={estilos.input}
                  >
                    <option value="">Seleccione...</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre_categoria}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={nuevoProducto.nombre || ""}
                    onChange={manejoCambioInput}
                    placeholder="Nombre del producto"
                    required
                    style={estilos.input}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Precio de compra *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="precio_compra"
                    value={nuevoProducto.precio_compra || ""}
                    onChange={manejoCambioInput}
                    placeholder="0.00"
                    required
                    style={estilos.input}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Precio de venta *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="precio_venta"
                    value={nuevoProducto.precio_venta || ""}
                    onChange={manejoCambioInput}
                    placeholder="0.00"
                    required
                    style={estilos.input}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Stock Inicial *</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={nuevoProducto.stock || ""}
                    onChange={manejoCambioInput}
                    placeholder="0"
                    required
                    style={estilos.input}
                  />
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Imagen del producto *</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={manejoCambioArchivo}
                    required
                    style={{ ...estilos.input, padding: "8px" }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer style={estilos.footer}>
          <Button 
            variant="secondary" 
            onClick={() => setMostrarModal(false)}
            style={estilos.btnCancel}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAgregar} 
            disabled={deshabilitado}
            style={estilos.btnSave}
          >
            {deshabilitado ? "Guardando..." : "Guardar Producto"}
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ModalRegistroProducto;