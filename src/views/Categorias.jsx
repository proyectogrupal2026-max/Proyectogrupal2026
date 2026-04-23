import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap"; // Alert añadido
import { supabase } from "../database/supabaseconfig";

// Importación de componentes
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";
import TablaCategorias from "../components/categorias/TablaCategorias";
import TarjetaCategoria from "../components/categorias/TarjetaCategoria";
import NotificacionOperacion from "../components/NotificacionOperacion";

// NUEVOS COMPONENTES DE LÓGICA
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/Ordenamiento/Paginacion";

const Categorias = () => {
  // --- ESTADOS PRINCIPALES ---
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  // --- NUEVOS ESTADOS: BÚSQUEDA Y PAGINACIÓN ---
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(5);
  const [paginaActual, establecerPaginaActual] = useState(1);

  // --- ESTADOS DE MODALES ---
  const [mostrarModalRegistro, setMostrarModalRegistro] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  const [categoriaEditar, setCategoriaEditar] = useState({
    id: "",
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  // --- CARGA DE DATOS ---
  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setCategorias(data || []);
    } catch (error) {
      console.error("Error al cargar categorías:", error.message);
      setToast({
        mostrar: true,
        mensaje: "Error al cargar las categorías.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  // --- NUEVA LÓGICA: FILTRADO ---
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setCategoriasFiltradas(categorias);
    } else {
      const term = textoBusqueda.toLowerCase().trim();
      const filtradas = categorias.filter(
        (cat) =>
          cat.nombre_categoria.toLowerCase().includes(term) ||
          (cat.descripcion_categoria && cat.descripcion_categoria.toLowerCase().includes(term))
      );
      setCategoriasFiltradas(filtradas);
    }
    // Siempre resetear a la página 1 cuando cambia la búsqueda
    establecerPaginaActual(1);
  }, [textoBusqueda, categorias]);

  // --- NUEVA LÓGICA: PAGINACIÓN ---
  const categoriasPaginadas = categoriasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  // --- ABRIR MODALES ---
  const abrirModalEdicion = (categoria) => {
    setCategoriaEditar({
      id: categoria.id,
      nombre_categoria: categoria.nombre_categoria,
      descripcion_categoria: categoria.descripcion_categoria || "",
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminacion(true);
  };

  // --- MANEJO DE INPUTS ---
  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setCategoriaEditar((prev) => ({ ...prev, [name]: value }));
  };

  // --- CRUD ---
  const agregarCategoria = async () => {
    if (!nuevaCategoria.nombre_categoria.trim()) {
      setToast({ mostrar: true, mensaje: "El nombre es obligatorio.", tipo: "advertencia" });
      return;
    }
    try {
      const { error } = await supabase.from("categorias").insert([nuevaCategoria]);
      if (error) throw error;
      setToast({ mostrar: true, mensaje: `Categoría registrada con éxito.`, tipo: "exito" });
      setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
      setMostrarModalRegistro(false);
      await cargarCategorias();
    } catch (error) {
      setToast({ mostrar: true, mensaje: "Error al registrar.", tipo: "error" });
    }
  };

  const actualizarCategoria = async () => {
    if (!categoriaEditar.nombre_categoria.trim()) {
      setToast({ mostrar: true, mensaje: "El nombre es obligatorio.", tipo: "advertencia" });
      return;
    }
    try {
      const { error } = await supabase
        .from("categorias")
        .update({
          nombre_categoria: categoriaEditar.nombre_categoria,
          descripcion_categoria: categoriaEditar.descripcion_categoria,
        })
        .eq("id", categoriaEditar.id);
      if (error) throw error;
      setToast({ mostrar: true, mensaje: `Categoría actualizada correctamente.`, tipo: "exito" });
      setMostrarModalEdicion(false);
      await cargarCategorias();
    } catch (error) {
      setToast({ mostrar: true, mensaje: "Error al actualizar.", tipo: "error" });
    }
  };

  const eliminarCategoria = async () => {
    if (!categoriaAEliminar) return;
    try {
      const { error } = await supabase
        .from("categorias")
        .delete()
        .eq("id", categoriaAEliminar.id);
      if (error) throw error;
      setToast({ mostrar: true, mensaje: `Categoría eliminada.`, tipo: "exito" });
      setMostrarModalEliminacion(false);
      await cargarCategorias();
    } catch (error) {
      setToast({ mostrar: true, mensaje: "Error al eliminar.", tipo: "error" });
    }
  };

  return (
    <Container className="mt-4">
      {/* Cabecera */}
      <Row className="align-items-center mb-4">
        <Col>
          <h3>
            <i className="bi bi-tags-fill me-2 text-primary"></i>
            Gestión de Categorías
          </h3>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => setMostrarModalRegistro(true)}>
            <i className="bi bi-plus-lg me-1"></i> Nueva Categoría
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
            placeholder="Buscar por nombre o descripción..."
          />
        </Col>
      </Row>

      {/* MENSAJE SI NO HAY COINCIDENCIAS */}
      {!cargando && textoBusqueda.trim() && categoriasFiltradas.length === 0 && (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          No se encontraron categorías que coincidan con "{textoBusqueda}".
        </Alert>
      )}

      {/* Contenido Principal */}
      {cargando ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted fw-bold">Cargando categorías...</p>
        </div>
      ) : (
        <>
          {categoriasFiltradas.length > 0 && (
            <>
              {/* Vista en tarjetas (móviles) */}
              <div className="d-lg-none">
                <TarjetaCategoria
                  categorias={categoriasPaginadas} // Usar paginadas
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />
              </div>

              {/* Vista en tabla (escritorio) */}
              <div className="d-none d-lg-block">
                <TablaCategorias
                  categorias={categoriasPaginadas} // Usar paginadas
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />
              </div>

              {/* COMPONENTE DE PAGINACIÓN */}
              <Paginacion
                registrosPorPagina={registrosPorPagina}
                totalRegistros={categoriasFiltradas.length}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
                establecerRegistrosPorPagina={establecerRegistrosPorPagina}
              />
            </>
          )}
        </>
      )}

      {/* Modales */}
      <ModalRegistroCategoria
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevaCategoria={nuevaCategoria}
        manejoCambioInput={manejoCambioInput}
        agregarCategoria={agregarCategoria}
      />

      <ModalEdicionCategoria
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        categoriaEditar={categoriaEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarCategoria={actualizarCategoria}
      />

      <ModalEliminacionCategoria
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCategoria={eliminarCategoria}
        categoria={categoriaAEliminar}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Categorias;