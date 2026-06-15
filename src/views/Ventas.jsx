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
  const [imprimiendoId, setImprimiendoId] = useState(null);

  useEffect(() => {
    obtenerVentas();
  }, []);

  const obtenerVentas = async () => {
    const { data, error } = await supabase
      .from("ventas")
      .select("id, fecha_venta, estado, total")
      .order("id", { ascending: false });

    if (!error) setVentas(data || []);
  };

  // --- MOTOR DE IMPRESIÓN HÍBRIDO (MÓVIL / PC) ---
  const ejecutarImpresionRawBT = (venta, detalles) => {
    const nombreMostrar = venta.clientes 
      ? `${venta.clientes.nombre || ""} ${venta.clientes.apellido || ""}`.trim()
      : "Consumidor Final";

    const fecha = venta.fecha_venta
      ? new Date(venta.fecha_venta).toLocaleString("es-NI", {
          year: "2-digit",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

    // Tu diseño de ticket optimizado de 32 caracteres (58mm)
    let ticket = "\n";
    ticket += "======= FERRETERIA MARTITA =====\n";
    ticket += "     Materiales Electricos      \n";
    ticket += "     y Ferreteria General       \n";
    ticket += "--------------------------------\n";
    ticket += `Factura No: #${venta.id || "-"}\n`;
    ticket += `Fecha: ${fecha}\n`;
    ticket += `Cliente: ${nombreMostrar}\n`;
    ticket += "--------------------------------\n";
    ticket += "Cant. Descripcion        Subtot.\n";
    ticket += "--------------------------------\n";

    detalles.forEach((item) => {
      const nombreProducto = (item.producto?.nombre || "Producto").toUpperCase();
      const cantidad = item.cantidad || 0;
      const subtotalNum = parseFloat(item.total || (cantidad * parseFloat(item.precio_venta || 0)));
      const subtotalTexto = `C$${subtotalNum.toFixed(2)}`;

      const descCorta = nombreProducto.substring(0, 18).padEnd(18, " ");
      const cantTexto = cantidad.toString().padStart(3, " ");
      const precioAlineado = subtotalTexto.padStart(9, " ");

      ticket += `${cantTexto}  ${descCorta}${precioAlineado}\n`;
    });

    ticket += "--------------------------------\n";

    const totalNeto = Number(venta.total || 0);
    const subtotalOriginal = totalNeto / 1.10; 
    const calculoIva = totalNeto - subtotalOriginal;

    ticket += `   SUBTOTAL:    C$${subtotalOriginal.toFixed(2).padStart(14, " ")}\n`;
    ticket += `   IVA (10%):   C$${calculoIva.toFixed(2).padStart(14, " ")}\n`;
    ticket += `   TOTAL:       C$${totalNeto.toFixed(2).padStart(14, " ")}\n`;
    ticket += "================================\n";
    ticket += "  ¡Gracias por elegirnos para   \n";
    ticket += "      construir tus proyectos!  \n";
    ticket += "     Revise su mercancia, no    \n";
    ticket += "     se aceptan devoluciones.   \n\n\n\n";

    // DETECCIÓN DE ENTORNO
    const esMovil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (esMovil) {
      // Flujo de Celular: Invocación directa a RawBT sin textos extraños
      const textoCodificado = encodeURIComponent(ticket);
      const androidIntent = `intent:rawbt:${textoCodificado}#Intent;package=ru.a402d.rawbtprinter;end;`;

      const link = document.createElement("a");
      link.href = androidIntent;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Flujo de PC: Creación de ventana temporal limpia para la ticketera conectada a la PC
      const ventanaImpresion = window.open("", "_blank", "width=300,height=600");
      ventanaImpresion.document.write(`
        <html>
          <head>
            <title>Imprimir Factura #${venta.id}</title>
            <style>
              body {
                font-family: 'Courier New', Courier, monospace;
                font-size: 12px;
                white-space: pre;
                margin: 0;
                padding: 10px;
                width: 48mm; /* Ancho ideal para el área de impresión de 58mm */
              }
              @page {
                margin: 0;
              }
            </style>
          </head>
          <body>${ticket.trim()}</body>
        </html>
      `);
      ventanaImpresion.document.close();
      ventanaImpresion.focus();
      // Pequeño timeout para asegurar la carga del texto plano antes de disparar el diálogo
      setTimeout(() => {
        ventanaImpresion.print();
        ventanaImpresion.close();
      }, 250);
    }
  };

  // --- CONSULTA A BASE DE DATOS ---
  const handlePrint = async (idVenta) => {
    try {
      setImprimiendoId(idVenta);

      const { data: venta, error: errorVenta } = await supabase
        .from("ventas")
        .select(`
          id,
          fecha_venta,
          total,
          estado,
          clientes ( nombre, apellido )
        `)
        .eq("id", idVenta)
        .single();

      if (errorVenta || !venta) throw new Error("No se encontró la cabecera");

      const { data: detalles, error: errorDetalles } = await supabase
        .from("detalles_ventas")
        .select(`
          cantidad,
          precio_venta,
          total,
          producto:producto_id ( nombre )
        `)
        .eq("venta_id", idVenta);

      if (errorDetalles) throw errorDetalles;

      ejecutarImpresionRawBT(venta, detalles || []);

    } catch (err) {
      console.error("Error imprimiendo ticket:", err);
      alert("Error al cargar los datos del ticket.");
    } finally {
      setImprimiendoId(null);
    }
  };

  // --- FILTRADO Y PAGINACIÓN ---
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
                <div className="position-absolute start-0 ms-2 text-muted fw-medium d-md-none" style={{ pointerEvents: 'none', fontSize: '1rem' }}>
                  Filtrar por fecha...
                </div>
              )}
              <Form.Control
                type="date"
                className="border-0 fw-bold text-dark"
                style={{ fontSize: '1rem', minHeight: '48px', background: 'transparent', cursor: 'pointer' }}
                value={filtroFecha}
                onChange={(e) => { setFiltroFecha(e.target.value); setPaginaActual(1); }}
              />
            </div>
            {filtroFecha && (
              <Button variant="white" className="border-0 text-danger px-3" onClick={() => { setFiltroFecha(""); setPaginaActual(1); }}>
                <i className="bi bi-x-lg"></i>
              </Button>
            )}
          </InputGroup>
        </Col>
      </Row>

      {/* VISTA PC: TABLA */}
      <div className="d-none d-md-block bg-white rounded-4 shadow-sm border-0 overflow-hidden">
        <Table hover responsive className="align-middle mb-0 text-center" style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead className="bg-light border-bottom">
            <tr className="text-secondary" style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              <th className="py-4 border-0 fw-bolder text-uppercase" style={{ width: '12%' }}>ID Venta</th>
              <th className="py-4 border-0 fw-bolder text-uppercase" style={{ width: '33%' }}>Fecha y Hora</th>
              <th className="py-4 border-0 fw-bolder text-uppercase" style={{ width: '20%' }}>Total</th>
              <th className="py-4 border-0 fw-bolder text-uppercase" style={{ width: '15%' }}>Estado</th>
              <th className="py-4 border-0 fw-bolder text-uppercase" style={{ width: '20%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '1rem' }}>
            {ventasPaginadas.map((v) => (
              <tr key={v.id} className="border-bottom-light">
                <td className="py-4 fw-bold text-primary" style={{ fontSize: '1.1rem' }}>#{v.id}</td>
                <td className="py-4">
                  <div className="d-flex flex-column align-items-center">
                    <span className="fw-semibold text-dark">{new Date(v.fecha_venta).toLocaleDateString('es-NI')}</span>
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
                    {(v.estado || 'completado').toUpperCase()}
                  </Badge>
                </td>
                <td className="py-4">
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      variant="light"
                      className="rounded-3 border shadow-sm p-0 d-inline-flex align-items-center justify-content-center"
                      style={{ width: '42px', height: '42px' }}
                      onClick={() => { setVentaSeleccionadaId(v.id); setShowDetalle(true); }}
                    >
                      <i className="bi bi-eye-fill text-primary fs-5"></i>
                    </Button>
                    <Button
                      variant="light"
                      className="rounded-3 border shadow-sm p-0 d-inline-flex align-items-center justify-content-center"
                      style={{ width: '42px', height: '42px' }}
                      onClick={() => handlePrint(v.id)}
                      disabled={imprimiendoId === v.id}
                    >
                      {imprimiendoId === v.id ? (
                        <span className="spinner-border spinner-border-sm text-success"></span>
                      ) : (
                        <i className="bi bi-printer-fill text-success fs-5"></i>
                      )}
                    </Button>
                  </div>
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
                  
                  <div className="d-flex flex-column gap-2">
                    <Button
                      variant="white"
                      className="rounded-circle border shadow-sm p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '40px', height: '40px' }}
                      onClick={() => { setVentaSeleccionadaId(v.id); setShowDetalle(true); }}
                    >
                      <i className="bi bi-eye-fill text-primary fs-5"></i>
                    </Button>
                    <Button
                      variant="white"
                      className="rounded-circle border shadow-sm p-0 d-flex align-items-center justify-content-center"
                      style={{ width: '40px', height: '40px' }}
                      onClick={() => handlePrint(v.id)}
                      disabled={imprimiendoId === v.id}
                    >
                      {imprimiendoId === v.id ? (
                        <span className="spinner-border spinner-border-sm text-success"></span>
                      ) : (
                        <i className="bi bi-printer-fill text-success fs-5"></i>
                      )}
                    </Button>
                  </div>
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

      {/* PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {[...Array(totalPaginas)].map((_, i) => (
              <Pagination.Item key={i + 1} active={i + 1 === paginaActual} onClick={() => setPaginaActual(i + 1)} className="mx-1">
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}

      {showDetalle && <ModalDetalleVenta show={showDetalle} onHide={() => setShowDetalle(false)} ventaId={ventaSeleccionadaId} />}
      <ModalRegistrarVenta show={showRegistrar} onHide={() => setShowRegistrar(false)} recargar={obtenerVentas} />
    </Container>
  );
};

export default Ventas;