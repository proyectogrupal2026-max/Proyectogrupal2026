import React from "react";
import { Table, Spinner, Button, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaPerfiles = ({
  perfiles,
  abrirModalEdicion,
  abrirModalEliminacion,
  cargando // <--- Mejor recibe esto del padre
}) => {
  
  // 1. Si está cargando realmente (desde Supabase)
  if (cargando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <h4 className="text-muted mt-2">Consultando base de datos...</h4>
      </div>
    );
  }

  // 2. Si terminó de cargar pero no hay nada
  if (!perfiles || perfiles.length === 0) {
    return (
      <div className="text-center my-5 p-5 bg-light border rounded">
        <i className="bi bi-people text-muted" style={{ fontSize: "3rem" }}></i>
        <h5 className="text-muted mt-3">No hay perfiles registrados todavía.</h5>
      </div>
    );
  }

  // 3. Si hay datos, mostrar la tabla
  return (
    <div className="shadow-sm rounded border">
      <Table striped hover responsive className="mb-0 bg-white">
        <thead className="table-dark">
          <tr>
            <th className="ps-3">ID</th>
            <th>Nombre Completo</th>
            <th>Rol</th>
            <th className="d-none d-md-table-cell">Teléfono</th>
            <th className="text-center pe-3">Acciones</th>
          </tr>
        </thead>
        <tbody className="align-middle">
          {perfiles.map((perfil) => (
            <tr key={perfil.user_id}>
              <td className="ps-3">
                <code className="text-muted">
                  {perfil.user_id ? perfil.user_id.slice(0, 8) : "N/A"}
                </code>
              </td>
              <td className="fw-bold">{perfil.nombre_completo}</td>
              <td>
                <Badge bg={
                  perfil.rol === 'Administrador' ? 'danger' : 
                  perfil.rol === 'Vendedor' ? 'success' : 'info'
                }>
                  {perfil.rol}
                </Badge>
              </td>
              <td className="d-none d-md-table-cell">
                {perfil.telefono || <span className="text-muted fst-italic">Sin asignar</span>}
              </td>
              <td className="text-center pe-3">
                <Button
                  variant="outline-warning"
                  size="sm"
                  className="me-2"
                  onClick={() => abrirModalEdicion(perfil)}
                >
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => abrirModalEliminacion(perfil)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TablaPerfiles;