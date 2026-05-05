import React, { useState, useEffect } from "react";
import { Table, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaCategorias = ({
  categorias,
  abrirModalEdicion,
  abrirModalEliminacion,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categorias && categorias.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [categorias]);

  // Estilos modernos para la tabla
  const estilos = {
    contenedorTabla: {
      backgroundColor: "#ffffff",
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      border: "1px solid #f0f0f0",
      marginTop: "20px"
    },
    encabezado: {
      backgroundColor: "#f8f9fa",
      color: "#455a64",
      fontSize: "0.95rem",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      borderBottom: "2px solid #edf2f7"
    },
    fila: {
      fontSize: "1rem",
      color: "#2d3748",
      transition: "background-color 0.2s ease",
      verticalAlign: "middle"
    },
    celdaAcciones: {
      display: "flex",
      justifyContent: "center",
      gap: "8px",
      padding: "12px"
    },
    btnAccion: {
      borderRadius: "8px",
      width: "38px",
      height: "38px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s",
      border: "none"
    }
  };

  return (
    <div style={estilos.contenedorTabla}>
      {loading ? (
        <div className="text-center p-5">
          <h4 style={{ color: "#6c757d", fontWeight: "600" }}>Cargando categorías...</h4>
          <Spinner animation="border" variant="primary" role="status" className="mt-2" />
        </div>
      ) : (
        <Table hover responsive className="mb-0">
          <thead style={estilos.encabezado}>
            <tr>
              <th className="ps-4 py-3">ID</th>
              <th className="py-3">Nombre Categoría</th>
              <th className="d-none d-md-table-cell py-3">Descripción</th>
              <th className="text-center py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id} style={estilos.fila}>
                <td className="ps-4 py-3 fw-bold" style={{ color: "#718096" }}>
                  #{categoria.id}
                </td>
                <td className="py-3 fw-semibold">
                  {categoria.nombre_categoria}
                </td>
                <td className="d-none d-md-table-cell py-3 text-muted">
                  {categoria.descripcion_categoria || "Sin descripción"}
                </td>
                <td className="py-3">
                  <div style={estilos.celdaAcciones}>
                    <Button
                      variant="light"
                      style={{ 
                        ...estilos.btnAccion, 
                        color: "#f59e0b", 
                        backgroundColor: "#fffbeb" 
                      }}
                      onClick={() => abrirModalEdicion(categoria)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil-square" style={{ fontSize: "1.1rem" }}></i>
                    </Button>

                    <Button
                      variant="light"
                      style={{ 
                        ...estilos.btnAccion, 
                        color: "#ef4444", 
                        backgroundColor: "#fef2f2" 
                      }}
                      onClick={() => abrirModalEliminacion(categoria)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash3" style={{ fontSize: "1.1rem" }}></i>
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