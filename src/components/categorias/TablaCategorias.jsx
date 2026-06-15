import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaCategorias = ({
  categorias,
  abrirModalEdicion,
  abrirModalEliminacion,
  generarPDFCategoria // <--- Recibimos la nueva función como prop
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categorias && categorias.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [categorias]);

  // Estilos modernos, centrados y unificados para la tabla
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
          <h4 className="text-muted mt-3 fw-semibold">Cargando categorías...</h4>
        </div>
      ) : (
        <Table borderless hover responsive className="align-middle mb-0 text-center" style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead style={estilos.encabezado} className="bg-light border-bottom">
            <tr className="text-secondary text-uppercase">
              <th className="py-4" style={{ width: "12%" }}>ID</th>
              <th className="py-4" style={{ width: "38%" }}>Nombre Categoría</th>
              <th className="d-none d-md-table-cell py-4" style={{ width: "32%" }}>Descripción</th>
              <th className="py-4" style={{ width: "18%" }}>Acciones</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '1rem' }}>
            {categorias.map((categoria) => (
              <tr key={categoria.id} style={estilos.fila}>
                <td className="py-3 fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
                  #{categoria.id}
                </td>
                <td className="py-3 fw-bold text-dark">
                  {categoria.nombre_categoria}
                </td>
                <td className="d-none d-md-table-cell py-3 text-muted text-truncate">
                  {categoria.descripcion_categoria || "Sin descripción"}
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
                      onClick={() => abrirModalEdicion(categoria)}
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
                      onClick={() => abrirModalEliminacion(categoria)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash3 fs-6"></i>
                    </Button>

                    {/* NUEVO BOTÓN: EXPORTAR REPORTE PDF */}
                    <Button
                      variant="light"
                      style={{ 
                        ...estilos.btnAccion, 
                        color: "#dc3545", // Color rojo clásico de archivos PDF
                        backgroundColor: "#fdf2f2",
                        border: "1px solid #fcdede"
                      }}
                      className="shadow-sm"
                      onClick={() => generarPDFCategoria(categoria)}
                      title="Exportar Reporte PDF"
                    >
                      <i className="bi bi-file-earmark-pdf-fill fs-6"></i>
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

export default TablaCategorias;