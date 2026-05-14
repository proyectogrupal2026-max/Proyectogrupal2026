import React, { useState, useEffect } from "react";
import { Modal, Table, Row, Col, Badge, Spinner } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalDetalleVenta = ({ show, onHide, ventaId }) => {
  const [venta, setVenta] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [vendedorNombre, setVendedorNombre] = useState("Cargando...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && ventaId) {
      cargarInformacion();
    }
  }, [show, ventaId]);

  const cargarInformacion = async () => {
    setLoading(true);
    try {
      const { data: datosVenta, error: errorVenta } = await supabase
        .from("ventas")
        .select(`
          id,
          fecha_venta,
          total,
          estado,
          vendedor_id,
          clientes (nombre, apellido, telefono)
        `)
        .eq("id", ventaId)
        .single();

      if (errorVenta) throw errorVenta;

      if (datosVenta.vendedor_id) {
        const { data: perfil } = await supabase
          .from("perfiles")
          .select("nombre_completo")
          .eq("user_id", datosVenta.vendedor_id)
          .single();
        setVendedorNombre(perfil?.nombre_completo || "Usuario del Sistema");
      } else {
        setVendedorNombre("Sin asignar");
      }

      const { data: datosDetalles, error: errorDetalles } = await supabase
        .from("detalles_ventas")
        .select(`
          cantidad,
          precio_venta,
          total,
          producto:producto_id (nombre)
        `)
        .eq("venta_id", ventaId);

      if (errorDetalles) throw errorDetalles;

      setVenta(datosVenta);
      setDetalles(datosDetalles || []);

    } catch (error) {
      console.error("Error en MartitaTools:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered border="0">
      <Modal.Header closeButton className="bg-white border-0 pt-4 px-4">
        <Modal.Title className="fw-bold d-flex align-items-center">
          <div className="bg-primary-subtle rounded-3 p-2 me-3 text-primary d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <i className="bi bi-receipt-cutoff fs-4"></i>
          </div>
          Comprobante #{ventaId}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted fw-medium">Sincronizando datos...</p>
          </div>
        ) : venta ? (
          <>
            {/* SECCIÓN DE INFORMACIÓN DEL CLIENTE Y VENTA MEJORADA */}
            <div className="bg-light rounded-4 p-3 mb-4 border border-white shadow-sm">
              <Row className="g-3">
                <Col xs={12} md={5}>
                  <div className="d-flex align-items-start">
                    <i className="bi bi-person-circle text-primary me-2 fs-5"></i>
                    <div>
                      <span className="text-muted small fw-bold text-uppercase d-block" style={{ fontSize: '0.65rem' }}>Información del Cliente</span>
                      <h6 className="fw-bold mb-0 text-dark">
                        {venta.clientes ? `${venta.clientes.nombre} ${venta.clientes.apellido || ""}` : "Consumidor Final"}
                      </h6>
                      {venta.clientes?.telefono && (
                        <small className="text-muted d-block mt-1">
                          <i className="bi bi-telephone me-1"></i> {venta.clientes.telefono}
                        </small>
                      )}
                    </div>
                  </div>
                </Col>
                
                <Col xs={6} md={3}>
                  <div className="d-flex align-items-start">
                    <i className="bi bi-person-badge text-secondary me-2 fs-5"></i>
                    <div>
                      <span className="text-muted small fw-bold text-uppercase d-block" style={{ fontSize: '0.65rem' }}>Vendedor</span>
                      <span className="fw-bold text-dark small">{vendedorNombre}</span>
                    </div>
                  </div>
                </Col>

                <Col xs={6} md={4} className="text-md-end border-start-md">
                  <span className="text-muted small fw-bold text-uppercase d-block" style={{ fontSize: '0.65rem' }}>Fecha de Emisión</span>
                  <span className="fw-bold text-dark d-block">
                    {new Date(venta.fecha_venta).toLocaleString('es-NI', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                  <Badge bg="success" className="mt-1 text-uppercase px-2" style={{ fontSize: '0.7rem' }}>
                    <i className="bi bi-check-circle-fill me-1"></i> {venta.estado}
                  </Badge>
                </Col>
              </Row>
            </div>

            {/* VISTA PC: TABLA */}
            <div className="d-none d-md-block border rounded-3 overflow-hidden shadow-sm bg-white mb-4">
              <Table hover className="mb-0 align-middle">
                <thead className="bg-light border-bottom">
                  <tr className="text-secondary" style={{ fontSize: '0.75rem', letterSpacing: '0.03em' }}>
                    <th className="ps-4 py-3 fw-bolder text-uppercase">Producto</th>
                    <th className="text-center py-3 fw-bolder text-uppercase" style={{ width: '80px' }}>Cant.</th>
                    <th className="text-end py-3 fw-bolder text-uppercase" style={{ width: '150px' }}>Precio Unit.</th>
                    <th className="text-end pe-4 py-3 fw-bolder text-uppercase" style={{ width: '160px' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.95rem' }}>
                  {detalles.map((item, index) => (
                    <tr key={index}>
                      <td className="ps-4 py-3 fw-semibold text-dark">{item.producto?.nombre}</td>
                      <td className="text-center py-3 fw-bold text-muted">{item.cantidad}</td>
                      <td className="text-end py-3 text-secondary">
                        C$ {parseFloat(item.precio_venta).toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-end pe-4 py-3 fw-bold text-primary">
                        C$ {parseFloat(item.total || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {/* VISTA MÓVIL: LISTA */}
            <div className="d-md-none d-flex flex-column gap-2 mb-4">
              <div className="text-muted small fw-bold text-uppercase px-1 mb-1" style={{ fontSize: '0.7rem' }}>Resumen de Artículos</div>
              {detalles.map((item, index) => (
                <div key={index} className="p-3 bg-white rounded-3 border d-flex flex-column gap-2 shadow-xs">
                  <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{item.producto?.nombre}</div>
                  <div className="d-flex justify-content-between align-items-end">
                    <div className="text-muted small">
                      <span className="fw-bold text-dark">{item.cantidad}</span> x C$ {parseFloat(item.precio_venta).toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="fw-bold text-primary">
                      C$ {parseFloat(item.total || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTAL FINAL */}
            <div className="d-flex justify-content-between align-items-center mt-2 pt-3 border-top px-2">
              <span className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.85rem' }}>Total a Pagar</span>
              <div className="text-end">
                <h3 className="fw-bolder text-primary mb-0" style={{ letterSpacing: '-1px' }}>
                  C$ {parseFloat(venta.total || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
          </>
        ) : null}
      </Modal.Body>
    </Modal>
  );
};

export default ModalDetalleVenta;