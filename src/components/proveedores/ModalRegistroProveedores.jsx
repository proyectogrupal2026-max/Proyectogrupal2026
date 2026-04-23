import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroProveedor = ({
  mostrarModal,
  setMostrarModal,
  nuevoProveedor,
  manejoCambioInput,
  agregarProveedor,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleRegistrar = async () => {
    if (deshabilitado) return;

    setDeshabilitado(true);
    await agregarProveedor();
    setDeshabilitado(false);
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Proveedor</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={nuevoProveedor.nombre}
              onChange={manejoCambioInput}
              placeholder="Ingresa el nombre del proveedor"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={nuevoProveedor.telefono}
              onChange={manejoCambioInput}
              placeholder="Ingresa el teléfono"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="direccion"
              value={nuevoProveedor.direccion}
              onChange={manejoCambioInput}
              placeholder="Ingresa la dirección"
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModal(false)}
        >
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={handleRegistrar}
          disabled={!nuevoProveedor.nombre.trim() || deshabilitado}
        >
          {deshabilitado ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProveedor;