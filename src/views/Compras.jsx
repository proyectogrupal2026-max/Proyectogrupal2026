import React, { useState, useEffect } from "react";
import { Container, Table, Button, Card, Badge, Pagination, Row, Col } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistrarCompra from "../components/compras/ModalRegistrarCompra";
import ModalDetalleCompra from "../components/compras/ModalDetalleCompra";
import NotificacionOperacion from "../components/NotificacionOperacion";

// IMPORTAMOS TU COMPONENTE PERSONALIZADO DE BÚSQUEDA
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [filtroProveedor, setFiltroProveedor] = useState("");
  const [showRegistrar, setShowRegistrar] = useState(false);
  const [showDetalle, setShowDetalle] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina] = useState(5);

  useEffect(() => { obtenerCompras(); }, []);

  const obtenerCompras = async () => {
    const { data, error } = await supabase.from("compras").select(`id, fecha_compra, proveedores ( nombre )`).order("id", { ascending: false });
    if (!error) setCompras(data || []);
  };

  const comprasFiltradas = compras.filter((c) => c.proveedores?.nombre.toLowerCase().includes(filtroProveedor.toLowerCase()));
  const indiceUltimo = paginaActual * registrosPorPagina;
  const registrosPaginados = comprasFiltradas.slice(indiceUltimo - registrosPorPagina, indiceUltimo);
  const totalPaginas = Math.ceil(comprasFiltradas.length / registrosPorPagina);

  const manejarBusqueda = (e) => {
    setFiltroProveedor(e.target.value);
    setPaginaActual(1); // Resetea a la página 1 al escribir
  };

  return (
    <Container className="py-4 mt-2" style={{ maxWidth: '1100px' }}>
      {/* CABECERA */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0 d-flex align-items-center">
          <i className="bi bi-cart-check text-primary me-3"></i> 
          Gestión de Compras
        </h3>
        <Button
          variant="primary"
          className="rounded-3 px-3 py-2 fw-bold shadow-sm border-0"
          style={{ fontSize: '1rem' }}
          onClick={() => setShowRegistrar(true)}
        >
          <i className="bi bi-plus-lg"></i>
          <span className="d-none d-lg-inline"> Nueva Compra</span>
        </Button>
      </div>

      {/* SECCIÓN DEL BUSCADOR USANDO TU COMPONENTE REUTILIZABLE */}
      <Row className="mb-4">
        <Col xs={12} sm={8} md={5} lg={4}>
          <CuadroBusquedas
            textoBusqueda={filtroProveedor}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar proveedor..."
          />
        </Col>
      </Row>

      {/* VISTA PC: TABLA GRANDE ENFOCADA Y CENTRADA */}
      <div className="d-none d-md-block bg-white rounded-4 shadow-sm border-0 overflow-hidden">
        <Table hover responsive className="align-middle mb-0 text-center" style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead className="bg-light border-bottom">
            <tr className="text-secondary" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              <th className="py-4 border-0 fw-bolder text-uppercase" style={{ width: '15%' }}>ID COMPRA</th>
              <th className="py-4 border-0 fw-bolder text-uppercase" style={{ width: '35%' }}>FECHA</th>
              <th className="py-4 border-0 fw-bolder text-uppercase" style={{ width: '38%' }}>PROVEEDOR</th>
              <th className="py-4 border-0 fw-bolder text-uppercase" style={{ width: '12%' }}>ACCIÓN</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '1rem' }}>
            {registrosPaginados.map((c) => (
              <tr key={c.id} className="border-bottom-light">
                <td className="py-4 fw-bold text-primary" style={{ fontSize: '1.1rem' }}>#{c.id}</td>
                <td className="py-4 fw-semibold text-dark">{new Date(c.fecha_compra).toLocaleDateString()}</td>
                <td className="py-4">
                  <Badge pill className="bg-success-subtle text-success border px-4 py-2 fw-bold" style={{ fontSize: '0.85rem', display: 'inline-block', minWidth: '120px' }}>
                    {c.proveedores?.nombre}
                  </Badge>
                </td>
                <td className="py-4">
                  <Button 
                    variant="light" 
                    className="rounded-3 border shadow-sm p-0 d-inline-flex align-items-center justify-content-center" 
                    style={{ width: '42px', height: '42px' }} 
                    onClick={() => { setCompraSeleccionada(c.id); setShowDetalle(true); }}
                  >
                    <i className="bi bi-eye-fill text-primary fs-5"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* VISTA MÓVIL (CARDS) */}
      <div className="d-md-none d-flex flex-column gap-3">
        {registrosPaginados.map((c) => (
          <Card key={c.id} className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="bg-primary-subtle rounded-3 p-2 me-3 text-primary d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <i className="bi bi-cart-check fs-3"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.1rem' }}>{c.proveedores?.nombre}</h6>
                    <small className="text-muted d-block">ID: #{c.id}</small>
                    <small className="text-muted">{new Date(c.fecha_compra).toLocaleDateString()}</small>
                  </div>
                </div>
                <Button 
                  variant="white" 
                  className="rounded-circle border shadow-sm p-0 d-flex align-items-center justify-content-center" 
                  style={{ width: '45px', height: '45px' }}
                  onClick={() => { setCompraSeleccionada(c.id); setShowDetalle(true); }}
                >
                  <i className="bi bi-chevron-right text-primary fs-5"></i>
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* COMPONENTE PAGINACIÓN */}
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

      <ModalRegistrarCompra show={showRegistrar} onHide={() => setShowRegistrar(false)} recargar={obtenerCompras} />
      <ModalDetalleCompra show={showDetalle} onHide={() => setShowDetalle(false)} compraId={compraSeleccionada} />
    </Container>
  );
};
export default Compras;