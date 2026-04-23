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

  const handleActualizar = async (e) => {
    if (e) e.preventDefault(); // Por si se dispara desde un submit de Form
    
    if (!perfilEditar.nombre_completo?.trim() || !perfilEditar.rol?.trim()) {
      setErrorLocal("Nombre y Rol son campos obligatorios.");
      return;
    }

    setDeshabilitado(true);
    setErrorLocal("");

    try {
      await actualizarPerfil();
      // El modal suele cerrarse en el padre tras éxito
    } catch (err) {
      setErrorLocal("Error al actualizar el perfil. Intenta de nuevo.");
      setDeshabilitado(false);
    }
  };

  return (
    <Modal
      show={mostrarModalEdicion}
      onHide={() => setMostrarModalEdicion(false)}
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Perfil de Usuario</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleActualizar}>
        <Modal.Body>
          {errorLocal && <Alert variant="danger">{errorLocal}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Nombre Completo *</Form.Label>
            <Form.Control
              type="text"
              name="nombre_completo"
              value={perfilEditar.nombre_completo || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el nombre completo"
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Rol del Sistema *</Form.Label>
                <Form.Select
                  name="rol"
                  value={perfilEditar.rol || ""}
                  onChange={manejoCambioInputEdicion}
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
                  type="text"
                  name="telefono"
                  value={perfilEditar.telefono || ""}
                  onChange={manejoCambioInputEdicion}
                  placeholder="8888-8888"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setMostrarModalEdicion(false)}
            disabled={deshabilitado}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            type="submit"
            disabled={deshabilitado}
          >
            {deshabilitado ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalEdicionPerfil;