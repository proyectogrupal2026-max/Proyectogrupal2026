import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap"; // Alert añadido
import { supabase } from "../database/supabaseconfig";

import ModalRegistroProveedor from "../components/proveedores/ModalRegistroProveedores";
import ModalEdicionProveedor from "../components/proveedores/ModalEdicionProveedor";
import ModalEliminacionProveedor from "../components/proveedores/ModalEliminacionProveedor";
import TablaProveedores from "../components/proveedores/TablaProveedores";
import TarjetaProveedor from "../components/proveedores/TarjetaProveedores";
import NotificacionOperacion from "../components/NotificacionOperacion";

// NUEVOS COMPONENTES DE LÓGICA
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/Ordenamiento/Paginacion";

const Proveedores = () => {
  // --- ESTADOS PRINCIPALES ---
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- NUEVOS ESTADOS: BÚSQUEDA Y PAGINACIÓN ---
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
  const [mostrarModalEliminacion, setMostrarModalEliminacion] =
    useState(false);

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
        .order("id", { ascending: true });

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

  // --- NUEVA LÓGICA: FILTRADO ---
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
    establecerPaginaActual(1); // Resetear a pag 1 al buscar
  }, [textoBusqueda, proveedores]);

  // --- NUEVA LÓGICA: PAGINACIÓN ---
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

    setNuevoProveedor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;

    setProveedorEditar((prev) => ({
      ...prev,
      [name]: value,
    }));
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

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: `Proveedor "${nuevoProveedor.nombre}" registrado con éxito.`,
        tipo: "exito",
      });

      setNuevoProveedor({
        nombre: "",
        telefono: "",
        direccion: "",
      });

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

  return (
    <Container className="mt-4">
      {/* Cabecera */}
      <Row className="align-items-center mb-4">
        <Col>
          <h3>
            <i className="bi bi-truck me-2 text-primary"></i>
            Gestión de Proveedores
          </h3>
        </Col>

        <Col className="text-end">
          <Button variant="primary" onClick={() => setMostrarModalRegistro(true)}>
            <i className="bi bi-plus-lg me-1"></i> Nuevo Proveedor
          </Button>
        </Col>
      </Row>

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
              <div className="d-lg-none">
                <TarjetaProveedor
                  proveedores={proveedoresPaginados} // Usar paginados
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />
              </div>

              <div className="d-none d-lg-block">
                <TablaProveedores
                  proveedores={proveedoresPaginados} // Usar paginados
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />
              </div>

              {/* COMPONENTE DE PAGINACIÓN */}
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