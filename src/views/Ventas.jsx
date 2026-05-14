import React, { useState, useEffect } from "react";
import { Container, Table, Button, Card, Form, Badge, Pagination, InputGroup, Row, Col } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalDetalleVenta from "../components/ventas/ModalDetalleVenta";
import ModalRegistrarVenta from "../components/ventas/ModalRegistroVenta";

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [showDetalle, setShowDetalle] = useState(false);
  const [showRegistrar, setShowRegistrar] = useState(false);
  const [ventaSeleccionadaId, setVentaSeleccionadaId] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [ventasPorPagina] = useState(5);

  useEffect(() => { obtenerVentas(); }, []);

  const obtenerVentas = async () => {
    const { data, error } = await supabase
      .from("ventas")
      .select("id, fecha_venta, estado, total")
      .order("id", { ascending: false });

    if (!error) setVentas(data || []);
  };

  const ventasFiltradas = ventas.filter((v) => !filtroFecha || v.fecha_venta.split('T')[0] === filtroFecha);
  const indiceUltima = paginaActual * ventasPorPagina;
  const ventasPaginadas = ventasFiltradas.slice(indiceUltima - ventasPorPagina, indiceUltima);
  const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);

  return (
    <Container className="py-4 mt-2" style={{ maxWidth: '1100px' }}>
      {/* CABECERA */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0 d-flex align-items-center">
          <i className="bi bi-receipt text-primary me-3"></i>
          Ventas Realizadas
        </h3>
        <Button
          variant="primary"
          className="rounded-3 px-3 py-2 fw-bold shadow-sm border-0"
          style={{ fontSize: '1rem' }}
          onClick={() => setShowRegistrar(true)}
        >
          <i className="bi bi-plus-lg"></i>
          <span className="d-none d-lg-inline"> Nueva Venta</span>
        </Button>
      </div>

      {/* FILTRO DE FECHA */}
      <Row className="mb-4">
        <Col xs={12} sm={8} md={5} lg={4}>
          <InputGroup className="shadow-sm rounded-3 border bg-white overflow-hidden">
            <InputGroup.Text className="bg-white border-0 text-primary pe-1">
              <i className="bi bi-calendar3 fs-5"></i>
            </InputGroup.Text>

            <div className="flex-grow-1 position-relative d-flex align-items-center">
              {!filtroFecha && (
                <div
                  className="position-absolute start-0 ms-2 text-muted fw-medium d-md-none"
                  style={{ pointerEvents: 'none', fontSize: '1rem' }}
                >
                  Filtrar por fecha...
                </div>
              )}

              <Form.Control
                type="date"
                className="border-0 fw-bold text-dark"
                style={{
                  fontSize: '1rem',
                  minHeight: '48px',
                  background: 'transparent',
                  cursor: 'pointer'
                }}
                value={filtroFecha}
                onChange={(e) => { setFiltroFecha(e.target.value); setPaginaActual(1); }}
              />
            </div>

            {filtroFecha && (
              <Button
                variant="white"
                className="border-0 text-danger px-3"
                onClick={() => { setFiltroFecha(""); setPaginaActual(1); }}
              >
                <i className="bi bi-x-lg"></i>
              </Button>
            )}
          </InputGroup>
        </Col>
      </Row>

      {/* VISTA PC: TABLA GRANDE ENFOCADA Y CENTRADA */}
      <div className="d-none d-md-block bg-white rounded-4 shadow-sm border-0 overflow-hidden">
        <Table hover responsive className="align-middle mb-0 text-center" style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead className="bg-light border-bottom">
            <tr className="text-secondary" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              <th className="py-4 border-0 fw-bolder text-uppercase" style={{ width: '15%' }}>ID Venta</th>
              <th className="py-4 border-0 fw-bolder text-uppercase" style={{ width: '35%' }}>Fecha y Hora</th>
              <th className="py-4 border-0 fw-bolder text-uppercase" style={{ width: '20%' }}>Total</th>
              <th className="py-4 border-0 fw-bolder text-uppercase" style={{ width: '18%' }}>Estado</th>
              <th className="py-4 border-0 fw-bolder text-uppercase" style={{ width: '12%' }}>Acción</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '1rem' }}>
            {ventasPaginadas.map((v) => (
              <tr key={v.id} className="border-bottom-light">
                <td className="py-4 fw-bold text-primary" style={{ fontSize: '1.1rem' }}>#{v.id}</td>
                <td className="py-4">
                  <div className="d-flex flex-column align-items-center">
                    <span className="fw-semibold text-dark">
                      {new Date(v.fecha_venta).toLocaleDateString('es-NI')}
                    </span>
                    <small className="text-muted" style={{ fontSize: '0.85rem' }}>
                      {new Date(v.fecha_venta).toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit' })}
                    </small>
                  </div>
                </td>
                <td className="py-4 fw-bold text-dark" style={{ fontSize: '1.1rem' }}>
                  C$ {parseFloat(v.total || 0).toLocaleString()}
                </td>
                <td className="py-4">
                  <Badge pill className="bg-success-subtle text-success border px-4 py-2 fw-bold" style={{ fontSize: '0.85rem', display: 'inline-block', minWidth: '100px' }}>
                    {v.estado.toUpperCase()}
                  </Badge>
                </td>
                <td className="py-4">
                  <Button
                    variant="light"
                    className="rounded-3 border shadow-sm p-0 d-inline-flex align-items-center justify-content-center"
                    style={{ width: '42px', height: '42px' }}
                    onClick={() => { setVentaSeleccionadaId(v.id); setShowDetalle(true); }}
                  >
                    <i className="bi bi-eye-fill text-primary fs-5"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* VISTA MÓVIL: CARDS */}
      <div className="d-md-none d-flex flex-column gap-3">
        {ventasPaginadas.length > 0 ? (
          ventasPaginadas.map((v) => (
            <Card key={v.id} className="border-0 shadow-sm rounded-4 overflow-hidden">
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary-subtle rounded-3 p-2 me-3 text-primary d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                      <i className="bi bi-receipt fs-3"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.1rem' }}>Venta #{v.id}</h6>
                      <small className="text-muted d-block">{new Date(v.fecha_venta).toLocaleDateString('es-NI')}</small>
                      <small className="fw-bold text-primary" style={{ fontSize: '1rem' }}>C$ {parseFloat(v.total || 0).toLocaleString()}</small>
                    </div>
                  </div>
                  <Button
                    variant="white"
                    className="rounded-circle border shadow-sm p-0 d-flex align-items-center justify-content-center"
                    style={{ width: '45px', height: '45px' }}
                    onClick={() => { setVentaSeleccionadaId(v.id); setShowDetalle(true); }}
                  >
                    <i className="bi bi-chevron-right text-primary fs-5"></i>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-search fs-1 d-block mb-2"></i>
            No hay ventas registradas.
          </div>
        )}
      </div>

      {/* PAGINACIÓN GRANDE */}
      {totalPaginas > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {[...Array(totalPaginas)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === paginaActual}
                onClick={() => setPaginaActual(i + 1)}
                className="mx-1"
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}

      {showDetalle && (
        <ModalDetalleVenta
          show={showDetalle}
          onHide={() => setShowDetalle(false)}
          ventaId={ventaSeleccionadaId}
        />
      )}

      <ModalRegistrarVenta
        show={showRegistrar}
        onHide={() => setShowRegistrar(false)}
        recargar={obtenerVentas}
      />
    </Container>
  );
};

export default Ventas;