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
    if (proveedores) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [proveedores]);

  // Estilos modernos, centrados y unificados con los demás módulos
  const estilos = {
    tablaContainer: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
      border: "1px solid #f0f0f0",
      marginTop: "20px"
    },
    header: {
      backgroundColor: "#f8fafc",
      color: "#64748b",
      fontSize: "0.85rem",
      fontWeight: "700",
      letterSpacing: "0.05em"
    },
    fila: {
      borderBottom: "1px solid #f1f5f9",
    },
    btnEdit: {
      width: "38px",
      height: "38px",
      borderRadius: "10px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid #fef3c7",
      color: "#f59e0b",
      backgroundColor: "#fffbeb",
    },
    btnDelete: {
      width: "38px",
      height: "38px",
      borderRadius: "10px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid #fee2e2",
      color: "#ef4444",
      backgroundColor: "#fef2f2",
    }
  };

  return (
    <>
      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" role="status" />
          <h4 className="text-muted mt-3 fw-semibold">Cargando proveedores...</h4>
        </div>
      ) : proveedores.length === 0 ? (
        <div className="text-center my-5 py-5 text-muted">
          <i className="bi bi-person-lines-fill fs-1 d-block mb-2"></i>
          <h4 className="fw-semibold">No hay proveedores registrados.</h4>
        </div>
      ) : (
        <div style={estilos.tablaContainer}>
          <Table borderless hover responsive className="align-middle mb-0 text-center" style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead style={estilos.header} className="bg-light border-bottom">
              <tr className="text-secondary text-uppercase">
                <th className="py-4" style={{ width: "15%" }}>ID</th>
                <th className="py-4" style={{ width: "30%" }}>Nombre</th>
                <th className="py-4 d-none d-md-table-cell" style={{ width: "20%" }}>Teléfono</th>
                <th className="py-4 d-none d-lg-table-cell" style={{ width: "20%" }}>Dirección</th>
                <th className="py-4" style={{ width: "15%" }}>Acciones</th>
              </tr>
            </thead>

            <tbody style={{ fontSize: '1rem' }}>
              {proveedores.map((proveedor) => (
                <tr key={proveedor.id} style={estilos.fila}>
                  <td className="py-3 fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
                    #{proveedor.id}
                  </td>

                  <td className="py-3 fw-bold text-dark">{proveedor.nombre}</td>

                  <td className="py-3 d-none d-md-table-cell">
                    <span className="text-muted">
                      <i className="bi bi-telephone me-2"></i>
                      {proveedor.telefono || "N/A"}
                    </span>
                  </td>

                  <td className="py-3 d-none d-lg-table-cell text-truncate" style={{ maxWidth: "250px" }}>
                    <span className="text-muted">
                      <i className="bi bi-geo-alt me-2"></i>
                      {proveedor.direccion || "N/A"}
                    </span>
                  </td>

                  <td className="py-3">
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        style={estilos.btnEdit}
                        className="shadow-sm"
                        onClick={() => abrirModalEdicion(proveedor)}
                        title="Editar proveedor"
                      >
                        <i className="bi bi-pencil-square fs-6"></i>
                      </Button>

                      <Button
                        style={estilos.btnDelete}
                        className="shadow-sm"
                        onClick={() => abrirModalEliminacion(proveedor)}
                        title="Eliminar proveedor"
                      >
                        <i className="bi bi-trash3-fill fs-6"></i>
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