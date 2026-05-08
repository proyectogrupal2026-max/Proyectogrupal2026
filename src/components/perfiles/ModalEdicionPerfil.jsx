import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert, Row, Col } from "react-bootstrap";

const ModalEdicionPerfil = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  perfilEditar,
  manejoCambioInputEdicion,
  actualizarPerfil,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);
  const [errorLocal, setErrorLocal] = useState("");

  // Limpiar errores al cerrar o abrir el modal
  useEffect(() => {
    if (!mostrarModalEdicion) {
      setDeshabilitado(false);
      setErrorLocal("");
    }
  }, [mostrarModalEdicion]);

  // --- VALIDACIONES PERSONALIZADAS ---
  const validarSoloLetras = (e) => {
    const { value } = e.target;
    const patron = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (patron.test(value)) {
      manejoCambioInputEdicion(e);
    }
  };

  const validarTelefono = (e) => {
    let { value } = e.target;
    const numeros = value.replace(/\D/g, "");

    if (numeros.length <= 8) {
      if (numeros.length > 4) {
        value = `${numeros.slice(0, 4)}-${numeros.slice(4)}`;
      } else {
        value = numeros;
      }
      
      const eventoSintetico = {
        target: {
          name: e.target.name,
          value: value
        }
      };
      manejoCambioInputEdicion(eventoSintetico);
    }
  };

  const handleActualizar = async (e) => {
    if (e) e.preventDefault();
    
    if (!perfilEditar.nombre_completo?.trim() || !perfilEditar.rol?.trim()) {
      setErrorLocal("Nombre y Rol son campos obligatorios.");
      return;
    }

    setDeshabilitado(true);
    setErrorLocal("");

    try {
      await actualizarPerfil();
    } catch (err) {
      setErrorLocal("Error al actualizar el perfil. Intenta de nuevo.");
      setDeshabilitado(false);
    }
  };

  // --- LÓGICA DE TECLA ENTER ---
  useEffect(() => {
    const detectarEnter = (e) => {
      if (mostrarModalEdicion && e.key === "Enter" && !deshabilitado) {
        if (perfilEditar.nombre_completo?.trim() && perfilEditar.rol?.trim()) {
          handleActualizar();
        }
      }
    };

    if (mostrarModalEdicion) {
      window.addEventListener("keydown", detectarEnter);
    }

    return () => {
      window.removeEventListener("keydown", detectarEnter);
    };
  }, [mostrarModalEdicion, deshabilitado, perfilEditar]);

  const estilos = {
    modalContent: {
      borderRadius: "15px",
      border: "none",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    },
    header: {
      borderBottom: "none",
      padding: "25px 25px 10px 25px",
    },
    title: {
      fontWeight: "800",
      color: "#1a252f",
      fontSize: "1.8rem",
    },
    body: {
      padding: "10px 25px 25px 25px",
    },
    label: {
      fontWeight: "700",
      color: "#212529",
      marginBottom: "8px",
      fontSize: "1.1rem",
    },
    input: {
      borderRadius: "10px",
      padding: "12px",
      border: "1px solid #dee2e6",
      fontSize: "1rem",
    },
    footer: {
      borderTop: "none",
      padding: "0 25px 25px 25px",
      gap: "10px",
    },
    btnPrimary: {
      borderRadius: "10px",
      padding: "12px 30px",
      fontWeight: "700",
      backgroundColor: "#007bff",
      border: "none",
    }
  };

  return (
    <Modal
      show={mostrarModalEdicion}
      onHide={() => setMostrarModalEdicion(false)}
      backdrop="static"
      centered
      style={{ backdropFilter: "blur(6px)" }}
    >
      <div style={estilos.modalContent}>
        <Form onSubmit={handleActualizar}>
          <Modal.Header closeButton style={estilos.header}>
            <Modal.Title style={estilos.title}>Editar Perfil</Modal.Title>
          </Modal.Header>

          <Modal.Body style={estilos.body}>
            {errorLocal && (
              <Alert variant="danger" className="rounded-3 border-0 shadow-sm">
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                {errorLocal}
              </Alert>
            )}

            <Form.Group className="mb-4">
              <Form.Label style={estilos.label}>Nombre Completo *</Form.Label>
              <Form.Control
                type="text"
                name="nombre_completo"
                value={perfilEditar.nombre_completo || ""}
                onChange={validarSoloLetras}
                placeholder="Ingresa el nombre completo"
                style={estilos.input}
                className="shadow-sm"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Rol del Sistema *</Form.Label>
                  <Form.Select
                    name="rol"
                    value={perfilEditar.rol || ""}
                    onChange={manejoCambioInputEdicion}
                    style={estilos.input}
                    className="shadow-sm"
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Vendedor">Vendedor</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefono"
                    value={perfilEditar.telefono || ""}
                    onChange={validarTelefono}
                    placeholder="8888-8888"
                    style={estilos.input}
                    className="shadow-sm"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer style={estilos.footer}>
            <Button
              variant="light"
              onClick={() => setMostrarModalEdicion(false)}
              disabled={deshabilitado}
              style={{ borderRadius: "10px", padding: "10px 20px", fontWeight: "600" }}
            >
              Cancelar
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={deshabilitado}
              style={estilos.btnPrimary}
            >
              {deshabilitado ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Guardando...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalEdicionPerfil;