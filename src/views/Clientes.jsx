import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

// Importación de componentes locales
import ModalRegistroClientes from "../components/clientes/ModalRegistroClientes";
import ModalEdicionCliente from "../components/clientes/ModalEdicionCliente";
import ModalEliminacionCliente from "../components/clientes/ModalEliminacionCliente";
import TablaClientes from "../components/clientes/TablaClientes";
import TarjetaClientes from "../components/clientes/TarjetaClientes";
import NotificacionOperacion from "../components/NotificacionOperacion";

// NUEVOS COMPONENTES DE LÓGICA COMPARTIDA
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Clientes = () => {
  // --- ESTADOS PRINCIPALES ---
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  // --- NUEVOS ESTADOS: BÚSQUEDA Y PAGINACIÓN ---
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  // --- ESTADOS DE MODALES ---
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });

  const [clienteEditar, setClienteEditar] = useState({
    id: "",
    nombre: "",
    apellido: "",
    telefono: "",
  });

  const [clienteAEliminar, setClienteAEliminar] = useState(null);

  // --- CARGA DE DATOS ---
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("id", { ascending: false }); // <-- Últimos registros cargados arriba primero de forma nativa

      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error("Error al cargar clientes:", error.message);
      setToast({
        mostrar: true,
        mensaje: "Error al cargar los clientes.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  // --- LÓGICA: FILTRADO ---
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setClientesFiltrados(clientes);
    } else {
      const term = textoBusqueda.toLowerCase().trim();
      const filtrados = clientes.filter(
        (cli) =>
          cli.nombre.toLowerCase().includes(term) ||
          cli.apellido.toLowerCase().includes(term) ||
          (cli.telefono && cli.telefono.toLowerCase().includes(term))
      );
      setClientesFiltrados(filtrados);
    }
    establecerPaginaActual(1);
  }, [textoBusqueda, clientes]);

  // --- LÓGICA: PAGINACIÓN ---
  const clientesPaginados = clientesFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  // --- ABRIR MODALES ---
  const abrirModalEdicion = (cliente) => {
    setClienteEditar({
      id: cliente.id,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      telefono: cliente.telefono || "",
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (cliente) => {
    setClienteAEliminar(cliente);
    setMostrarModalEliminacion(true);
  };

  // --- MANEJO DE INPUTS ---
  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setClienteEditar((prev) => ({ ...prev, [name]: value }));
  };

  // --- CRUD LÓGICA ---
  const agregarCliente = async () => {
    if (!nuevoCliente.nombre.trim() || !nuevoCliente.apellido.trim()) {
      setToast({ mostrar: true, mensaje: "Nombre y apellido obligatorios.", tipo: "advertencia" });
      return;
    }
    try {
      const { error } = await supabase.from("clientes").insert([nuevoCliente]);
      
      if (error) {
        if (error.code === "23505") { // Captura llave duplicada (ej. si controlas teléfonos únicos o cédulas en DB)
          setToast({ mostrar: true, mensaje: "Este cliente ya se encuentra registrado.", tipo: "advertencia" });
          return;
        }
        throw error;
      }

      setToast({ mostrar: true, mensaje: `Cliente registrado con éxito.`, tipo: "exito" });
      setNuevoCliente({ nombre: "", apellido: "", telefono: "" });
      setMostrarModalRegistro(false);
      await cargarClientes();
    } catch (error) {
      setToast({ mostrar: true, mensaje: "Error al registrar cliente.", tipo: "error" });
    }
  };

  const actualizarCliente = async () => {
    if (!clienteEditar.nombre.trim() || !clienteEditar.apellido.trim()) {
      setToast({ mostrar: true, mensaje: "Nombre y apellido obligatorios.", tipo: "advertencia" });
      return;
    }
    try {
      const { error } = await supabase
        .from("clientes")
        .update({
          nombre: clienteEditar.nombre,
          apellido: clienteEditar.apellido,
          telefono: clienteEditar.telefono,
        })
        .eq("id", clienteEditar.id);

      if (error) throw error;
      setToast({ mostrar: true, mensaje: `Cliente actualizado correctamente.`, tipo: "exito" });
      setMostrarModalEdicion(false);
      await cargarClientes();
    } catch (error) {
      setToast({ mostrar: true, mensaje: "Error al actualizar.", tipo: "error" });
    }
  };

  const eliminarCliente = async () => {
    if (!clienteAEliminar) return;
    try {
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", clienteAEliminar.id);

      if (error) throw error;
      setToast({ mostrar: true, mensaje: `Cliente eliminado del sistema.`, tipo: "exito" });
      setMostrarModalEliminacion(false);
      await cargarClientes();
    } catch (error) {
      setToast({ mostrar: true, mensaje: "Error al eliminar el cliente.", tipo: "error" });
    }
  };

  return (
    <Container className="mt-4">
      {/* Cabecera */}
      <div className="d-flex align-items-center justify-content-between mb-4 mt-2">
        <div className="d-flex align-items-center" style={{ minWidth: 0 }}>
          <h3 className="mb-0 fw-bold">
            <i className="bi bi-person-badge-fill me-2 text-primary"></i>
            <span className="text-truncate">Gestión de Clientes</span>
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
              Nuevo Cliente
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
            placeholder="Buscar por nombre, apellido o teléfono..."
          />
        </Col>
      </Row>

      {/* MENSAJE SI NO HAY COINCIDENCIAS */}
      {!cargando && textoBusqueda.trim() && clientesFiltrados.length === 0 && (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          No se encontraron clientes que coincidan con "{textoBusqueda}".
        </Alert>
      )}

      {/* Contenido Principal */}
      {cargando ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted fw-bold">Cargando clientes...</p>
        </div>
      ) : (
        <>
          {clientesFiltrados.length > 0 && (
            <>
              {/* Tarjetas en móvil */}
              <div className="d-lg-none">
                <TarjetaClientes
                  clientes={clientesPaginados}
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />
              </div>

              {/* Tabla en pantallas grandes */}
              <div className="d-none d-lg-block">
                <TablaClientes
                  clientes={clientesPaginados}
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />
              </div>

              {/* COMPONENTE DE PAGINACIÓN */}
              <Paginacion
                registrosPorPagina={registrosPorPagina}
                totalRegistros={clientesFiltrados.length}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
                establecerRegistrosPorPagina={establecerRegistrosPorPagina}
              />
            </>
          )}
        </>
      )}

      {/* Modales Inyectados */}
      <ModalRegistroClientes
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevoCliente={nuevoCliente}
        manejoCambioInput={manejoCambioInput}
        agregarCliente={agregarCliente}
      />

      <ModalEdicionCliente
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        clienteEditar={clienteEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarCliente={actualizarCliente}
      />

      <ModalEliminacionCliente
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCliente={eliminarCliente}
        cliente={clienteAEliminar}
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

export default Clientes;