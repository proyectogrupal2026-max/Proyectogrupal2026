import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Spinner } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalDetalleCompra = ({ show, onHide, compraId }) => {
  const [detalles, setDetalles] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => { if (show && compraId) cargarDetalles(); }, [show, compraId]);

  const cargarDetalles = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from("detalles_compras")
      .select(`id, cantidad, precio_compra, productos ( nombre )`)
      .eq("compra_id", compraId);

    if (error) console.error(error);
    else setDetalles(data || []);
    setCargando(false);
  };

  const total = detalles.reduce((acc, d) => acc + (d.cantidad * d.precio_compra), 0);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-dark text-white py-2"><Modal.Title className="small fw-bold">DETALLE COMPRA #{compraId}</Modal.Title></Modal.Header>
      <Modal.Body className="p-0">
        {cargando ? <div className="text-center py-3"><Spinner animation="border" size="sm" /></div> : (
          <Table size="sm" className="mb-0 small">
            <thead className="bg-light"><tr><th className="ps-3">Producto</th><th className="text-center">Cant.</th><th className="text-end pe-3">Subtotal</th></tr></thead>
            <tbody>
              {detalles.map(d => (
                <tr key={d.id}>
                  <td className="ps-3">{d.productos?.nombre}</td>
                  <td className="text-center">{d.cantidad}</td>
                  <td className="text-end pe-3">C$ {(d.cantidad * d.precio_compra).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="table-secondary fw-bold text-end"><td colSpan="2">TOTAL:</td><td className="pe-3 text-primary">C$ {total.toFixed(2)}</td></tr>
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
};
export default ModalDetalleCompra;