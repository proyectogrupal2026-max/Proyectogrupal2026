import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap"; // Alert añadido
import { supabase } from "../database/supabaseconfig";

import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";
import TablaProductos from "../components/productos/TablaProductos";
import TarjetaProducto from "../components/productos/TarjetaProductos";
import NotificacionOperacion from "../components/NotificacionOperacion";

// NUEVOS COMPONENTES DE LÓGICA
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/Ordenamiento/Paginacion";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // --- NUEVOS ESTADOS: BÚSQUEDA Y PAGINACIÓN ---
  const [productosFiltrados, setProductosFiltrados] = useState([]);
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

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    categoria_id: "",
    precio_compra: "",
    precio_venta: "",
    stock: "",
  });

  const [productoEditar, setProductoEditar] = useState({
    id: "",
    nombre: "",
    categoria_id: "",
    precio_compra: "",
    precio_venta: "",
    stock: "",
  });

  const [productoAEliminar, setProductoAEliminar] = useState(null);

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);

      const { data, error } = await supabase
        .from("productos")
        .select(`
          *,
          categorias:categoria_id (
            nombre_categoria
          )
        `)
        .order("id", { ascending: true });

      if (error) throw error;

      setProductos(data || []);
    } catch (error) {
      console.error("Error al cargar productos:", error.message);

      setToast({
        mostrar: true,
        mensaje: "Error al cargar los productos.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("nombre_categoria", { ascending: true });

      if (error) throw error;

      setCategorias(data || []);
    } catch (error) {
      console.error("Error al cargar categorías:", error.message);

      setToast({
        mostrar: true,
        mensaje: "Error al cargar las categorías.",
        tipo: "error",
      });
    }
  };

  // --- NUEVA LÓGICA: FILTRADO ---
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setProductosFiltrados(productos);
    } else {
      const term = textoBusqueda.toLowerCase().trim();
      const filtrados = productos.filter((prod) => {
        const nombreProd = prod.nombre?.toLowerCase() || "";
        const nombreCat = prod.categorias?.nombre_categoria?.toLowerCase() || "sin categoría";
        return nombreProd.includes(term) || nombreCat.includes(term);
      });
      setProductosFiltrados(filtrados);
    }
    establecerPaginaActual(1); // Resetear a pag 1 al buscar
  }, [textoBusqueda, productos]);

  // --- NUEVA LÓGICA: PAGINACIÓN ---
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditar({
      id: producto.id,
      nombre: producto.nombre,
      categoria_id: producto.categoria_id || "",
      precio_compra: producto.precio_compra,
      precio_venta: producto.precio_venta,
      stock: producto.stock,
    });

    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setMostrarModalEliminacion(true);
  };

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;

    setNuevoProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;

    setProductoEditar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarProducto = async () => {
    if (
      !nuevoProducto.nombre.trim() ||
      !nuevoProducto.precio_compra ||
      !nuevoProducto.precio_venta ||
      nuevoProducto.stock === ""
    ) {
      setToast({
        mostrar: true,
        mensaje: "Debe completar todos los campos obligatorios.",
        tipo: "advertencia",
      });
      return;
    }

    try {
      const { error } = await supabase.from("productos").insert([
        {
          nombre: nuevoProducto.nombre,
          categoria_id:
            nuevoProducto.categoria_id === ""
              ? null
              : Number(nuevoProducto.categoria_id),
          precio_compra: Number(nuevoProducto.precio_compra),
          precio_venta: Number(nuevoProducto.precio_venta),
          stock: Number(nuevoProducto.stock),
        },
      ]);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: `Producto "${nuevoProducto.nombre}" registrado con éxito.`,
        tipo: "exito",
      });

      setNuevoProducto({
        nombre: "",
        categoria_id: "",
        precio_compra: "",
        precio_venta: "",
        stock: "",
      });

      setMostrarModalRegistro(false);
      await cargarProductos();
    } catch (error) {
      console.error("Error al registrar producto:", error.message);

      setToast({
        mostrar: true,
        mensaje: "Error al registrar el producto.",
        tipo: "error",
      });
    }
  };

  const actualizarProducto = async () => {
    if (
      !productoEditar.nombre.trim() ||
      !productoEditar.precio_compra ||
      !productoEditar.precio_venta ||
      productoEditar.stock === ""
    ) {
      setToast({
        mostrar: true,
        mensaje: "Debe completar todos los campos obligatorios.",
        tipo: "advertencia",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("productos")
        .update({
          nombre: productoEditar.nombre,
          categoria_id:
            productoEditar.categoria_id === ""
              ? null
              : Number(productoEditar.categoria_id),
          precio_compra: Number(productoEditar.precio_compra),
          precio_venta: Number(productoEditar.precio_venta),
          stock: Number(productoEditar.stock),
        })
        .eq("id", productoEditar.id);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: `Producto "${productoEditar.nombre}" actualizado correctamente.`,
        tipo: "exito",
      });

      setMostrarModalEdicion(false);
      await cargarProductos();
    } catch (error) {
      console.error("Error al actualizar producto:", error.message);

      setToast({
        mostrar: true,
        mensaje: "Error al actualizar el producto.",
        tipo: "error",
      });
    }
  };

  const eliminarProducto = async () => {
    if (!productoAEliminar) return;

    try {
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id", productoAEliminar.id);

      if (error) throw error;

      setToast({
        mostrar: true,
        mensaje: `Producto "${productoAEliminar.nombre}" eliminado correctamente.`,
        tipo: "exito",
      });

      setMostrarModalEliminacion(false);
      await cargarProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error.message);

      setToast({
        mostrar: true,
        mensaje: "Error al eliminar el producto.",
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
            <i className="bi bi-box-seam me-2 text-primary"></i>
            Gestión de Productos
          </h3>
        </Col>

        <Col className="text-end">
          <Button variant="primary" onClick={() => setMostrarModalRegistro(true)}>
            <i className="bi bi-plus-lg me-1"></i> Nuevo Producto
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
            placeholder="Buscar por nombre o categoría..."
          />
        </Col>
      </Row>

      {/* MENSAJE SI NO HAY COINCIDENCIAS */}
      {!cargando && textoBusqueda.trim() && productosFiltrados.length === 0 && (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          No se encontraron productos que coincidan con "{textoBusqueda}".
        </Alert>
      )}

      {/* Contenido Principal */}
      {cargando ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted fw-bold">Cargando catálogo...</p>
        </div>
      ) : (
        <>
          {productosFiltrados.length > 0 && (
            <>
              <div className="d-lg-none">
                <TarjetaProducto
                  productos={productosPaginados} // Usar paginados
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />
              </div>

              <div className="d-none d-lg-block">
                <TablaProductos
                  productos={productosPaginados} // Usar paginados
                  abrirModalEdicion={abrirModalEdicion}
                  abrirModalEliminacion={abrirModalEliminacion}
                />
              </div>

              {/* COMPONENTE DE PAGINACIÓN */}
              <Paginacion
                registrosPorPagina={registrosPorPagina}
                totalRegistros={productosFiltrados.length}
                paginaActual={paginaActual}
                establecerPaginaActual={establecerPaginaActual}
                establecerRegistrosPorPagina={establecerRegistrosPorPagina}
              />
            </>
          )}
        </>
      )}

      {/* Modales */}
      <ModalRegistroProducto
        mostrarModal={mostrarModalRegistro}
        setMostrarModal={setMostrarModalRegistro}
        nuevoProducto={nuevoProducto}
        categorias={categorias}
        manejoCambioInput={manejoCambioInput}
        agregarProducto={agregarProducto}
      />

      <ModalEdicionProducto
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        productoEditar={productoEditar}
        categorias={categorias}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        actualizarProducto={actualizarProducto}
      />

      <ModalEliminacionProducto
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarProducto={eliminarProducto}
        producto={productoAEliminar}
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

export default Productos;