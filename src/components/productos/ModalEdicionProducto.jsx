import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  productoEditar,
  manejoCambioInputEdicion,
  manejoCambioArchivoActualizar,
  actualizarProducto,
  categorias
}) => {

  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleActualizar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await actualizarProducto();
    setDeshabilitado(false);
  };

  // --- LÓGICA DE TECLA ENTER ---
  useEffect(() => {
    const detectarEnter = (e) => {
      if (mostrarModalEdicion && e.key === "Enter" && !deshabilitado) {
        // Evitamos que el enter refresque la página si hay un Form
        e.preventDefault();
        handleActualizar();
      }
    };

    if (mostrarModalEdicion) {
      window.addEventListener("keydown", detectarEnter);
    }

    return () => {
      window.removeEventListener("keydown", detectarEnter);
    };
  }, [mostrarModalEdicion, deshabilitado, productoEditar]);

  const estilos = {
    modalContent: {
      borderRadius: "20px",
      border: "none",
      boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
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
      color: "#64748b",
      fontSize: "0.9rem",
      marginBottom: "8px",
    },
    input: {
      borderRadius: "12px",
      padding: "10px 15px",
      border: "1px solid #e2e8f0",
      backgroundColor: "#f8fafc",
    },
    imagePreview: {
      width: "100px",
      height: "100px",
      objectFit: "cover",
      borderRadius: "15px",
      border: "3px solid #fff",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    },
    footer: {
      borderTop: "1px solid #f1f5f9",
      padding: "15px 25px",
    },
    btnPrimary: {
      borderRadius: "12px",
      padding: "10px 25px",
      fontWeight: "700",
      backgroundColor: "#3b82f6",
      border: "none",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    }
  };

  return (
    <Modal
      show={mostrarModalEdicion}
      onHide={() => setMostrarModalEdicion(false)}
      backdrop="static"
      centered
      size="lg"
      style={{ backdropFilter: "blur(8px)" }}
    >
      <div style={estilos.modalContent}>
        <Modal.Header closeButton style={estilos.header}>
          <Modal.Title style={estilos.title}>
            <i className="bi bi-pencil-square me-2 text-primary"></i>
            Editar Producto
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          <Form>
            <Row>
              {/* Categoría */}
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Categoría *</Form.Label>
                  <Form.Select
                    name="categoria_producto"
                    value={productoEditar.categoria_producto || ""}
                    onChange={manejoCambioInputEdicion}
                    style={estilos.input}
                    required
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

              {/* Nombre */}
              <Col xs={12} md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Nombre del Producto *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    placeholder="Ej. Martillo de acero"
                    value={productoEditar.nombre || ""}
                    onChange={manejoCambioInputEdicion}
                    style={estilos.input}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Precio Compra */}
              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Precio Compra *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="precio_compra"
                    value={productoEditar.precio_compra || ""}
                    onChange={manejoCambioInputEdicion}
                    style={estilos.input}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Precio Venta */}
              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Precio Venta *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="precio_venta"
                    value={productoEditar.precio_venta || ""}
                    onChange={manejoCambioInputEdicion}
                    style={estilos.input}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Stock */}
              <Col xs={12} md={4}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Stock Actual *</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={productoEditar.stock || ""}
                    onChange={manejoCambioInputEdicion}
                    style={estilos.input}
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={12} className="my-2">
                <hr style={{ opacity: 0.1 }} />
              </Col>

              {/* Visualización de Imagen Actual */}
              <Col xs={12} md={4} className="d-flex flex-column align-items-center justify-content-center">
                <Form.Label style={estilos.label}>Imagen Actual</Form.Label>
                {productoEditar.url_imagen ? (
                  <img
                    src={productoEditar.url_imagen}
                    alt="Producto"
                    style={estilos.imagePreview}
                  />
                ) : (
                  <div className="bg-light rounded-4 d-flex align-items-center justify-content-center" style={{ width: "100px", height: "100px" }}>
                    <i className="bi bi-image text-muted fs-2"></i>
                  </div>
                )}
              </Col>

              {/* Input para Nueva Imagen */}
              <Col xs={12} md={8}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Reemplazar Imagen (Opcional)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={manejoCambioArchivoActualizar}
                    style={estilos.input}
                  />
                  <Form.Text className="text-muted mt-2 d-block">
                    <i className="bi bi-info-circle me-1"></i>
                    Solo si deseas cambiar la foto actual.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer style={estilos.footer}>
          <Button 
            variant="light" 
            onClick={() => setMostrarModalEdicion(false)}
            style={{ borderRadius: "12px", padding: "10px 20px", fontWeight: "600" }}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleActualizar} 
            disabled={deshabilitado}
            style={estilos.btnPrimary}
          >
            {deshabilitado ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              "Actualizar Producto"
            )}
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ModalEdicionProducto;