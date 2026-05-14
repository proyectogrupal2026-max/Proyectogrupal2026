import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Spinner, Alert, Form } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetaCatalogo from "../components/catalogo/TarjetaCatalogo";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todas");
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [resProductos, resCategorias] = await Promise.all([
        supabase.from("productos").select("*").order("nombre", { ascending: true }),
        supabase.from("categorias").select("id, nombre_categoria").order("nombre_categoria")
      ]);

      if (resProductos.error) throw resProductos.error;
      if (resCategorias.error) throw resCategorias.error;

      setProductos(resProductos.data || []);
      setCategorias(resCategorias.data || []);
    } catch (err) {
      console.error("Error en carga:", err);
      setError("Error al conectar con la base de datos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Función clave: Busca el nombre real usando el ID que tiene el producto
  const obtenerNombreCategoria = (idCat) => {
    if (!idCat) return "Sin categoría";
    const cat = categorias.find((c) => String(c.id) === String(idCat));
    return cat ? cat.nombre_categoria : "Sin categoría";
  };

  const productosFiltrados = useMemo(() => {
    let filtrados = productos;

    if (categoriaSeleccionada !== "todas") {
      filtrados = filtrados.filter(
        (p) => String(p.categoria_id) === String(categoriaSeleccionada) || 
               String(p.categoria_producto) === String(categoriaSeleccionada)
      );
    }

    if (textoBusqueda.trim()) {
      const textoLower = textoBusqueda.toLowerCase().trim();
      filtrados = filtrados.filter((p) => {
        const nombre = (p.nombre || "").toLowerCase();
        const precio = (p.precio_venta || "").toString();
        return nombre.includes(textoLower) || precio.includes(textoLower);
      });
    }
    return filtrados;
  }, [productos, categoriaSeleccionada, textoBusqueda]);

  return (
    <Container className="mt-3 px-3">
      <Row className="text-center mb-4">
        <Col>
          <h2 className="fw-bold">Catálogo MartitaTools</h2>
          <p className="lead text-muted">Gestión de inventario en tiempo real</p>
        </Col>
      </Row>

      <Row className="mb-4 align-items-end g-3">
        <Col md={4}>
          <Form.Group controlId="filtroCategoria">
            <Form.Label className="small fw-bold">Filtrar por Categoría</Form.Label>
            <Form.Select 
              value={categoriaSeleccionada} 
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="shadow-sm border-0"
              style={{ backgroundColor: "#f8fafc" }}
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nombre_categoria}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={8}>
          <Form.Group controlId="busquedaProducto">
            <Form.Label className="small fw-bold">Buscar producto</Form.Label>
            <CuadroBusquedas 
              textoBusqueda={textoBusqueda} 
              manejarCambioBusqueda={(e) => setTextoBusqueda(e.target.value)} 
            />
          </Form.Group>
        </Col>
      </Row>

      {cargando ? (
        <div className="text-center my-5"><Spinner animation="border" variant="primary" /></div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row className="g-4">
          {productosFiltrados.map((prod) => (
            <Col xs={12} sm={6} md={4} lg={3} key={prod.id}>
              <TarjetaCatalogo
                producto={prod}
                // Aquí pasamos el nombre resuelto para que la tarjeta no tenga que adivinar
                categoriaNombre={obtenerNombreCategoria(prod.categoria_id || prod.categoria_producto)}
                alSeleccionarCategoria={(id) => setCategoriaSeleccionada(id.toString())}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Catalogo;