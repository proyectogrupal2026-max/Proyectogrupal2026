import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap"; // Añadido Alert
import { supabase } from "../database/supabaseconfig";

// Componentes hijos
import ModalRegistroPerfil from "../components/perfiles/ModalRegistroPerfil";
import ModalEdicionPerfil from "../components/perfiles/ModalEdicionPerfil";
import ModalEliminacionPerfil from "../components/perfiles/ModalEliminacionPerfil";
import TablaPerfiles from "../components/perfiles/TablaPerfiles";
import TarjetaPerfil from "../components/perfiles/TarjetaPerfil";
import NotificacionOperacion from "../components/NotificacionOperacion";

// --- NUEVOS COMPONENTES DE LÓGICA ---
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Perfiles = () => {
  // --- ESTADOS PRINCIPALES ---
  const [perfiles, setPerfiles] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- NUEVOS ESTADOS: BÚSQUEDA Y PAGINACIÓN ---
  const [perfilesFiltrados, setPerfilesFiltrados] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(10);
  const [paginaActual, establecerPaginaActual] = useState(1);

  // --- ESTADOS DE NOTIFICACIÓN ---
  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "",
  });

  // --- ESTADOS DE MODALES ---
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  // --- ESTADOS DE DATOS ---
  const [nuevoPerfil, setNuevoPerfil] = useState({
    email: "",
    password: "",
    nombre_completo: "",
    rol: "",
    telefono: "",
  });

  const [perfilEditar, setPerfilEditar] = useState({
    user_id: "",
    nombre_completo: "",
    rol: "",
    telefono: "",
  });

  const [perfilAEliminar, setPerfilAEliminar] = useState(null);

  // --- CARGA DE DATOS ---
  useEffect(() => {
    cargarPerfiles();
  }, []);

  const cargarPerfiles = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("perfiles")
        .select("*")
        .order("nombre_completo", { ascending: true });

      if (error) throw error;
      setPerfiles(data || []);
    } catch (error) {
      console.error("Error al cargar perfiles:", error.message);
      setToast({
        mostrar: true,
        mensaje: "Error al conectar con la base de datos.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  // --- NUEVA LÓGICA: FILTRADO ---
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setPerfilesFiltrados(perfiles);
    } else {
      const term = textoBusqueda.toLowerCase().trim();
      const filtrados = perfiles.filter(
        (p) =>
          p.nombre_completo.toLowerCase().includes(term) ||
          p.rol.toLowerCase().includes(term) ||
          (p.telefono && p.telefono.includes(term))
      );
      setPerfilesFiltrados(filtrados);
    }
  }, [textoBusqueda, perfiles]);

  // --- NUEVA LÓGICA: PAGINACIÓN ---
  const perfilesPaginados = perfilesFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
    establecerPaginaActual(1); // Resetear a pag 1 al buscar
  };

  // --- MANEJO DE INPUTS ---
  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoPerfil((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setPerfilEditar((prev) => ({ ...prev, [name]: value }));
  };

  // --- ABRIR MODALES CON DATOS ---
  const abrirModalEdicion = (perfil) => {
    setPerfilEditar({
      user_id: perfil.user_id,
      nombre_completo: perfil.nombre_completo,
      rol: perfil.rol,
      telefono: perfil.telefono || "",
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (perfil) => {
    setPerfilAEliminar(perfil);
    setMostrarModalEliminacion(true);
  };

  // --- OPERACIONES CRUD ---
  const agregarPerfil = async () => {
    try {
      const { error: authError } = await supabase.auth.signUp({
        email: nuevoPerfil.email,
        password: nuevoPerfil.password,
        options: {
          data: {
            nombre_completo: nuevoPerfil.nombre_completo,
            rol: nuevoPerfil.rol,
            telefono: nuevoPerfil.telefono,
          },
        },
      });

      if (authError) throw authError;

      setToast({
        mostrar: true,
        mensaje: `Usuario "${nuevoPerfil.nombre_completo}" registrado.`,
        tipo: "exito",
      });

      setNuevoPerfil({ email: "", password: "", nombre_completo: "", rol: "", telefono: "" });
      setMostrarModalRegistro(false);
      setTimeout(() => cargarPerfiles(), 1000);
    } catch (error) {
      setToast({ mostrar: true, mensaje: "Error: " + error.message, tipo: "error" });
    }
  };

  const actualizarPerfil = async () => {
    try {
      const { error } = await supabase
        .from("perfiles")
        .update({
          nombre_completo: perfilEditar.nombre_completo,
          rol: perfilEditar.rol,
          telefono: perfilEditar.telefono,
        })
        .eq("user_id", perfilEditar.user_id);

      if (error) throw error;

      setToast({ mostrar: true, mensaje: "Cambios guardados.", tipo: "exito" });
      setMostrarModalEdicion(false);
      await cargarPerfiles();
    } catch (error) {
      setToast({ mostrar: true, mensaje: "Error al editar perfil.", tipo: "error" });
    }
  };

  const eliminarPerfil = async () => {
    if (!perfilAEliminar) return;
    try {
      const { error } = await supabase
        .from("perfiles")
        .delete()
        .eq("user_id", perfilAEliminar.user_id);

      if (error) throw error;

      setToast({ mostrar: true, mensaje: `Perfil removido.`, tipo: "exito" });
      setMostrarModalEliminacion(false);
      await cargarPerfiles();
    } catch (error) {
      setToast({ mostrar: true, mensaje: "Error al eliminar.", tipo: "error" });
    }
  };

  // --- RENDERIZADO ---
  return (
    <Container className="mt-4">
      {/* Cabecera */}
      <div className="d-flex align-items-center justify-content-between mb-4 mt-2">
        {/* Contenedor del Título - El minWidth evita que el texto empuje el botón fuera de la pantalla */}
        <div className="d-flex align-items-center" style={{ minWidth: 0 }}>
          <h3 className="mb-0 fw-bold">
            <i className="bi bi-person-badge-fill me-2 text-primary"></i>
            <span className="text-truncate">Personal de Ferretería</span>
          </h3>
        </div>

        {/* Contenedor del Botón */}
        <div className="ms-2">
          <Button
            variant="primary"
            onClick={() => setMostrarModalRegistro(true)}
            className="d-flex align-items-center justify-content-center shadow-sm px-3"
            style={{
              height: '42px',
              borderRadius: '10px',
              minWidth: '45px'
            }}
          >
            <i className="bi bi-plus-lg"></i>
            {/* El texto aparece de 'sm' en adelante para estirar el botón en PC */}
            <span className="d-none d-sm-inline ms-2 fw-semibold" style={{ whiteSpace: 'nowrap' }}>
              Nuevo Usuario
            </span>
          </Button>
        </div>
      </div>

      <hr />

      {/* NUEVO: CUADRO DE BÚSQUEDA */}
      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por nombre, rol o teléfono..."
          />
        </Col>
      </Row>

      {/* NUEVO: MENSAJE SI NO HAY RESULTADOS */}
      {!cargando && textoBusqueda.trim() && perfilesFiltrados.length === 0 && (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          No se encontró personal que coincida con "{textoBusqueda}".
        </Alert>
      )}

      {/* Contenido Principal */}
      {cargando ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted fw-bold">Consultando nómina...</p>
        </div>
      ) : (
        <>
          {perfilesFiltrados.length > 0 && (
            <>
              {/* Vista para Móviles (Tarjetas) */}
              <div className="d-lg-none">
                <TarjetaPerfil
                  perfiles={perfilesPaginados} // Usar los paginados
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />
              </div>

              {/* Vista para Escritorio (Tabla) */}
              <div className="d-none d-lg-block">
                <TablaPerfiles
                  perfiles={perfilesPaginados} // Usar los paginados
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                  cargando={cargando}
                />
              </div>

              {/* NUEVO: COMPONENTE DE PAGINACIÓN */}
              <Paginacion
                registrosPorPagina={registrosPorPagina}
                totalRegistros={perfilesFiltrados.length}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
                establecerRegistrosPorPagina={establecerRegistrosPorPagina}
              />
            </>
          )}
        </>
      )}

      {/* Modales */}
      <ModalRegistroPerfil
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevoPerfil={nuevoPerfil}
        manejoCambioInput={manejoCambioInput}
        agregarPerfil={agregarPerfil}
      />

      <ModalEdicionPerfil
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        perfilEditar={perfilEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarPerfil={actualizarPerfil}
      />

      <ModalEliminacionPerfil
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarPerfil={eliminarPerfil}
        perfil={perfilAEliminar}
      />

      {/* Notificaciones */}
      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast((prev) => ({ ...prev, mostrar: false }))}
      />
    </Container>
  );
};

export default Perfiles;