import React from "react";
import { Table, Spinner, Button, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaPerfiles = ({
  perfiles,
  abrirModalEdicion,
  abrirModalEliminacion,
  cargando
}) => {
  
  const estilos = {
    contenedor: {
      borderRadius: "15px",
      overflow: "hidden",
      border: "1px solid #e2e8f0",
      backgroundColor: "#ffffff",
    },
    header: {
      backgroundColor: "#1e293b",
      color: "#ffffff",
      fontSize: "0.95rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    fila: {
      transition: "background-color 0.2s ease",
    },
    btnEditar: {
      borderRadius: "8px",
      padding: "6px 10px",
      color: "#f59e0b",
      backgroundColor: "#fffbeb",
      border: "1px solid #fef3c7",
      transition: "all 0.2s",
    },
    btnEliminar: {
      borderRadius: "8px",
      padding: "6px 10px",
      color: "#ef4444",
      backgroundColor: "#fef2f2",
      border: "1px solid #fee2e2",
      transition: "all 0.2s",
    },
    badge: {
      padding: "6px 10px",
      borderRadius: "6px",
      fontWeight: "600",
      fontSize: "0.85rem"
    }
  };

  // 1. Si está cargando
  if (cargando) {
    return (
      <div className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" size="lg" />
        <h4 className="text-muted mt-3 fw-normal">Consultando base de datos...</h4>
      </div>
    );
  }

  // 2. Si terminó de cargar pero no hay nada
  if (!perfiles || perfiles.length === 0) {
    return (
      <div className="text-center my-5 p-5 bg-light rounded-4 border border-dashed">
        <i className="bi bi-people text-muted" style={{ fontSize: "4rem", opacity: 0.5 }}></i>
        <h5 className="text-muted mt-3">No hay perfiles registrados todavía.</h5>
      </div>
    );
  }

  // 3. Tabla con datos
  return (
    <div className="shadow-sm" style={estilos.contenedor}>
      <Table hover responsive className="mb-0">
        <thead>
          <tr style={estilos.header}>
            <th className="ps-4 py-3 border-0">ID</th>
            <th className="py-3 border-0">Nombre Completo</th>
            <th className="py-3 border-0 text-center">Rol</th>
            <th className="py-3 border-0 d-none d-md-table-cell">Teléfono</th>
            <th className="py-3 border-0 text-center pe-4">Acciones</th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {perfiles.map((perfil) => (
            <tr key={perfil.user_id} style={estilos.fila}>
              <td className="ps-4 py-3">
                <code className="text-primary bg-light px-2 py-1 rounded" style={{ fontSize: "0.85rem" }}>
                  {perfil.user_id ? perfil.user_id.slice(0, 8) : "N/A"}
                </code>
              </td>
              <td className="fw-bold text-dark">{perfil.nombre_completo}</td>
              <td className="text-center">
                <Badge 
                  style={estilos.badge}
                  bg={
                    perfil.rol === 'Administrador' ? 'danger' : 
                    perfil.rol === 'Vendedor' ? 'success' : 'info'
                  }
                >
                  <i className={`bi ${perfil.rol === 'Administrador' ? 'bi-shield-lock' : 'bi-person'} me-1`}></i>
                  {perfil.rol}
                </Badge>
              </td>
              <td className="d-none d-md-table-cell text-muted">
                {perfil.telefono ? (
                  <span><i className="bi bi-telephone me-1"></i>{perfil.telefono}</span>
                ) : (
                  <span className="fst-italic opacity-50">Sin asignar</span>
                )}
              </td>
              <td className="text-center pe-4">
                <div className="d-flex justify-content-center gap-2">
                  <button
                    style={estilos.btnEditar}
                    onClick={() => abrirModalEdicion(perfil)}
                    title="Editar perfil"
                    className="btn-soft-ui"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    style={estilos.btnEliminar}
                    onClick={() => abrirModalEliminacion(perfil)}
                    title="Eliminar perfil"
                    className="btn-soft-ui"
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TablaPerfiles;