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

  const estilos = {
    tablaContainer: {
      backgroundColor: "#ffffff",
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    },
    header: {
      backgroundColor: "#f8fafc",
      color: "#64748b",
      textTransform: "uppercase",
      fontSize: "0.85rem",
      letterSpacing: "0.5px",
      fontWeight: "700",
      borderBottom: "2px solid #edf2f7",
    },
    fila: {
      verticalAlign: "middle",
      fontSize: "0.95rem",
      color: "#334155",
      borderBottom: "1px solid #f1f5f9",
    },
    btnEdit: {
      width: "35px",
      height: "35px",
      borderRadius: "10px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      color: "#f59e0b",
      backgroundColor: "#fffbeb",
      transition: "all 0.2s",
    },
    btnDelete: {
      width: "35px",
      height: "35px",
      borderRadius: "10px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      color: "#ef4444",
      backgroundColor: "#fef2f2",
      transition: "all 0.2s",
    }
  };

  return (
    <>
      {loading ? (
        <div className="text-center my-5">
          <h4 className="text-muted fw-normal mb-3">Cargando proveedores...</h4>
          <Spinner animation="border" variant="primary" role="status" />
        </div>
      ) : (
        <div style={estilos.tablaContainer} className="table-responsive">
          <Table borderless hover className="mb-0">
            <thead style={estilos.header}>
              <tr>
                <th className="ps-4 py-3">ID</th>
                <th className="py-3">Nombre</th>
                <th className="py-3 d-none d-md-table-cell">Teléfono</th>
                <th className="py-3 d-none d-lg-table-cell">Dirección</th>
                <th className="py-3 text-center pe-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {proveedores.map((proveedor) => (
                <tr key={proveedor.id} style={estilos.fila}>
                  <td className="ps-4 fw-bold text-muted">#{proveedor.id}</td>

                  <td className="fw-semibold">{proveedor.nombre}</td>

                  <td className="d-none d-md-table-cell">
                    <span className="text-muted">
                      <i className="bi bi-telephone me-2"></i>
                      {proveedor.telefono || "N/A"}
                    </span>
                  </td>

                  <td className="d-none d-lg-table-cell text-truncate" style={{ maxWidth: "250px" }}>
                    <span className="text-muted">
                      <i className="bi bi-geo-alt me-2"></i>
                      {proveedor.direccion || "N/A"}
                    </span>
                  </td>

                  <td className="text-center pe-4">
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        style={estilos.btnEdit}
                        onClick={() => abrirModalEdicion(proveedor)}
                        title="Editar proveedor"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Button>

                      <Button
                        style={estilos.btnDelete}
                        onClick={() => abrirModalEliminacion(proveedor)}
                        title="Eliminar proveedor"
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default TablaProveedores;