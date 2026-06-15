import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Form, Button } from "react-bootstrap";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { supabase } from "../database/supabaseconfig";
import { utils, writeFile } from 'xlsx';

export default function Inicio() {
  const [cargando, setCargando] = useState(true);
  
  // Rango de fechas por defecto en formato Nicaragua (YYYY-MM-DD)
  const [fechaDesde, setFechaDesde] = useState(
    new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" })
  );
  const [fechaHasta, setFechaHasta] = useState(
    new Date().toLocaleDateString("en-CA", { timeZone: "America/Managua" })
  );
  
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    productosVendidos: 0,
    cantidadVentas: 0,
    ventasPorHora: [],
    ventasPorCategoria: []
  });

  const COLORES = ["#5e26b2", "#39ff95", "#ff6bc6", "#8b46ff", "#00d4ff", "#ffd93d"];

  useEffect(() => {
    cargarDatos(fechaDesde, fechaHasta);
  }, [fechaDesde, fechaHasta]);

  const cargarDatos = async (desde, hasta) => {
    try {
      setCargando(true);
      
      const inicioRango = `${desde} 00:00:00`;
      const finRango = `${hasta} 23:59:59`;

      // 1. Obtener ventas en el rango seleccionado
      const { data: ventas, error } = await supabase
        .from("ventas")
        .select("id, total, fecha_venta")
        .gte("fecha_venta", inicioRango)
        .lte("fecha_venta", finRango);

      if (error) throw error;

      const totalVentas = ventas?.reduce((sum, v) => sum + (Number(v.total) || 0), 0) || 0;
      const idsVentas = ventas?.map(v => v.id) || [];
      
      let productosVendidosContador = 0;
      let ventasPorCategoriaMapeo = [];

      // 2. Obtener detalles vinculando usando ALIAS seguro para evitar conflictos de mayúsculas
      if (idsVentas.length > 0) {
        const { data: detalles, error: errorDetalles } = await supabase
          .from("detalles_ventas")
          .select(`
            cantidad,
            total,
            producto:producto_id (
              nombre,
              categorias ( nombre_categoria )
            )
          `)
          .in("venta_id", idsVentas);

        if (errorDetalles) throw errorDetalles;

        detalles?.forEach(d => {
          // Sumar unidades vendidas
          productosVendidosContador += Number(d.cantidad) || 0;

          // Extraer nombre de categoría de forma segura usando el alias 'producto'
          const categoria = d.producto?.categorias?.nombre_categoria || "Sin categoría";
          const existente = ventasPorCategoriaMapeo.find(c => c.name === categoria);

          if (existente) {
            existente.value += Number(d.total) || 0;
          } else {
            ventasPorCategoriaMapeo.push({ name: categoria, value: Number(d.total) || 0 });
          }
        });
      }

      ventasPorCategoriaMapeo.sort((a, b) => b.value - a.value);

      // 3. Distribución de ventas por hora local de Nicaragua
      const horaMap = Array(24).fill(0);
      ventas?.forEach(venta => {
        if (!venta.fecha_venta) return;
        
        const fechaObj = new Date(venta.fecha_venta);
        const horaLocal = fechaObj.toLocaleTimeString("en-US", {
          timeZone: "America/Managua",
          hour12: false,
          hour: "2-digit"
        });
        
        const hora = parseInt(horaLocal, 10);
        if (hora >= 0 && hora < 24) {
          horaMap[hora] += Number(venta.total) || 0;
        }
      });

      const ventasPorHora = [];
      for (let h = 8; h <= 22; h++) {
        ventasPorHora.push({
          hora: `${h.toString().padStart(2, "0")}:00`,
          total: Math.round(horaMap[h])
        });
      }

      setEstadisticas({
        totalVentas,
        productosVendidos: productosVendidosContador,
        cantidadVentas: ventas?.length || 0,
        ventasPorHora,
        ventasPorCategoria: ventasPorCategoriaMapeo
      });

    } catch (err) {
      console.error("Error cargando estadísticas en MartitaTools:", err);
    } finally {
      setCargando(false);
    }
  };

  const descargarExcel = async () => {
    try {
      setCargando(true);
      const inicioRango = `${fechaDesde} 00:00:00`;
      const finRango = `${fechaHasta} 23:59:59`;

      const { data: ventas, error: errorVentas } = await supabase
        .from("ventas")
        .select("id, fecha_venta, total, vendedor_id, cliente_id")
        .gte("fecha_venta", inicioRango)
        .lte("fecha_venta", finRango)
        .order("fecha_venta", { ascending: false });

      if (errorVentas) throw errorVentas;

      const idsVentas = ventas?.map(v => v.id) || [];
      let detallesVenta = [];

      if (idsVentas.length > 0) {
        const { data: detalles, error: errorDetalles } = await supabase
          .from("detalles_ventas")
          .select(`
            id,
            venta_id,
            cantidad,
            precio_venta,
            total,
            producto:producto_id (
              nombre,
              categorias ( nombre_categoria )
            )
          `)
          .in("venta_id", idsVentas)
          .order("venta_id");

        if (errorDetalles) console.error("Error en detalles:", errorDetalles);
        else detallesVenta = detalles || [];
      }

      const wb = utils.book_new();

      if (ventas && ventas.length > 0) {
        const ventasFormateadas = ventas.map(v => ({
          "ID Venta": v.id,
          "Fecha": new Date(v.fecha_venta).toLocaleString("es-NI", { timeZone: "America/Managua" }),
          "ID Vendedor": v.vendedor_id,
          "ID Cliente": v.cliente_id,
          "Total C$": Number(v.total)
        }));
        const wsVentas = utils.json_to_sheet(ventasFormateadas);
        utils.book_append_sheet(wb, wsVentas, "Ventas");
      } else {
        utils.book_append_sheet(wb, utils.json_to_sheet([{ Mensaje: "No hay ventas en este rango" }]), "Ventas");
      }

      if (detallesVenta && detallesVenta.length > 0) {
        const detallesFormateados = detallesVenta.map(d => ({
          "ID Detalle": d.id,
          "ID Venta": d.venta_id,
          "Producto": d.producto?.nombre || "N/A",
          "Categoría": d.producto?.categorias?.nombre_categoria || "N/A",
          "Cantidad": d.cantidad,
          "Precio Venta C$": Number(d.precio_venta),
          "Total Línea C$": Number(d.total)
        }));
        const wsDetalles = utils.json_to_sheet(detallesFormateados);
        utils.book_append_sheet(wb, wsDetalles, "Detalles_Ventas");
      } else {
        utils.book_append_sheet(wb, utils.json_to_sheet([{ Mensaje: "No hay detalles" }]), "Detalles_Ventas");
      }

      writeFile(wb, `Reporte_MartitaTools_${fechaDesde}_a_${fechaHasta}.xlsx`);

    } catch (err) {
      console.error("Error generando Excel:", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="mt-2">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2>Dashboard</h2>
          <h6>Estadísticas de MartitaTools</h6>
        </div>
        {cargando && <Spinner animation="border" variant="primary" size="sm" />}
      </div>

      <Row className="mb-4">
        <Col xs={6} md={3}>
          <Form.Group>
            <Form.Label>Desde</Form.Label>
            <Form.Control
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              disabled={cargando}
            />
          </Form.Group>
        </Col>
        <Col xs={6} md={3}>
          <Form.Group>
            <Form.Label>Hasta</Form.Label>
            <Form.Control
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              disabled={cargando}
            />
          </Form.Group>
        </Col>
        <Col md={3} className="d-flex align-items-end mt-2 mt-md-0">
          <Button variant="success" onClick={descargarExcel} disabled={cargando}>
            <i className="bi bi-file-earmark-excel me-2"></i>
            Descargar Excel
          </Button>
        </Col>
      </Row>

      <div style={{ opacity: cargando ? 0.6 : 1, transition: "opacity 0.2s ease" }}>
        <Row className="g-4 mb-5">
          <Col md={6} lg={4}>
            <Card className="h-100 text-white shadow border-0" style={{ background: "linear-gradient(135deg, #28a745, #34ce57)" }}>
              <Card.Body>
                <h5>Ventas Totales</h5>
                <h2>C$ {estadisticas.totalVentas.toFixed(2)}</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="h-100 text-white shadow border-0" style={{ background: "linear-gradient(135deg, #0166d3, #3399ff)" }}>
              <Card.Body>
                <h5>Facturas Emitidas</h5>
                <h2>{estadisticas.cantidadVentas} Ventas</h2>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="h-100 text-white shadow border-0" style={{ background: "linear-gradient(135deg, #e27d01, #ffa500)" }}>
              <Card.Body>
                <h5>Productos Vendidos</h5>
                <h2>{estadisticas.productosVendidos} Unidades</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={8}>
            <Card className="shadow border-0">
              <Card.Body>
                <h5 className="mb-3">Flujo de Ventas por Hora</h5>
                <ResponsiveContainer width="100%" height={360}>
                  <LineChart data={estadisticas.ventasPorHora}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hora" />
                    <YAxis tickFormatter={(v) => `C$ ${v}`} />
                    <Tooltip formatter={(v) => [`C$ ${v}`, "Monto"]} />
                    <Line type="monotone" dataKey="total" stroke="#5e26b2" strokeWidth={4} dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="shadow border-0">
              <Card.Body>
                <h5 className="mb-3">Ventas por Categoría</h5>
                <ResponsiveContainer width="100%" height={360}>
                  <PieChart>
                    <Pie
                      data={estadisticas.ventasPorCategoria.length > 0 ? estadisticas.ventasPorCategoria : [{ name: "Sin datos", value: 0.1 }]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      label
                    >
                      {estadisticas.ventasPorCategoria.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORES[i % COLORES.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => `C$ ${v}`} />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Dashboards de Tableau (Web Components) */}
        <Row className="mt-5">
          <Col lg={12}>
            <h4 className="mb-4">Reportes Avanzados</h4>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h5>Dashboard: Tasa de Rotación</h5>
                <tableau-viz 
                  src="https://public.tableau.com/views/TrabajoMartitaToolsDashboard2/Dashboard1" 
                  width="100%" 
                  height="700px" 
                  toolbar="bottom"
                ></tableau-viz>
              </Card.Body>
            </Card>
            <Card className="shadow-sm">
              <Card.Body>
                <h5>Dashboard: Ventas Totales</h5>
                <tableau-viz 
                  src="https://public.tableau.com/views/TrabajoMartitaToolsDashboard1/DashboardVentasTotales" 
                  width="100%" 
                  height="700px" 
                  toolbar="bottom"
                ></tableau-viz>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}