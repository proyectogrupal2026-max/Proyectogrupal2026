import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroProducto = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  categorias,
  manejoCambioInput,
  agregarProducto,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleRegistrar = async () => {
    if (deshabilitado) return;

    setDeshabilitado(true);
    await agregarProducto();
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
        <Modal.Title>Agregar Producto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={nuevoProducto.nombre}
              onChange={manejoCambioInput}
              placeholder="Ingresa el nombre del producto"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="categorias_id"
              value={nuevoProducto.categorias_id}
              onChange={manejoCambioInput}
            >
              <option value="">Selecciona una categoría</option>

              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre_categoria}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio de Compra</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="0.01"
              name="precio_compra"
              value={nuevoProducto.precio_compra}
              onChange={manejoCambioInput}
              placeholder="0.00"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio de Venta</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="0.01"
              name="precio_venta"
              value={nuevoProducto.precio_venta}
              onChange={manejoCambioInput}
              placeholder="0.00"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              min="0"
              name="stock"
              value={nuevoProducto.stock}
              onChange={manejoCambioInput}
              placeholder="0"
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
          disabled={
            nuevoProducto.nombre.trim() === "" ||
            nuevoProducto.precio_compra === "" ||
            nuevoProducto.precio_venta === "" ||
            nuevoProducto.stock === "" ||
            deshabilitado
          }
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;