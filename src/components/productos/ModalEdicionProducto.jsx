import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionProducto = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  productoEditar,
  categorias,
  manejoCambioInputEdicion,
  actualizarProducto,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  useEffect(() => {
    if (!mostrarModalEdicion) {
      setDeshabilitado(false);
    }
  }, [mostrarModalEdicion]);

  const handleActualizar = async () => {
    if (deshabilitado) return;
    if (!productoEditar.nombre?.trim()) return;

    setDeshabilitado(true);
    await actualizarProducto();
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
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Producto *</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={productoEditar.nombre || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="Ej: Martillo de Uña 16oz"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría *</Form.Label>
            <Form.Select
              name="categoria_id"
              value={productoEditar.categoria_id || ""}
              onChange={manejoCambioInputEdicion}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre_categoria}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio de Compra *</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              name="precio_compra"
              value={productoEditar.precio_compra || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="0.00"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio de Venta *</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              name="precio_venta"
              value={productoEditar.precio_venta || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="0.00"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock *</Form.Label>
            <Form.Control
              type="number"
              min="0"
              name="stock"
              value={productoEditar.stock || ""}
              onChange={manejoCambioInputEdicion}
              placeholder="0"
              required
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
          disabled={
            !productoEditar.nombre?.trim() ||
            !productoEditar.categoria_id ||
            deshabilitado
          }
        >
          {deshabilitado ? "Actualizando..." : "Guardar Cambios"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;