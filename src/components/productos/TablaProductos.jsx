import React, { useState, useEffect } from "react";
import { Table, Spinner, Button, Image } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaProductos = ({
  productos,
  abrirModalEdicion,
  abrirModalEliminacion
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productos) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [productos]);

  const estilos = {
    tablaContainer: {
      backgroundColor: "#ffffff",
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
    },
    header: {
      backgroundColor: "#f8fafc",
      color: "#64748b",
      fontSize: "0.85rem",
      fontWeight: "700",
      padding: "15px"
    },
    row: {
      borderBottom: "1px solid #f1f5f9",
    },
    btnAccion: {
      width: "35px",
      height: "35px",
      borderRadius: "10px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
    },
    imgProducto: {
      width: "55px",
      height: "55px",
      objectFit: "cover",
      borderRadius: "12px",
    }
  };

  return (
    <div style={estilos.tablaContainer}>
      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <h4 className="text-muted mt-3">Cargando productos...</h4>
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center my-5 py-5">
          <h4>No hay productos registrados.</h4>
        </div>
      ) : (
        <Table striped borderless hover responsive size="sm" className="align-middle mb-0">
          <thead style={estilos.header}>
            <tr>
              <th style={{ width: "90px" }} className="text-center">Imagen</th>
              <th className="ps-3">Nombre</th>
              <th className="d-none d-md-table-cell">Categoría</th>
              <th>Stock</th>
              <th>Precio Venta</th>
              <th className="d-none d-lg-table-cell">Precio Compra</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} style={estilos.row}>
                <td className="text-center py-2">
                  <Image
                    src={producto.url_imagen}
                    alt={producto.nombre}
                    style={estilos.imgProducto}
                  />
                </td>
                <td className="ps-3">{producto.nombre}</td>
                <td className="d-none d-md-table-cell">
                  {producto.categorias?.nombre_categoria || producto.categoria_producto}
                </td>
                <td>{producto.stock}</td>
                <td>${parseFloat(producto.precio_venta).toFixed(2)}</td>
                <td className="d-none d-lg-table-cell">
                  ${parseFloat(producto.precio_compra).toFixed(2)}
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      style={{ backgroundColor: "#fffbeb", color: "#f59e0b", ...estilos.btnAccion }}
                      onClick={() => abrirModalEdicion(producto)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>

                    <Button
                      style={{ backgroundColor: "#fef2f2", color: "#ef4444", ...estilos.btnAccion }}
                      onClick={() => abrirModalEliminacion(producto)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TablaProductos;