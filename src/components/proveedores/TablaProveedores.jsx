import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaProveedores = ({
  proveedores,
  abrirModalEdicion,
  abrirModalEliminacion,
  generarPDFProveedor,
  copiarProveedor // <--- Nueva prop añadida
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(!proveedores);
  }, [proveedores]);

  const estilos = {
    tablaContainer: { backgroundColor: "#ffffff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", border: "1px solid #f0f0f0", marginTop: "20px" },
    header: { backgroundColor: "#f8fafc", color: "#64748b", fontSize: "0.85rem", fontWeight: "700" },
    btnAccion: { width: "38px", height: "38px", borderRadius: "10px", display: "inline-flex", alignItems: "center", justifyContent: "center" },
    btnCopy: { border: "1px solid #e2e8f0", color: "#198754", backgroundColor: "#f1f5f9" },
    btnEdit: { border: "1px solid #fef3c7", color: "#f59e0b", backgroundColor: "#fffbeb" },
    btnDelete: { border: "1px solid #fee2e2", color: "#ef4444", backgroundColor: "#fef2f2" },
    btnPDF: { border: "1px solid #fee2e2", color: "#dc3545", backgroundColor: "#fdf2f2" }
  };

  return (
    <>
      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <h4 className="text-muted mt-3">Cargando proveedores...</h4>
        </div>
      ) : (
        <div style={estilos.tablaContainer}>
          <Table borderless hover responsive className="align-middle mb-0 text-center">
            <thead style={estilos.header}>
              <tr className="text-uppercase">
                <th className="py-4" style={{ width: "10%" }}>ID</th>
                <th className="py-4" style={{ width: "25%" }}>Nombre</th>
                <th className="py-4 d-none d-md-table-cell" style={{ width: "20%" }}>Teléfono</th>
                <th className="py-4 d-none d-lg-table-cell" style={{ width: "25%" }}>Dirección</th>
                <th className="py-4" style={{ width: "20%" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((proveedor) => (
                <tr key={proveedor.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td className="fw-bold text-primary">#{proveedor.id}</td>
                  <td className="fw-bold">{proveedor.nombre}</td>
                  <td className="d-none d-md-table-cell text-muted">{proveedor.telefono || "N/A"}</td>
                  <td className="d-none d-lg-table-cell text-muted text-truncate">{proveedor.direccion || "N/A"}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-1">
                      {/* Botón Copiar */}

                      {/* Editar */}
                      <Button style={{...estilos.btnAccion, ...estilos.btnEdit}} className="shadow-sm" onClick={() => abrirModalEdicion(proveedor)} title="Editar"><i className="bi bi-pencil-square"></i></Button>
                      {/* Eliminar */}
                      <Button style={{...estilos.btnAccion, ...estilos.btnDelete}} className="shadow-sm" onClick={() => abrirModalEliminacion(proveedor)} title="Eliminar"><i className="bi bi-trash3-fill"></i></Button>
                      {/* PDF */}
                      <Button style={{...estilos.btnAccion, ...estilos.btnPDF}} className="shadow-sm" onClick={() => generarPDFProveedor(proveedor)} title="PDF"><i className="bi bi-file-earmark-pdf-fill"></i></Button>

                                            <Button style={{...estilos.btnAccion, ...estilos.btnCopy}} className="shadow-sm" onClick={() => copiarProveedor(proveedor)} title="Copiar"><i className="bi bi-clipboard"></i></Button>
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