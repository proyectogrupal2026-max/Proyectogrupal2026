import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Table, Row, Col } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalRegistrarCompra = ({ show, onHide, recargar }) => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [proveedorId, setProveedorId] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => { if (show) cargarDatos(); }, [show]);

  const cargarDatos = async () => {
    const { data: p } = await supabase.from("productos").select("id, nombre, precio_compra, stock");
    const { data: prov } = await supabase.from("proveedores").select("id, nombre");
    setProductos(p || []);
    setProveedores(prov || []);
  };

  const limpiarFormulario = () => {
    setCarrito([]);
    setProveedorId("");
  };

  const agregarAlCarrito = (e) => {
    const id = parseInt(e.target.value);
    if (!id) return;
    const prod = productos.find(p => p.id === id);
    if (!carrito.find(item => item.id === id)) {
      setCarrito([...carrito, { id: prod.id, nombre: prod.nombre, precio: prod.precio_compra, cantidad: 1 }]);
    }
    e.target.value = "";
  };

  const guardarCompra = async () => {
    if (!proveedorId || carrito.length === 0) return;
    setCargando(true);
    try {
      const { data: comp, error: errC } = await supabase.from("compras")
        .insert([{ proveedor_id: parseInt(proveedorId) }]).select().single();
      if (errC) throw errC;

      const detalles = carrito.map(i => ({
        compra_id: comp.id,
        producto_id: i.id,
        cantidad: i.cantidad,
        precio_compra: i.precio
      }));
      await supabase.from("detalles_compras").insert(detalles);

      for (const item of carrito) {
        const pActual = productos.find(p => p.id === item.id);
        await supabase.from("productos").update({ stock: pActual.stock + item.cantidad }).eq("id", item.id);
      }

      recargar();
      onHide();
      limpiarFormulario();
    } catch (e) { alert(e.message); }
    finally { setCargando(false); }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton className="bg-primary text-white py-2">
        <Modal.Title className="small fw-bold">NUEVA ENTRADA DE MERCANCÍA</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label className="small fw-bold">PROVEEDOR</Form.Label>
            <Form.Select size="sm" value={proveedorId} onChange={e => setProveedorId(e.target.value)}>
              <option value="">Seleccioná...</option>
              {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label className="small fw-bold">AÑADIR PRODUCTO</Form.Label>
            <Form.Select size="sm" onChange={agregarAlCarrito}>
              <option value="">Buscar...</option>
              {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </Form.Select>
          </Col>
        </Row>
        <Table hover size="sm" className="small">
          <thead className="table-dark">
            <tr><th>Producto</th><th>Cant.</th><th>Costo</th><th>Subtotal</th><th></th></tr>
          </thead>
          <tbody>
            {carrito.map(i => (
              <tr key={i.id}>
                <td className="align-middle">{i.nombre}</td>
                <td><Form.Control size="sm" type="number" style={{ width: '70px' }} value={i.cantidad} onChange={e => setCarrito(carrito.map(c => c.id === i.id ? {...c, cantidad: parseInt(e.target.value) || 0} : c))} /></td>
                <td className="align-middle text-muted">C$ {i.precio}</td>
                <td className="align-middle fw-bold">C$ {(i.cantidad * i.precio).toFixed(2)}</td>
                <td><Button variant="link" className="text-danger p-0" onClick={() => setCarrito(carrito.filter(c => c.id !== i.id))}><i className="bi bi-x-circle"></i></Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" size="sm" onClick={limpiarFormulario} disabled={cargando || (carrito.length === 0 && !proveedorId)}>
          <i className="bi bi-eraser me-1"></i> Limpiar Campos
        </Button>
        <Button variant="primary" size="sm" onClick={guardarCompra} disabled={cargando || carrito.length === 0 || !proveedorId}>
          {cargando ? "Guardando..." : "Registrar Compra"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalRegistrarCompra;