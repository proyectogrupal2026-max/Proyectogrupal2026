import React, { useState } from "react";
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

  const handleRegistrar = async (e) => {
    e.preventDefault();
    setErrorLocal("");

    // Validación manual antes de enviar
    if (!nuevoPerfil.nombre_completo || !nuevoPerfil.email || !nuevoPerfil.password || !nuevoPerfil.rol) {
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
      // Si el padre cierra el modal, no hace falta resetear cargando aquí,
      // pero por seguridad lo manejamos en el finally.
    } catch (err) {
      setErrorLocal("Ocurrió un error al procesar el registro.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Perfil de Usuario</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleRegistrar}>
        <Modal.Body>
          {errorLocal && <Alert variant="danger">{errorLocal}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Nombre Completo *</Form.Label>
            <Form.Control
              name="nombre_completo"
              type="text"
              placeholder="Nombre del empleado"
              value={nuevoPerfil.nombre_completo || ""}
              onChange={manejoCambioInput}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico *</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={nuevoPerfil.email || ""}
                  onChange={manejoCambioInput}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña *</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Mín. 6 caracteres"
                  value={nuevoPerfil.password || ""}
                  onChange={manejoCambioInput}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Rol del Sistema *</Form.Label>
                <Form.Select
                  name="rol"
                  value={nuevoPerfil.rol || ""}
                  onChange={manejoCambioInput}
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
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  name="telefono"
                  type="text"
                  placeholder="8888-8888"
                  value={nuevoPerfil.telefono || ""}
                  onChange={manejoCambioInput}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)} disabled={cargando}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={cargando}>
            {cargando ? "Registrando..." : "Guardar Perfil"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalRegistroPerfil;