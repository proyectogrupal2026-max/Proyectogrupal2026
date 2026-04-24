import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalDetalleVenta = ({ show, onHide, ventaId }) => {
  const [detalles, setDetalles] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (show && ventaId) {
      obtenerDetalles();
    }
  }, [show, ventaId]);

  const obtenerDetalles = async () => {
    try {
      setCargando(true);
      // Hacemos el join con la tabla productos para traer el 'nombre'
      const { data, error } = await supabase
        .from("detalles_ventas")
        .select(`
          id,
          cantidad,
          precio_venta,
          productos ( nombre )
        `)
        .eq("venta_id", ventaId);

      if (error) throw error;
      setDetalles(data || []);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setCargando(false);
    }
  };

  const calcularTotal = () => {
    return detalles.reduce((acc, item) => acc + (item.cantidad * item.precio_venta), 0);
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>Detalle de Venta # {ventaId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cargando ? (
          <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div>
        ) : detalles.length > 0 ? (
          <>
            <Table hover responsive size="sm">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Cant.</th>
                  <th className="text-end">Precio</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((d) => (
                  <tr key={d.id}>
                    <td>{d.productos?.nombre}</td>
                    <td className="text-center">{d.cantidad}</td>
                    <td className="text-end">C$ {d.precio_venta}</td>
                    <td className="text-end">C$ {(d.cantidad * d.precio_venta).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="text-end mt-3 border-top pt-2">
              <h5>Total Facturado: <span className="text-success">C$ {calcularTotal().toFixed(2)}</span></h5>
            </div>
          </>
        ) : (
          <Alert variant="warning">No se encontraron detalles para esta venta.</Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetalleVenta;