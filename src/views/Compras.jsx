import React, { useState, useEffect } from "react";
import { Container, Table, Button, Card, Form, Badge, Pagination, InputGroup } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistrarCompra from "../components/Compras/ModalRegistrarCompra";
import ModalDetalleCompra from "../components/Compras/ModalDetalleCompra";

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

  return (
    <Container className="py-3 mt-2" style={{ maxWidth: '1000px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold m-0 d-flex align-items-center">
          <i className="bi bi-cart-check text-primary me-2 fs-3"></i> Gestión de Compras
        </h4>
        <Button variant="primary" size="sm" className="rounded-pill px-3 fw-bold shadow-sm" onClick={() => setShowRegistrar(true)}>
          + Nueva Compra
        </Button>
      </div>

      <div className="mb-3">
        <Form.Control size="sm" type="text" placeholder="Buscar proveedor..." className="bg-light border-0 py-2 rounded-3 shadow-sm" style={{ maxWidth: '250px', fontSize: '0.85rem' }} value={filtroProveedor} onChange={(e) => { setFiltroProveedor(e.target.value); setPaginaActual(1); }} />
      </div>

      {/* VISTA PC */}
      <div className="d-none d-md-block bg-white rounded-3 shadow-sm border overflow-hidden">
        <Table hover className="align-middle mb-0">
          <thead className="bg-light">
            <tr className="text-muted" style={{ fontSize: '0.75rem' }}>
              <th className="py-3 ps-4 border-0">ID COMPRA</th>
              <th className="py-3 border-0">FECHA</th>
              <th className="py-3 border-0">PROVEEDOR</th>
              <th className="py-3 text-center border-0">ACCIÓN</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '0.85rem' }}>
            {registrosPaginados.map((c) => (
              <tr key={c.id} className="border-top">
                <td className="py-2 ps-4 fw-bold text-secondary">#{c.id}</td>
                <td className="py-2">{new Date(c.fecha_compra).toLocaleDateString()}</td>
                <td className="py-2"><Badge bg="info" className="rounded-pill text-dark px-3" style={{ backgroundColor: '#e0f7fa' }}>{c.proveedores?.nombre}</Badge></td>
                <td className="text-center py-2">
                  <Button variant="white" className="rounded-circle border shadow-sm p-0" style={{ width: '32px', height: '32px' }} onClick={() => { setCompraSeleccionada(c.id); setShowDetalle(true); }}>
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
        {registrosPaginados.map((c) => (
          <Card key={c.id} className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="bg-primary-subtle rounded-3 p-2 me-3 text-primary"><i className="bi bi-cart-check fs-4"></i></div>
                  <div><h6 className="fw-bold mb-0">{c.proveedores?.nombre}</h6><small className="text-muted">ID: #{c.id}</small></div>
                </div>
                <Button variant="white" className="rounded-circle border shadow-sm p-2" onClick={() => { setCompraSeleccionada(c.id); setShowDetalle(true); }}><i className="bi bi-eye-fill text-primary"></i></Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
      <ModalRegistrarCompra show={showRegistrar} onHide={() => setShowRegistrar(false)} recargar={obtenerCompras} />
      <ModalDetalleCompra show={showDetalle} onHide={() => setShowDetalle(false)} compraId={compraSeleccionada} />
    </Container>
  );
};
export default Compras;