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
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
    },
    header: {
      backgroundColor: "#f8fafc",
      color: "#64748b",
      fontSize: "0.85rem",
      fontWeight: "700",
      letterSpacing: "0.05em"
    },
    row: {
      borderBottom: "1px solid #f1f5f9",
    },
    btnAccion: {
      width: "38px",
      height: "38px",
      borderRadius: "10px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    },
    imgProducto: {
      width: "50px",
      height: "50px",
      objectFit: "cover",
      borderRadius: "12px",
      border: "1px solid #e2e8f0"
    }
  };

  return (
    <div style={estilos.tablaContainer}>
      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <h4 className="text-muted mt-3 fw-semibold">Cargando productos...</h4>
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center my-5 py-5 text-muted">
          <i className="bi bi-box-seam fs-1 d-block mb-2"></i>
          <h4 className="fw-semibold">No hay productos registrados.</h4>
        </div>
      ) : (
        <Table borderless hover responsive className="align-middle mb-0 text-center" style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead style={estilos.header} className="bg-light border-bottom">
            <tr className="text-secondary text-uppercase">
              <th className="py-4" style={{ width: "12%" }}>Imagen</th>
              <th className="py-4" style={{ width: "28%" }}>Nombre</th>
              <th className="py-4 d-none d-md-table-cell" style={{ width: "18%" }}>Categoría</th>
              <th className="py-4" style={{ width: "12%" }}>Stock</th>
              <th className="py-4" style={{ width: "15%" }}>P. Venta</th>
              <th className="py-4 d-none d-lg-table-cell" style={{ width: "15%" }}>P. Compra</th>
              <th className="py-4" style={{ width: "15%" }}>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '1rem' }}>
            {/* Renderiza los productos respetando el orden descendente configurado en el backend */}
            {productos.map((producto) => (
              <tr key={producto.id} style={estilos.row}>
                <td className="py-3">
                  <Image
                    src={producto.url_imagen}
                    alt={producto.nombre}
                    style={estilos.imgProducto}
                    className="shadow-sm"
                  />
                </td>
                <td className="py-3 fw-bold text-dark text-start text-md-center">{producto.nombre}</td>
                <td className="py-3 text-muted d-none d-md-table-cell">
                  {producto.categorias?.nombre_categoria || producto.categoria_producto}
                </td>
                <td className="py-3 fw-semibold text-dark">{producto.stock}</td>
                <td className="py-3 fw-bold text-primary">
                  C$ {parseFloat(producto.precio_venta || 0).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-3 text-secondary fw-semibold d-none d-lg-table-cell">
                  C$ {parseFloat(producto.precio_compra || 0).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-3">
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      style={{ backgroundColor: "#fffbeb", color: "#f59e0b", border: "1px solid #fef3c7", ...estilos.btnAccion }}
                      className="shadow-sm"
                      onClick={() => abrirModalEdicion(producto)}
                    >
                      <i className="bi bi-pencil fs-6"></i>
                    </Button>

                    <Button
                      style={{ backgroundColor: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2", ...estilos.btnAccion }}
                      className="shadow-sm"
                      onClick={() => abrirModalEliminacion(producto)}
                    >
                      <i className="bi bi-trash fs-6"></i>
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