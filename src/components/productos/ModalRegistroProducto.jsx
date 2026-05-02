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

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Nuevo Producto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>
            {/* Categoría */}
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría *</Form.Label>
                <Form.Select
                  name="categoria_producto"
                  value={nuevoProducto.categoria_producto || ""}
                  onChange={manejoCambioInput}
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
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={nuevoProducto.nombre || ""}
                  onChange={manejoCambioInput}
                  placeholder="Nombre del producto"
                  required
                />
              </Form.Group>
            </Col>

            {/* Precio de Compra */}
            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Precio de compra *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="precio_compra"
                  value={nuevoProducto.precio_compra || ""}
                  onChange={manejoCambioInput}
                  placeholder="0.00"
                  required
                />
              </Form.Group>
            </Col>

            {/* Precio de Venta */}
            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Precio de venta *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="precio_venta"
                  value={nuevoProducto.precio_venta || ""}
                  onChange={manejoCambioInput}
                  placeholder="0.00"
                  required
                />
              </Form.Group>
            </Col>

            {/* Stock */}
            <Col xs={12} md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Stock Inicial *</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  name="stock"
                  value={nuevoProducto.stock || ""}
                  onChange={manejoCambioInput}
                  placeholder="0"
                  required
                />
              </Form.Group>
            </Col>

            {/* Imagen */}
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label>Imagen del producto *</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={manejoCambioArchivo}
                  required
                />
              </Form.Group>
            </Col>

            {/* URL de Imagen (Opcional, si se prefiere pegar un link) */}
            <Col xs={12}>
              <Form.Group className="mb-3">
                <Form.Label>URL de Imagen (Opcional)</Form.Label>
                <Form.Control
                  type="text"
                  name="url_imagen"
                  value={nuevoProducto.url_imagen || ""}
                  onChange={manejoCambioInput}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setMostrarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleAgregar} disabled={deshabilitado}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;