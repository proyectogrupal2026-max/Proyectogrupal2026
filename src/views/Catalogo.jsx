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
      // Sincronizado con tus tablas: 'productos' y 'categorias'
      const [resProductos, resCategorias] = await Promise.all([
        supabase.from("productos").select("*").order("nombre", { ascending: true }),
        // IMPORTANTE: Aquí usamos 'id' porque así está en tu CREATE TABLE categorias
        supabase.from("categorias").select("id, nombre_categoria").order("nombre_categoria")
      ]);

      if (resProductos.error) throw resProductos.error;
      if (resCategorias.error) throw resCategorias.error;

      setProductos(resProductos.data);
      setCategorias(resCategorias.data);
    } catch (err) {
      console.error("Error en carga:", err);
      setError("Error al conectar con la base de datos de la ferretería.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const productosFiltrados = useMemo(() => {
    let filtrados = productos;

    // Sincronizado con 'categoria_id' de tu tabla productos
    if (categoriaSeleccionada !== "todas") {
      filtrados = filtrados.filter(
        (p) => p.categoria_id === parseInt(categoriaSeleccionada)
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

  // Buscamos por 'id' en el array de categorías
  const obtenerNombreCategoria = (idCat) => {
    const cat = categorias.find((c) => c.id === idCat);
    return cat ? cat.nombre_categoria : "Sin categoría";
  };

  return (
    <Container className="mt-3 px-3">
      <Row className="text-center mb-4">
        <Col>
          <h2 className="fw-bold">Catálogo de Ferretería</h2>
          <p className="lead text-muted">Productos de la Ferretería Martita</p>
        </Col>
      </Row>

      <Row className="mb-4 align-items-end g-3">
        <Col md={4} lg={3}>
          <Form.Group controlId="filtroCategoria">
            <Form.Label className="small fw-bold">Categoría</Form.Label>
            <Form.Select 
              value={categoriaSeleccionada} 
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="shadow-sm"
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre_categoria}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={8} lg={6}>
          <Form.Group controlId="busquedaProducto">
            <Form.Label className="small fw-bold">Buscar por nombre o precio</Form.Label>
            <CuadroBusquedas 
              textoBusqueda={textoBusqueda} 
              manejarCambioBusqueda={(e) => setTextoBusqueda(e.target.value)} 
            />
          </Form.Group>
        </Col>
      </Row>

      {cargando ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Consultando Supabase...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          {productosFiltrados.length === 0 && (
            <Alert variant="info" className="text-center">
              No hay productos que coincidan con la búsqueda.
            </Alert>
          )}

          <Row className="g-4">
            {productosFiltrados.map((prod) => (
              <Col xs={12} sm={6} md={4} lg={3} key={prod.id}>
                <TarjetaCatalogo
                  producto={prod}
                  categoriaNombre={obtenerNombreCategoria(prod.categoria_id)}
                />
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Catalogo;