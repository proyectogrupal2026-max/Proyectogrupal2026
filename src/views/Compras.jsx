import React, { useState, useEffect } from "react";
import { Container, Table, Button, Form, Pagination } from "react-bootstrap";
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

  useEffect(() => {
    obtenerCompras();
  }, []);

  const obtenerCompras = async () => {
    const { data, error } = await supabase
      .from("compras")
      .select(`id, fecha_compra, proveedores ( nombre )`)
      .order("id", { ascending: false });
    if (!error) setCompras(data || []);
  };

  const comprasFiltradas = compras.filter((c) =>
    c.proveedores?.nombre.toLowerCase().includes(filtroProveedor.toLowerCase())
  );

  const indiceUltimo = paginaActual * registrosPorPagina;
  const indicePrimero = indiceUltimo - registrosPorPagina;
  const registrosPaginados = comprasFiltradas.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(comprasFiltradas.length / registrosPorPagina);

  return (
    /* Reducimos el padding del contenedor y el ancho máximo para que sea compacta */
    <Container className="py-3 mt-2" style={{ maxWidth: '1000px' }}>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold m-0 d-flex align-items-center">
          <i className="bi bi-cart-fill text-primary me-2"></i> Gestión de Compras
        </h4>
        <Button variant="primary" size="sm" className="rounded-pill px-3 fw-bold shadow-sm" onClick={() => setShowRegistrar(true)}>
          + Nueva Compra
        </Button>
      </div>

      {/* Buscador más pequeño y discreto */}
      <div className="mb-3">
        <Form.Control 
          type="text"
          placeholder="Filtrar proveedor..." 
          className="bg-light border-0 py-2 rounded-3 shadow-sm"
          style={{ maxWidth: '250px', fontSize: '0.85rem' }}
          value={filtroProveedor}
          onChange={(e) => { setFiltroProveedor(e.target.value); setPaginaActual(1); }}
        />
      </div>

      {/* Tabla con padding reducido (py-2) para mayor compacidad */}
      <div className="bg-white rounded-3 shadow-sm border overflow-hidden">
        <Table hover responsive className="align-middle mb-0">
          <thead className="bg-light">
            <tr className="text-uppercase x-small fw-bolder text-muted" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
              <th className="py-3 ps-4 border-0">ID Venta</th>
              <th className="py-3 border-0">Fecha y Hora</th>
              <th className="py-3 border-0">Proveedor</th>
              <th className="py-3 text-center border-0">Acción</th>
            </tr>
          </thead>
          <tbody>
            {registrosPaginados.map((c) => (
              <tr key={c.id} className="border-top">
                <td className="py-2 ps-4 fw-bold text-secondary" style={{ fontSize: '0.9rem' }}>#{c.id}</td>
                <td className="py-2 text-muted" style={{ fontSize: '0.85rem' }}>
                  {new Date(c.fecha_compra).toLocaleString('es-NI', { 
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', hour12: true 
                  })}
                </td>
                <td className="py-2">
                  <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2 py-1 fw-medium" style={{ fontSize: '0.75rem' }}>
                    {c.proveedores?.nombre || "N/A"}
                  </span>
                </td>
                <td className="py-2 text-center">
                  <Button 
                    variant="white" 
                    className="rounded-circle border shadow-sm p-1" 
                    style={{ width: '32px', height: '32px' }}
                    onClick={() => { setCompraSeleccionada(c.id); setShowDetalle(true); }}
                  >
                    <i className="bi bi-eye-fill text-primary" style={{ fontSize: '0.9rem' }}></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Paginación pequeña y pegada a la tabla */}
      {totalPaginas > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination size="sm">
            <Pagination.Prev onClick={() => setPaginaActual(p => Math.max(1, p-1))} />
            {[...Array(totalPaginas).keys()].map(n => (
              <Pagination.Item key={n+1} active={n+1 === paginaActual} onClick={() => setPaginaActual(n+1)}>
                {n+1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setPaginaActual(p => Math.min(totalPaginas, p+1))} />
          </Pagination>
        </div>
      )}

      <ModalRegistrarCompra show={showRegistrar} onHide={() => setShowRegistrar(false)} recargar={obtenerCompras} />
      <ModalDetalleCompra show={showDetalle} onHide={() => setShowDetalle(false)} compraId={compraSeleccionada} />
    </Container>
  );
};

export default Compras;