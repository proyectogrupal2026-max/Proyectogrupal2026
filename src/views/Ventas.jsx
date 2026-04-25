import React, { useState, useEffect } from "react";
import { Container, Table, Button, Card, Form, Badge, Pagination, InputGroup } from "react-bootstrap";
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

  useEffect(() => { obtenerVentas(); }, []);

  const obtenerVentas = async () => {
    const { data, error } = await supabase.from("ventas").select(`id, fecha_venta, estado`).order("id", { ascending: false });
    if (!error) setVentas(data || []);
  };

  const ventasFiltradas = ventas.filter((v) => !filtroFecha || v.fecha_venta.split('T')[0] === filtroFecha);
  const indiceUltima = paginaActual * ventasPorPagina;
  const ventasPaginadas = ventasFiltradas.slice(indiceUltima - ventasPorPagina, indiceUltima);
  const totalPaginas = Math.ceil(ventasFiltradas.length / ventasPorPagina);

  return (
    <Container className="py-3 mt-2" style={{ maxWidth: '1000px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold m-0 d-flex align-items-center">
          <i className="bi bi-receipt text-primary me-2 fs-3"></i> Ventas Realizadas
        </h4>
        <Button variant="primary" size="sm" className="rounded-pill px-3 fw-bold shadow-sm" onClick={() => setShowRegistrar(true)}>
          + Nueva Venta
        </Button>
      </div>

      <div className="mb-3">
        <InputGroup size="sm" style={{ maxWidth: '200px' }} className="shadow-sm rounded">
          <InputGroup.Text className="bg-white border-0 text-primary"><i className="bi bi-calendar3"></i></InputGroup.Text>
          <Form.Control type="date" className="border-0 ps-0" value={filtroFecha} onChange={(e) => { setFiltroFecha(e.target.value); setPaginaActual(1); }} />
        </InputGroup>
      </div>

      {/* VISTA PC */}
      <div className="d-none d-md-block bg-white rounded-3 shadow-sm border overflow-hidden">
        <Table hover className="align-middle mb-0">
          <thead className="bg-light">
            <tr className="text-muted" style={{ fontSize: '0.75rem' }}>
              <th className="py-3 ps-4 border-0">ID VENTA</th>
              <th className="py-3 border-0">FECHA Y HORA</th>
              <th className="py-3 text-center border-0">ESTADO</th>
              <th className="py-3 text-center border-0">ACCIÓN</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '0.85rem' }}>
            {ventasPaginadas.map((v) => (
              <tr key={v.id} className="border-top">
                <td className="py-2 ps-4 fw-bold text-secondary">#{v.id}</td>
                <td className="py-2">{new Date(v.fecha_venta).toLocaleString('es-NI')}</td>
                <td className="text-center py-2"><Badge bg="success" className="rounded-pill px-3">{v.estado}</Badge></td>
                <td className="text-center py-2">
                  <Button variant="white" className="rounded-circle border shadow-sm p-0" style={{ width: '32px', height: '32px' }} onClick={() => { setVentaSeleccionada(v.id); setShowDetalle(true); }}>
                    <i className="bi bi-eye-fill text-primary"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* VISTA MÓVIL (CARDS) */}
      <div className="d-md-none d-flex flex-column gap-3">
        {ventasPaginadas.map((v) => (
          <Card key={v.id} className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="bg-primary-subtle rounded-3 p-2 me-3 text-primary"><i className="bi bi-receipt fs-4"></i></div>
                  <div><h6 className="fw-bold mb-0">Venta #{v.id}</h6><small className="text-muted">{new Date(v.fecha_venta).toLocaleDateString()}</small></div>
                </div>
                <Button variant="white" className="rounded-circle border shadow-sm p-2" onClick={() => { setVentaSeleccionada(v.id); setShowDetalle(true); }}><i className="bi bi-eye-fill text-primary"></i></Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
      <ModalDetalleVenta show={showDetalle} onHide={() => setShowDetalle(false)} ventaId={ventaSeleccionada} />
      <ModalRegistrarVenta show={showRegistrar} onHide={() => setShowRegistrar(false)} recargar={obtenerVentas} />
    </Container>
  );
};
export default Ventas;