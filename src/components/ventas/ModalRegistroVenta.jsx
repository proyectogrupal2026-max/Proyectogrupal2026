import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Table, Alert, InputGroup } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalRegistrarVenta = ({ show, onHide, recargar }) => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Cargar productos desde tu tabla 'productos' 
  useEffect(() => {
    if (show) {
      const cargarProductos = async () => {
        const { data, error } = await supabase
          .from("productos")
          .select("id, nombre, precio_venta, stock");
        
        if (error) console.error("Error:", error.message);
        else setProductos(data || []);
      };
      cargarProductos();
    }
  }, [show]);

  const agregarAlCarrito = (e) => {
    const productoId = parseInt(e.target.value);
    if (!productoId) return;

    const producto = productos.find((p) => p.id === productoId);
    const itemExistente = carrito.find((item) => item.id === producto.id);

    if (itemExistente) {
      actualizarCantidad(producto.id, itemExistente.cantidad + 1);
    } else {
      if (producto.stock <= 0) return alert("Sin stock");
      setCarrito([...carrito, { 
        id: producto.id, 
        nombre: producto.nombre, 
        precio: producto.precio_venta, 
        cantidad: 1,
        stockMax: producto.stock 
      }]);
    }
    e.target.value = ""; 
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    setCarrito(carrito.map(item => {
      if (item.id === id) {
        if (nuevaCantidad > item.stockMax) {
          alert(`Solo hay ${item.stockMax} en stock`);
          return item;
        }
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    }));
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const calcularTotal = () => {
    return carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  };

  const handleGuardarVenta = async () => {
    if (carrito.length === 0) return;
    setCargando(true);

    try {
      // 1. Crear la venta en la tabla 'ventas' 
      const { data: venta, error: errorVenta } = await supabase
        .from("ventas")
        .insert([{ estado: "Completado", fecha_venta: new Date().toISOString() }])
        .select();

      if (errorVenta) throw errorVenta;

      // 2. Crear los detalles en 'detalles_ventas' 
      const detalles = carrito.map((item) => ({
        venta_id: venta[0].id,
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_venta: item.precio 
      }));

      const { error: errorDetalles } = await supabase.from("detalles_ventas").insert(detalles);
      if (errorDetalles) throw errorDetalles;

      // 3. Actualizar stock de cada producto 
      for (const item of carrito) {
        await supabase
          .from("productos")
          .update({ stock: item.stockMax - item.cantidad })
          .eq("id", item.id);
      }

      setCarrito([]);
      recargar();
      onHide();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Punto de Venta - Martita Tools</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-4">
          <Form.Label className="fw-bold">Buscar Producto</Form.Label>
          <Form.Select onChange={agregarAlCarrito}>
            <option value="">-- Seleccioná un producto --</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                {p.nombre} (Stock: {p.stock} | C$ {p.precio_venta})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Table hover responsive className="align-middle">
          <thead className="table-dark">
            <tr>
              <th>Producto</th>
              <th style={{ width: '150px' }}>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>
                  <InputGroup size="sm">
                    <Button variant="outline-secondary" onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}>-</Button>
                    <Form.Control className="text-center" value={item.cantidad} readOnly />
                    <Button variant="outline-secondary" onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}>+</Button>
                  </InputGroup>
                </td>
                <td>C$ {item.precio}</td>
                <td className="fw-bold">C$ {(item.cantidad * item.precio).toFixed(2)}</td>
                <td>
                  <Button variant="link" className="text-danger p-0" onClick={() => eliminarDelCarrito(item.id)}>
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {carrito.length > 0 && (
          <div className="text-end mt-3">
            <h4>Total a Pagar: <span className="text-success">C$ {calcularTotal().toFixed(2)}</span></h4>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant="primary" onClick={handleGuardarVenta} disabled={cargando || carrito.length === 0}>
          {cargando ? "Procesando..." : "Finalizar Venta"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistrarVenta;