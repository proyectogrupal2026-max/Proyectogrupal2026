import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaProductos = ({
  productos,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productos && productos.length >= 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [productos]);

  return (
    <>
      {loading ? (
        <div className="text-center">
          <h4>Cargando productos...</h4>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : (
        <Table striped borderless hover responsive size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th className="d-none d-md-table-cell">Categoría</th>
              <th className="d-none d-lg-table-cell">Precio Compra</th>
              <th className="d-none d-lg-table-cell">Precio Venta</th>
              <th>Stock</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>

                  <td>{producto.nombre}</td>

                  <td className="d-none d-md-table-cell">
                    {producto.categorias?.nombre_categoria || "Sin categoría"}
                  </td>

                  <td className="d-none d-lg-table-cell">
                    C$ {Number(producto.precio_compra).toFixed(2)}
                  </td>

                  <td className="d-none d-lg-table-cell">
                    C$ {Number(producto.precio_venta).toFixed(2)}
                  </td>

                  <td>{producto.stock}</td>

                  <td className="text-center">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="m-1"
                      onClick={() => abrirModalEdicion(producto)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => abrirModalEliminacion(producto)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default TablaProductos;