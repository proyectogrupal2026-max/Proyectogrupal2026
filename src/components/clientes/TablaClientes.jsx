import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaClientes = ({
  clientes,
  abrirModalEdicion,
  abrirModalEliminacion,
  generarPDFCliente,
  copiarCliente // <--- Prop recibida
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(!(clientes && clientes.length > 0));
  }, [clientes]);

  const estilos = {
    contenedorTabla: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
      border: "1px solid #f0f0f0",
      marginTop: "20px"
    },
    encabezado: {
      backgroundColor: "#f8fafc",
      color: "#64748b",
      fontSize: "0.85rem",
      fontWeight: "700",
      letterSpacing: "0.05em"
    },
    fila: {
      borderBottom: "1px solid #f1f5f9",
    },
    celdaAcciones: {
      display: "flex",
      justifyContent: "center",
      gap: "8px",
    },
    btnAccion: {
      borderRadius: "10px",
      width: "38px",
      height: "38px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none"
    }
  };

  return (
    <div style={estilos.contenedorTabla}>
      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" role="status" />
          <h4 className="text-muted mt-3 fw-semibold">Cargando clientes...</h4>
        </div>
      ) : (
        <Table borderless hover responsive className="align-middle mb-0 text-center" style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead style={estilos.encabezado} className="bg-light border-bottom">
            <tr className="text-secondary text-uppercase">
              <th className="py-4" style={{ width: "12%" }}>ID</th>
              <th className="py-4" style={{ width: "35%" }}>Nombre Completo</th>
              <th className="d-none d-md-table-cell py-4" style={{ width: "25%" }}>Teléfono</th>
              <th className="py-4" style={{ width: "28%" }}>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '1rem' }}>
            {clientes.map((cliente) => (
              <tr key={cliente.id} style={estilos.fila}>
                <td className="py-3 fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
                  #{cliente.id}
                </td>
                <td className="py-3 fw-bold text-dark">
                  {cliente.nombre} {cliente.apellido}
                </td>
                <td className="d-none d-md-table-cell py-3 text-muted">
                  {cliente.telefono || "Sin teléfono"}
                </td>
                <td className="py-3">
                  <div style={estilos.celdaAcciones}>
                    {/* Botón de Edición */}
                    <Button
                      variant="light"
                      style={{
                        ...estilos.btnAccion,
                        color: "#f59e0b",
                        backgroundColor: "#fffbeb",
                        border: "1px solid #fef3c7"
                      }}
                      className="shadow-sm"
                      onClick={() => abrirModalEdicion(cliente)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil-square fs-6"></i>
                    </Button>

                    {/* Botón de Eliminación */}
                    <Button
                      variant="light"
                      style={{
                        ...estilos.btnAccion,
                        color: "#ef4444",
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fee2e2"
                      }}
                      className="shadow-sm"
                      onClick={() => abrirModalEliminacion(cliente)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash3 fs-6"></i>
                    </Button>

                    {/* Botón: Exportar Documento PDF */}
                    <Button
                      variant="light"
                      style={{
                        ...estilos.btnAccion,
                        color: "#dc3545",
                        backgroundColor: "#fdf2f2",
                        border: "1px solid #fcdede"
                      }}
                      className="shadow-sm"
                      onClick={() => generarPDFCliente(cliente)}
                      title="Exportar Reporte PDF"
                    >
                      <i className="bi bi-file-earmark-pdf-fill fs-6"></i>
                    </Button>

                    {/* Botón de Copiar */}
                    <Button
                      variant="light"
                      style={{
                        ...estilos.btnAccion,
                        color: "#198754",
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #dcfce7"
                      }}
                      className="shadow-sm"
                      onClick={() => copiarCliente(cliente)}
                      title="Copiar datos"
                    >
                      <i className="bi bi-clipboard-fill fs-6"></i>
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

export default TablaClientes;