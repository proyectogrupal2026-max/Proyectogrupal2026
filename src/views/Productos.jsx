import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

// Librerías de exportación
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Componentes modales y complementos
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import TablaProductos from "../components/productos/TablaProductos";
import TarjetaProducto from "../components/productos/TarjetaProductos";
import Paginacion from "../components/ordenamiento/Paginacion";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  // Estados originales del esquema de base de datos
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    categoria_producto: "",
    precio_compra: "",
    precio_venta: "",
    stock: "",
    url_imagen: "",
    archivo: null,
  });

  const [productoEditar, setProductoEditar] = useState({
    id: "",
    nombre: "",
    categoria_producto: "",
    precio_compra: "",
    precio_venta: "",
    stock: "",
    url_imagen: "",
    archivo: null,
  });

  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const [registrosPorPagina, establecerRegistrosPorPagina] = useState(10);
  const [paginaActual, establecerPaginaActual] = useState(1);

  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioArchivo = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type.startsWith("image/")) {
      setNuevoProducto((prev) => ({ ...prev, archivo }));
    } else {
      alert("Selecciona una imagen válida (JPG, PNG, etc.)");
    }
  };

  const manejarBusqueda = (e) => {
    setTextoBusqueda(e.target.value);
    establecerPaginaActual(1);
  };

  const cargarCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id", { ascending: true });
      if (error) throw error;
      setCategorias(data || []);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  };

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from("productos")
        .select("*, categorias(nombre_categoria)")
        .order("id", { ascending: false });
      if (error) throw error;
      setProductos(data || []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    } finally {
      setCargando(false);
    }
  };

  const agregarProducto = async () => {
    try {
      if (
        !nuevoProducto.nombre.trim() ||
        !nuevoProducto.categoria_producto ||
        !nuevoProducto.precio_venta ||
        !nuevoProducto.precio_compra ||
        !nuevoProducto.stock ||
        !nuevoProducto.archivo
      ) {
        setToast({
          mostrar: true,
          mensaje: "Completa todos los campos obligatorios",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModal(false);
      const nombreArchivo = `${Date.now()}_${nuevoProducto.archivo.name}`;
      const { error: uploadError } = await supabase.storage
        .from("imagenes_productos")
        .upload(nombreArchivo, nuevoProducto.archivo);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("imagenes_productos")
        .getPublicUrl(nombreArchivo);
      const urlPublica = urlData.publicUrl;

      const { error } = await supabase.from("productos").insert([
        {
          nombre: nuevoProducto.nombre,
          categoria_producto: parseInt(nuevoProducto.categoria_producto),
          precio_compra: parseFloat(nuevoProducto.precio_compra),
          precio_venta: parseFloat(nuevoProducto.precio_venta),
          stock: parseInt(nuevoProducto.stock),
          url_imagen: urlPublica,
        },
      ]);

      if (error) throw error;

      setNuevoProducto({
        nombre: "",
        categoria_producto: "",
        precio_compra: "",
        precio_venta: "",
        stock: "",
        archivo: null,
      });

      setToast({ mostrar: true, mensaje: "Producto registrado correctamente", tipo: "exito" });
      await cargarProductos();
    } catch (err) {
      console.error("Error al agregar producto:", err);
      setToast({ mostrar: true, mensaje: "Error al registrar producto", tipo: "error" });
    }
  };

  const manejoCambioInputEdicion = (e) => {
    const { name, value } = e.target;
    setProductoEditar((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioArchivoActualizar = (e) => {
    const archivo = e.target.files[0];
    if (archivo && archivo.type.startsWith("image/")) {
      setProductoEditar((prev) => ({ ...prev, archivo }));
    } else {
      alert("Selecciona una imagen válida (JPG, PNG, etc.)");
    }
  };

  const actualizarProducto = async () => {
    try {
      if (
        !productoEditar.nombre.trim() ||
        !productoEditar.categoria_producto ||
        !productoEditar.precio_venta ||
        !productoEditar.precio_compra ||
        !productoEditar.stock
      ) {
        setToast({
          mostrar: true,
          mensaje: "Completa los campos obligatorios",
          tipo: "advertencia",
        });
        return;
      }

      setMostrarModalEdicion(false);

      let datosActualizados = {
        nombre: productoEditar.nombre,
        categoria_producto: parseInt(productoEditar.categoria_producto),
        precio_compra: parseFloat(productoEditar.precio_compra),
        precio_venta: parseFloat(productoEditar.precio_venta),
        stock: parseInt(productoEditar.stock),
        url_imagen: productoEditar.url_imagen,
      };

      if (productoEditar.archivo) {
        const nombreArchivo = `${Date.now()}_${productoEditar.archivo.name}`;
        const { error: uploadError } = await supabase.storage
          .from("imagenes_productos")
          .upload(nombreArchivo, productoEditar.archivo);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("imagenes_productos")
          .getPublicUrl(nombreArchivo);

        datosActualizados.url_imagen = urlData.publicUrl;

        if (productoEditar.url_imagen) {
          const nombreAnterior = productoEditar.url_imagen.split("/").pop().split("?")[0];
          await supabase.storage.from("imagenes_productos").remove([nombreAnterior]).catch(() => { });
        }
      }

      const { error } = await supabase
        .from("productos")
        .update(datosActualizados)
        .eq("id", productoEditar.id);

      if (error) throw error;
      await cargarProductos();
      setToast({ mostrar: true, mensaje: "Producto actualizado correctamente", tipo: "exito" });
    } catch (err) {
      console.error("Error al actualizar:", err);
      setToast({ mostrar: true, mensaje: "Error al actualizar producto", tipo: "error" });
    }
  };

  const eliminarProducto = async () => {
    if (!productoAEliminar) return;
    try {
      setMostrarModalEliminacion(false);

      if (productoAEliminar.url_imagen) {
        const nombreArchivo = productoAEliminar.url_imagen.split("/").pop().split("?")[0];
        await supabase.storage.from("imagenes_productos").remove([nombreArchivo]).catch(() => { });
      }

      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id", productoAEliminar.id);

      if (error) throw error;

      await cargarProductos();
      setToast({ mostrar: true, mensaje: "Producto eliminado exitosamente.", tipo: "exito" });
    } catch (err) {
      console.error("Error al eliminar:", err);
      setToast({ mostrar: true, mensaje: "Error al eliminar producto.", tipo: "error" });
    }
  };

  // --- LÓGICA DE EXPORTACIÓN REPORTE INDIVIDUAL PDF ---
  const generarPDFProducto = (prod) => {
    const doc = new jsPDF();

    // Título Principal Corporativo
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(33, 37, 41);
    doc.text("MARTITATOOLS - FICHA DE PRODUCTO", 14, 20);

    // Metadata informativa
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(108, 117, 125);
    const emision = new Date().toLocaleString("es-NI");
    doc.text(`Fecha y Hora de Emisión: ${emision}`, 14, 26);

    // Divisor decorativo
    doc.setDrawColor(13, 110, 253);
    doc.setLineWidth(1);
    doc.line(14, 30, 196, 30);

    // Datos estructurados en tabla formal
    const categoriaNombre = prod.categorias?.nombre_categoria || "Sin asignar";
    const pVenta = parseFloat(prod.precio_venta || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 });
    const pCompra = parseFloat(prod.precio_compra || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 });

    autoTable(doc, {
      startY: 38,
      theme: "striped",
      headStyles: {
        fillColor: [13, 110, 253],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      head: [["Atributo Técnico", "Detalle de Registro Interno"]],
      body: [
        ["Código Identificador (ID)", `#${prod.id}`],
        ["Nombre del Artículo", prod.nombre || "-"],
        ["Categoría de Clasificación", categoriaNombre],
        ["Existencias en Almacén (Stock)", `${prod.stock} unidades`],
        ["Precio Base de Compra", `C$ ${pCompra}`],
        ["Precio General de Venta", `C$ ${pVenta}`],
      ],
      styles: { fontSize: 11, cellPadding: 6 },
      columnStyles: {
        0: { fontStyle: "bold", width: 60 },
      },
    });

    // Cierre o pie del reporte técnico
    const yFinal = doc.lastAutoTable.finalY || 45;
    doc.setFontSize(9);
    doc.setTextColor(142, 142, 142);
    doc.text("Ferretería Martita Castilla - Control Digital e Inteligencia de Negocio", 14, yFinal + 15);

    doc.save(`Ficha_Producto_${prod.id}_${prod.nombre?.replace(/\s+/g, '_')}.pdf`);
  };

  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setProductosFiltrados(productos);
    } else {
      const textoLower = textoBusqueda.toLowerCase().trim();
      const filtrados = productos.filter((prod) => {
        const nombre = prod.nombre?.toLowerCase() || "";
        const precio = prod.precio_venta?.toString() || "";
        return (
          nombre.includes(textoLower) ||
          precio.includes(textoLower)
        );
      });
      setProductosFiltrados(filtrados);
    }
  }, [textoBusqueda, productos]);

  useEffect(() => {
    cargarCategorias();
    cargarProductos();
  }, []);

  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  return (
    <Container className="mt-3">
      {/* Cabecera optimizada con Flexbox */}
      <div className="d-flex align-items-center justify-content-between mb-3 mt-2">
        <div className="d-flex align-items-center">
          <h3 className="mb-0 fw-bold">
            <i className="bi-bag-heart-fill me-2 text-primary"></i>
            Gestión de Productos
          </h3>
        </div>

        <div className="ms-2">
          <Button
            onClick={() => setMostrarModal(true)}
            className="d-flex align-items-center justify-content-center shadow-sm px-3"
            style={{
              height: '42px',
              borderRadius: '10px',
              minWidth: '45px'
            }}
          >
            <i className="bi-plus-lg"></i>
            <span className="d-none d-sm-inline ms-2 fw-semibold" style={{ whiteSpace: 'nowrap' }}>
              Nuevo Producto
            </span>
          </Button>
        </div>
      </div>

      <hr />

      <Row className="mb-4">
        <Col md={6} lg={5}>
          <CuadroBusquedas
            textoBusqueda={textoBusqueda}
            manejarCambioBusqueda={manejarBusqueda}
            placeholder="Buscar por nombre o precio..."
          />
        </Col>
      </Row>

      {cargando ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <h4 className="text-muted mt-3 fw-semibold">Cargando productos...</h4>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="text-center my-5 py-5 text-muted">
          <i className="bi bi-box-seam fs-1 d-block mb-2"></i>
          <h4 className="fw-semibold">No se encontraron productos coincidentes.</h4>
        </div>
      ) : (
        <Row>
          {/* Vista Móvil */}
          <Col xs={12} className="d-lg-none">
            <TarjetaProducto
              productos={productosPaginados}
              abrirModalEdicion={(p) => { setProductoEditar(p); setMostrarModalEdicion(true); }}
              abrirModalEliminacion={(p) => { setProductoAEliminar(p); setMostrarModalEliminacion(true); }}
              generarPDFProducto={generarPDFProducto}
            />
          </Col>
          
          {/* Vista Escritorio */}
          <Col lg={12} className="d-none d-lg-block">
            <TablaProductos
              productos={productosPaginados}
              abrirModalEdicion={(p) => { setProductoEditar(p); setMostrarModalEdicion(true); }}
              abrirModalEliminacion={(p) => { setProductoAEliminar(p); setMostrarModalEliminacion(true); }}
              generarPDFProducto={generarPDFProducto}
            />
          </Col>
        </Row>
      )}

      {!cargando && productosFiltrados.length > 0 && (
        <Paginacion
          registrosPorPagina={registrosPorPagina}
          totalRegistros={productosFiltrados.length}
          paginaActual={paginaActual}
          establecerPaginaActual={establecerPaginaActual}
          establecerRegistrosPorPagina={establecerRegistrosPorPagina}
        />
      )}

      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejoCambioInput={manejoCambioInput}
        manejoCambioArchivo={manejoCambioArchivo}
        agregarProducto={agregarProducto}
        categorias={categorias}
      />

      <ModalEdicionProducto
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        productoEditar={productoEditar}
        manejoCambioInputEdicion={manejoCambioInputEdicion}
        manejoCambioArchivoActualizar={manejoCambioArchivoActualizar}
        actualizarProducto={actualizarProducto}
        categorias={categorias}
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
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Productos;