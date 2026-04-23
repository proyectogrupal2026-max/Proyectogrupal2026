import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaProveedores = ({
  proveedores,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (proveedores && proveedores.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [proveedores]);

  return (
    <>
      {loading ? (
        <div className="text-center">
          <h4>Cargando proveedores...</h4>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : (
        <Table striped borderless hover responsive size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th className="d-none d-md-table-cell">Teléfono</th>
              <th className="d-none d-lg-table-cell">Dirección</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {proveedores.map((proveedor) => (
              <tr key={proveedor.id}>
                <td>{proveedor.id}</td>

                <td>{proveedor.nombre}</td>

                <td className="d-none d-md-table-cell">
                  {proveedor.telefono || "Sin teléfono"}
                </td>

                <td className="d-none d-lg-table-cell">
                  {proveedor.direccion || "Sin dirección"}
                </td>

                <td className="text-center">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="m-1"
                    onClick={() => abrirModalEdicion(proveedor)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>

                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => abrirModalEliminacion(proveedor)}
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

export default TablaProveedores;