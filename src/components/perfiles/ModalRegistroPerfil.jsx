import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap";

const ModalRegistroPerfil = ({
  mostrarModal,
  setMostrarModal,
  nuevoPerfil,
  manejoCambioInput,
  agregarPerfil,
}) => {
  const [cargando, setCargando] = useState(false);
  const [errorLocal, setErrorLocal] = useState("");

  // --- VALIDACIONES PERSONALIZADAS ---
  const validarSoloLetras = (e) => {
    const { value } = e.target;
    const patron = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (patron.test(value)) {
      manejoCambioInput(e);
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
      manejoCambioInput(eventoSintetico);
    }
  };

  const handleRegistrar = async (e) => {
    if (e) e.preventDefault();
    setErrorLocal("");

    // Validación manual
    if (!nuevoPerfil.nombre_completo?.trim() || !nuevoPerfil.email?.trim() || !nuevoPerfil.password?.trim() || !nuevoPerfil.rol) {
      setErrorLocal("Por favor, complete todos los campos marcados con asterisco (*).");
      return;
    }

    if (nuevoPerfil.password.length < 6) {
      setErrorLocal("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    try {
      await agregarPerfil();
    } catch (err) {
      setErrorLocal("Ocurrió un error al procesar el registro.");
    } finally {
      setCargando(false);
    }
  };

  // --- LÓGICA DE TECLA ENTER ---
  useEffect(() => {
    const detectarEnter = (e) => {
      if (mostrarModal && e.key === "Enter" && !cargando) {
        // Solo disparamos si el nombre y el correo tienen algo (mínimo requerido)
        if (nuevoPerfil.nombre_completo?.trim() && nuevoPerfil.email?.trim()) {
          handleRegistrar();
        }
      }
    };

    if (mostrarModal) {
      window.addEventListener("keydown", detectarEnter);
    }

    return () => {
      window.removeEventListener("keydown", detectarEnter);
    };
  }, [mostrarModal, cargando, nuevoPerfil]);

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
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      centered
      style={{ backdropFilter: "blur(6px)" }}
    >
      <div style={estilos.modalContent}>
        <Form onSubmit={handleRegistrar}>
          <Modal.Header closeButton style={estilos.header}>
            <Modal.Title style={estilos.title}>Nuevo Perfil</Modal.Title>
          </Modal.Header>

          <Modal.Body style={estilos.body}>
            {errorLocal && (
              <Alert variant="danger" className="rounded-3 border-0 shadow-sm">
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                {errorLocal}
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label style={estilos.label}>Nombre Completo *</Form.Label>
              <Form.Control
                name="nombre_completo"
                type="text"
                placeholder="Nombre del empleado"
                value={nuevoPerfil.nombre_completo || ""}
                onChange={validarSoloLetras}
                style={estilos.input}
                className="shadow-sm"
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Correo Electrónico *</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={nuevoPerfil.email || ""}
                    onChange={manejoCambioInput}
                    style={estilos.input}
                    className="shadow-sm"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Contraseña *</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="Mín. 6 caracteres"
                    value={nuevoPerfil.password || ""}
                    onChange={manejoCambioInput}
                    style={estilos.input}
                    className="shadow-sm"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label style={estilos.label}>Rol del Sistema *</Form.Label>
                  <Form.Select
                    name="rol"
                    value={nuevoPerfil.rol || ""}
                    onChange={manejoCambioInput}
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
                    name="telefono"
                    type="text"
                    placeholder="8888-8888"
                    value={nuevoPerfil.telefono || ""}
                    onChange={validarTelefono}
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
              onClick={() => setMostrarModal(false)} 
              disabled={cargando}
              style={{ borderRadius: "10px", padding: "10px 20px", fontWeight: "600" }}
            >
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={cargando}
              style={estilos.btnPrimary}
            >
              {cargando ? "Registrando..." : "Guardar Perfil"}
            </Button>
          </Modal.Footer>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalRegistroPerfil;