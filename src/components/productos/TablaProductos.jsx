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

  return (
    <>
      {loading ? (
        <div className="text-center">
          <h4>Cargando productos...</h4>
          <Spinner animation="border" variant="primary" role="status" />
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center">
          <h4>No hay productos registrados.</h4>
        </div>
      ) : (
        <Table striped borderless hover responsive size="sm" className="align-middle">
          <thead>
            <tr>
              <th style={{ width: "90px" }} className="text-center">Imagen</th>
              {/* Alineación consistente para el encabezado */}
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
              <tr key={producto.id}>
                <td className="text-center">
                  <Image
                    src={producto.url_imagen}
                    alt={producto.nombre}
                    rounded
                    style={{ width: "55px", height: "55px", objectFit: "cover" }}
                  />
                </td>
                {/* Se añade ps-3 (padding start) para separarlo un poco de la imagen y centrarlo visualmente en su espacio */}
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
                    className="m-1"
                    onClick={() => abrirModalEliminacion(producto)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default TablaProductos;