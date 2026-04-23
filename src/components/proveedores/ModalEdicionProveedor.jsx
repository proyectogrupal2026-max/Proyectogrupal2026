import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionProveedor = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  proveedorEditar,
  manejoCambioInputEdicion,
  actualizarProveedor,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  useEffect(() => {
    if (!mostrarModalEdicion) {
      setDeshabilitado(false);
    }
  }, [mostrarModalEdicion]);

  const handleActualizar = async () => {
    if (deshabilitado) return;

    if (!proveedorEditar.nombre?.trim()) return;

    setDeshabilitado(true);
    await actualizarProveedor();
    setDeshabilitado(false);
  };

  return (
    <Modal
      show={mostrarModalEdicion}
      onHide={() => setMostrarModalEdicion(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Editar Proveedor</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={proveedorEditar.nombre || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el nombre del proveedor"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={proveedorEditar.telefono || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa el teléfono"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="direccion"
              value={proveedorEditar.direccion || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ingresa la dirección"
            />
          </Form.Group>
        </Form>
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
          onClick={handleActualizar}
          disabled={!proveedorEditar.nombre?.trim() || deshabilitado}
        >
          {deshabilitado ? "Actualizando..." : "Guardar Cambios"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProveedor;