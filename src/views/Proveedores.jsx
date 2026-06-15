import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

// Librerías de exportación
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import ModalRegistroProveedor from "../components/proveedores/ModalRegistroProveedores";
import ModalEdicionProveedor from "../components/proveedores/ModalEdicionProveedor";
import ModalEliminacionProveedor from "../components/proveedores/ModalEliminacionProveedor";
import TablaProveedores from "../components/proveedores/TablaProveedores";
import TarjetaProveedor from "../components/proveedores/TarjetaProveedores";
import NotificacionOperacion from "../components/NotificacionOperacion";

// Componentes de lógica unificados
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Proveedores = () => {
  // --- ESTADOS PRINCIPALES ---
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- BÚSQUEDA Y PAGINACIÓN ---
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "",
  });

  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
  });

  const [proveedorEditar, setProveedorEditar] = useState({
    id: "",
    nombre: "",
    telefono: "",
    direccion: "",
  });

  const [proveedorAEliminar, setProveedorAEliminar] = useState(null);

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("proveedores")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      setProveedores(data || []);
    } catch (error) {
      console.error("Error al cargar proveedores:", error.message);
      setToast({
        mostrar: true,
        mensaje: "Error al cargar los proveedores.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  // --- FILTRADO ---
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setProveedoresFiltrados(proveedores);
    } else {
      const term = textoBusqueda.toLowerCase().trim();
      const filtrados = proveedores.filter((prov) => {
        const nombreProv = prov.nombre?.toLowerCase() || "";
        const telfProv = prov.telefono?.toLowerCase() || "";
        const dirProv = prov.direccion?.toLowerCase() || "";
        return nombreProv.includes(term) || telfProv.includes(term) || dirProv.includes(term);
      });
      setProveedoresFiltrados(filtrados);
    }
    establecerPaginaActual(1);
  }, [textoBusqueda, proveedores]);

  // --- PAGINACIÓN ---
  const proveedoresPaginados = proveedoresFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const abrirModalEdicion = (proveedor) => {
    setProveedorEditar({
      id: proveedor.id,
      nombre: proveedor.nombre,
      telefono: proveedor.telefono || "",
      direccion: proveedor.direccion || "",
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (proveedor) => {
    setProveedorAEliminar(proveedor);
    setMostrarModalEliminacion(true);
  };

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProveedor((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProveedorEditar((prev) => ({ ...prev, [name]: value }));
  };

  const agregarProveedor = async () => {
    if (!nuevoProveedor.nombre.trim()) {
      setToast({
        mostrar: true,
        mensaje: "El nombre del proveedor es obligatorio.",
        tipo: "advertencia",
      });
      return;
    }

    try {
      const { error } = await supabase.from("proveedores").insert([
        {
          nombre: nuevoProveedor.nombre,
          telefono: nuevoProveedor.telefono,
          direccion: nuevoProveedor.direccion,
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          setToast({
            mostrar: true,
            mensaje: `El proveedor "${nuevoProveedor.nombre}" ya está registrado.`,
            tipo: "advertencia",
          });
          return;
        }
        throw error;
      }

      setToast({
        mostrar: true,
        mensaje: `Proveedor "${nuevoProveedor.nombre}" registrado con éxito.`,
        tipo: "exito",
      });

      setNuevoProveedor({ nombre: "", telefono: "", direccion: "" });
      setMostrarModalRegistro(false);
      await cargarProveedores();
    } catch (error) {
      console.error("Error al registrar proveedor:", error.message);
      setToast({
        mostrar: true,
        mensaje: "Error al registrar el proveedor.",
        tipo: "error",
      });
    }
  };

  const actualizarProveedor = async () => {
    if (!proveedorEditar.nombre.trim()) {
      setToast({
        mostrar: true,
        mensaje: "El nombre del proveedor es obligatorio.",
        tipo: "advertencia",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("proveedores")
        .update({
          nombre: proveedorEditar.nombre,
          telefono: proveedorEditar.telefono,
          direccion: proveedorEditar.direccion,
        })
        .eq("id", proveedorEditar.id);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: `Proveedor "${proveedorEditar.nombre}" actualizado correctamente.`,
        tipo: "exito",
      });

      setMostrarModalEdicion(false);
      await cargarProveedores();
    } catch (error) {
      console.error("Error al actualizar proveedor:", error.message);
      setToast({
        mostrar: true,
        mensaje: "Error al actualizar el proveedor.",
        tipo: "error",
      });
    }
  };

  const eliminarProveedor = async () => {
    if (!proveedorAEliminar) return;

    try {
      const { error } = await supabase
        .from("proveedores")
        .delete()
        .eq("id", proveedorAEliminar.id);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: `Proveedor "${proveedorAEliminar.nombre}" eliminado correctamente.`,
        tipo: "exito",
      });

      setMostrarModalEliminacion(false);
      await cargarProveedores();
    } catch (error) {
      console.error("Error al eliminar proveedor:", error.message);
      setToast({
        mostrar: true,
        mensaje: "Error al eliminar el proveedor.",
        tipo: "error",
      });
    }
  };

  // --- LÓGICA DE EXPORTACIÓN REPORTE INDIVIDUAL PDF ---
  const generarPDFProveedor = (prov) => {
    const doc = new jsPDF();

    // Título Principal Corporativo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(33, 37, 41);
    doc.text("MARTITATOOLS - EXPEDIENTE DE PROVEEDOR", 14, 20);

    // Metadata informativa
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(108, 117, 125);
    const emision = new Date().toLocaleString("es-NI");
    doc.text(`Fecha y Hora de Emisión: ${emision}`, 14, 26);

    // Divisor estético azul
    doc.setDrawColor(13, 110, 253);
    doc.setLineWidth(1);
    doc.line(14, 30, 196, 30);

    autoTable(doc, {
      startY: 38,
      theme: "striped",
      headStyles: {
        fillColor: [13, 110, 253],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      head: [["Campo de Registro", "Información Detallada"]],
      body: [
        ["ID Proveedor", `#${prov.id}`],
        ["Nombre de la Entidad / Contacto", prov.nombre || "-"],
        ["Línea de Teléfono Móvil", prov.telefono || "No especificado"],
        ["Dirección Física / Sucursal", prov.direccion || "No especificada"],
      ],
      styles: { fontSize: 11, cellPadding: 6 },
      columnStyles: {
        0: { fontStyle: "bold", width: 60 },
      },
    });

    const yFinal = doc.lastAutoTable.finalY || 45;
    doc.setFontSize(9);
    doc.setTextColor(142, 142, 142);
    doc.text("Ferretería Martita Castilla - Sistema de Control y Cadena de Suministro", 14, yFinal + 15);

    doc.save(`Proveedor_${prov.id}_${prov.nombre?.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <Container className="mt-4">
      {/* Cabecera */}
      <div className="d-flex align-items-center justify-content-between mb-4 mt-2">
        <div className="d-flex align-items-center" style={{ minWidth: 0 }}>
          <h3 className="mb-0 fw-bold">
            <i className="bi bi-truck me-2 text-primary"></i>
            <span className="text-truncate">Gestión de Proveedores</span>
          </h3>
        </div>

        <div className="ms-2">
          <Button
            onClick={() => setMostrarModalRegistro(true)}
            className="d-flex align-items-center justify-content-center shadow-sm px-3"
            style={{ 
              height: '42px', 
              borderRadius: '10px',
              minWidth: '45px'
            }}
          >
            <i className="bi bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2 fw-semibold" style={{ whiteSpace: 'nowrap' }}>
              Nuevo Proveedor
            </span>
          </Button>
        </div>
      </div>

      <hr />

      {/* CUADRO DE BÚSQUEDA */}
      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por nombre, teléfono o dirección..."
          />
        </Col>
      </Row>

      {/* MENSAJE SI NO HAY COINCIDENCIAS */}
      {!cargando && textoBusqueda.trim() && proveedoresFiltrados.length === 0 && (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          No se encontraron proveedores que coincidan con "{textoBusqueda}".
        </Alert>
      )}

      {/* Contenido Principal */}
      {cargando ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted fw-bold">Cargando proveedores...</p>
        </div>
      ) : (
        <>
          {proveedoresFiltrados.length > 0 && (
            <>
              {/* Vista Móvil */}
              <div className="d-lg-none">
                <TarjetaProveedor
                  proveedores={proveedoresPaginados}
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                  generarPDFProveedor={generarPDFProveedor} // <--- Inyectado para móviles
                />
              </div>

              {/* Vista Desktop */}
              <div className="d-none d-lg-block">
                <TablaProveedores
                  proveedores={proveedoresPaginados}
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                  generarPDFProveedor={generarPDFProveedor} // <--- Inyectado para tablas
                />
              </div>

              <Paginacion
                registrosPorPagina={registrosPorPagina}
                totalRegistros={proveedoresFiltrados.length}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
                establecerRegistrosPorPagina={establecerRegistrosPorPagina}
              />
            </>
          )}
        </>
      )}

      {/* Modales y Toasts de Operación permanecen iguales */}
      <ModalRegistroProveedor
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevoProveedor={nuevoProveedor}
        manejoCambioInput={manejoCambioInput}
        agregarProveedor={agregarProveedor}
      />

      <ModalEdicionProveedor
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        proveedorEditar={proveedorEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarProveedor={actualizarProveedor}
      />

      <ModalEliminacionProveedor
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarProveedor={eliminarProveedor}
        proveedor={proveedorAEliminar}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() =>
          setToast((prev) => ({
            ...prev,
            mostrar: false,
          }))
        }
      />
    </Container>
  );
};

export default Proveedores;