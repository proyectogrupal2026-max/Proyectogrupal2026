import React, { useState, useEffect } from "react";
import { Container, Table, Button, Card, Row, Col, InputGroup, Form, Badge, Pagination } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalDetalleVenta from "../components/ventas/ModalDetalleVenta";
import ModalRegistrarVenta from "../components/ventas/ModalRegistroVenta"; 

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [showDetalle, setShowDetalle] = useState(false);
  const [showRegistrar, setShowRegistrar] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  
  const [paginaActual, setPaginaActual] = useState(1);
  const [ventasPorPagina] = useState(5); 

  useEffect(() => {
    obtenerVentas();
  }, []);

  const obtenerVentas = async () => {
    const { data, error } = await supabase
      .from("ventas")
      .select(`id, fecha_venta, estado`)
      .order("id", { ascending: false });

    if (error) console.error("Error:", error.message);
    else setVentas(data || []);
  };

  const ventasFiltradas = ventas.filter((v) => {
    if (!filtroFecha) return true;
    const fechaVentaDB = v.fecha_venta.split('T')[0]; 
    return fechaVentaDB === filtroFecha;
  });

  const indiceUltimaVenta = paginaActual * ventasPorPagina;
  const indicePrimeraVenta = indiceUltimaVenta - ventasPorPagina;
  const ventasPaginadas = ventasFiltradas.slice(indicePrimeraVenta, indiceUltimaVenta);
  const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);

  const abrirDetalle = (id) => {
    setVentaSeleccionada(id);
    setShowDetalle(true);
  };

  return (
    <Container className="py-3">
      {/* Encabezado más compacto */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold text-dark m-0">
          <i className="bi bi-receipt-cutoff text-primary me-2"></i>
          Ventas Realizadas
        </h3>
        <Button 
          variant="primary" 
          size="sm"
          className="fw-bold px-3 shadow-sm rounded-pill"
          onClick={() => setShowRegistrar(true)} 
        >
          <i className="bi bi-plus-lg me-1"></i> Nueva Venta
        </Button>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-3"> {/* Reducimos padding del Card */}
          <Row className="mb-3">
            <Col md={3}> {/* Columna más angosta */}
              <Form.Group>
                <Form.Label className="text-muted mb-1" style={{ fontSize: '0.8rem', fontWeight: '700' }}>
                  FILTRAR POR FECHA:
                </Form.Label>
                <InputGroup size="sm" className="shadow-sm border rounded">
                  <InputGroup.Text className="bg-white border-0 text-primary">
                    <i className="bi bi-calendar3"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="date"
                    className="border-0 ps-0"
                    value={filtroFecha}
                    onChange={(e) => {
                      setFiltroFecha(e.target.value);
                      setPaginaActual(1);
                    }}
                  />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <div className="table-responsive">
            <Table hover size="sm" className="align-middle mb-0"> {/* size="sm" ajusta el espacio */}
              <thead className="bg-light">
                <tr className="text-secondary" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  <th className="py-2 ps-3 border-0">ID VENTA</th>
                  <th className="py-2 border-0">FECHA Y HORA</th>
                  <th className="py-2 text-center border-0">ESTADO</th>
                  <th className="py-2 text-end pe-4 border-0">ACCIÓN</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.9rem' }}>
                {ventasPaginadas.length > 0 ? (
                  ventasPaginadas.map((v) => (
                    <tr key={v.id} className="border-bottom">
                      <td className="ps-3 fw-bold text-muted py-2">#{v.id}</td>
                      <td className="py-2">
                        {new Date(v.fecha_venta).toLocaleString('es-NI', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit', hour12: true
                        })}
                      </td>
                      <td className="text-center py-2">
                        <Badge 
                          bg={v.estado === "Completado" ? "success" : "warning"}
                          className="fw-normal rounded-pill"
                          style={{ fontSize: '0.75rem', padding: '0.4em 0.8em' }}
                        >
                          {v.estado}
                        </Badge>
                      </td>
                      <td className="text-end pe-3 py-2">
                        <Button 
                          variant="light" 
                          className="rounded-circle shadow-sm border p-0"
                          style={{ width: '32px', height: '32px' }}
                          onClick={() => abrirDetalle(v.id)}
                        >
                          <i className="bi bi-eye-fill text-primary" style={{ fontSize: '0.85rem' }}></i>
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted small">
                      Sin registros de ventas.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Paginación más pequeña */}
          {totalPaginas > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination size="sm" className="mb-0">
                <Pagination.Prev onClick={() => setPaginaActual(p => Math.max(1, p - 1))} disabled={paginaActual === 1} />
                {[...Array(totalPaginas).keys()].map((n) => (
                  <Pagination.Item key={n + 1} active={n + 1 === paginaActual} onClick={() => setPaginaActual(n + 1)}>
                    {n + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))} disabled={paginaActual === totalPaginas} />
              </Pagination>
            </div>
          )}
        </Card.Body>
      </Card>

      <ModalDetalleVenta show={showDetalle} onHide={() => setShowDetalle(false)} ventaId={ventaSeleccionada} />
      <ModalRegistrarVenta show={showRegistrar} onHide={() => setShowRegistrar(false)} recargar={obtenerVentas} />
    </Container>
  );
};

export default Ventas;