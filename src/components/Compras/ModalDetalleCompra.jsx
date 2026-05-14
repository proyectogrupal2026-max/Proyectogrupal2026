import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Table, Spinner, Badge } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalDetalleCompra = ({ show, onHide, compraId }) => {
  const [detalles, setDetalles] = useState([]);
  const [datosCompra, setDatosCompra] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (show && compraId) {
      obtenerDetallesCompra();
    }
  }, [show, compraId]);

  const obtenerDetallesCompra = async () => {
    setCargando(true);
    try {
      // 1. Obtener información general de la compra
      const { data: compra, error: errC } = await supabase
        .from("compras")
        .select(`id, fecha_compra, proveedores ( nombre )`)
        .eq("id", compraId)
        .single();

      if (errC) throw errC;
      setDatosCompra(compra);

      // 2. Obtener los productos vinculados a esta compra
      const { data: det, error: errD } = await supabase
        .from("detalles_compras")
        .select(`id, cantidad, precio_compra, productos ( nombre )`)
        .eq("compra_id", compraId);

      if (errD) throw errD;
      setDetalles(det || []);
    } catch (error) {
      console.error("Error obteniendo detalles de compra:", error.message);
    } finally {
      setCargando(false);
    }
  };

  const calcularTotalCompra = () => {
    return detalles.reduce((acc, item) => acc + (item.cantidad * item.precio_compra), 0);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="border-0">
      <Modal.Header closeButton className="bg-white border-0 pt-4 px-4">
        <Modal.Title className="fw-bold d-flex align-items-center">
          <div className="bg-primary-subtle rounded-3 p-2 me-3 text-primary d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <i className="bi bi-cart-check fs-4"></i>
          </div>
          Detalle de Compra #{compraId}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-3 p-md-4 pt-2">
        {cargando ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted small mt-2 mb-0">Cargando información del documento...</p>
          </div>
        ) : (
          <>
            {/* CABECERA INFORMATIVA */}
            {datosCompra && (
              <div className="bg-light rounded-4 p-3 mb-4 border border-white shadow-sm">
                <Row className="g-3">
                  <Col xs={6}>
                    <span className="text-muted small fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.65rem' }}>Proveedor</span>
                    <Badge bg="info" className="rounded-pill text-dark px-3 fw-semibold" style={{ backgroundColor: '#e0f7fa' }}>
                      {datosCompra.proveedores?.nombre}
                    </Badge>
                  </Col>
                  <Col xs={6} className="text-end">
                    <span className="text-muted small fw-bold text-uppercase d-block mb-1" style={{ fontSize: '0.65rem' }}>Fecha de Emisión</span>
                    <span className="fw-bold text-dark small">
                      {new Date(datosCompra.fecha_compra).toLocaleDateString()}
                    </span>
                  </Col>
                </Row>
              </div>
            )}

            {/* TABLA DE PRODUCTOS CON PROTECCIÓN ANTI-DESBORDE */}
            <div className="bg-white rounded-3 border overflow-hidden shadow-sm mb-4" style={{ maxHeight: "260px", overflowY: "auto" }}>
              <Table hover responsive className="align-middle mb-0 size-sm small">
                <thead className="bg-light position-sticky top-0 shadow-sm" style={{ zIndex: 1 }}>
                  <tr className="text-muted" style={{ fontSize: '0.75rem' }}>
                    <th className="py-3 ps-3 border-0">PRODUCTO</th>
                    <th className="py-3 text-center border-0" style={{ width: '90px' }}>CANTIDAD</th>
                    <th className="py-3 text-end border-0" style={{ width: '140px' }}>COSTO UNITARIO</th>
                    <th className="py-3 text-end pe-3 border-0" style={{ width: '140px' }}>SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((item) => (
                    <tr key={item.id} className="border-top">
                      <td className="py-2 ps-3 fw-medium text-dark">{item.productos?.nombre}</td>
                      <td className="py-2 text-center fw-bold text-secondary">{item.cantidad}</td>
                      {/* text-nowrap evita que el C$ se enconche o baje de línea */}
                      <td className="py-2 text-end text-muted text-nowrap">
                        C$ {item.precio_compra.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 text-end fw-bold text-dark pe-3 text-nowrap">
                        C$ {(item.cantidad * item.precio_compra).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* TOTAL COMPRADO */}
            <div className="d-flex justify-content-between align-items-center mt-2 pt-3 border-top px-2">
              <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.85rem' }}>Monto Total Facturado</span>
              <div className="text-end">
                <h3 className="fw-bolder text-primary mb-0 text-nowrap" style={{ letterSpacing: '-1px' }}>
                  C$ {calcularTotalCompra().toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
          </>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 px-4 pb-4 pt-0">
        <Button variant="light" className="fw-bold text-secondary rounded-3 border-0 px-4" onClick={onHide}>
          Cerrar Detalle
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetalleCompra;