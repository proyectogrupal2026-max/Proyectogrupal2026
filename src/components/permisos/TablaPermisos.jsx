import React from "react";
import { Table, Button, Badge } from "react-bootstrap";

const TablaPermisos = ({ roles, abrirModalEdicion }) => {
  return (
    <Table striped hover responsive className="align-middle mb-0">
      <thead>
        <tr>
          <th>Rol</th>
          <th>Descripción</th>
          <th className="text-center">Cantidad de Permisos</th>
          <th className="text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {roles.map((rol) => {
          // Cuenta cuántos accesos tienen valor verdadero realmente
          const activos = Object.values(rol.permisos || {}).filter(Boolean).length;

          return (
            <tr key={rol.rol}>
              <td><strong className="text-primary">{rol.rol}</strong></td>
              <td>{rol.descripcion || "Acceso modular al sistema de facturación."}</td>
              <td className="text-center">
                <Badge bg={activos > 5 ? "success" : "info"} className="px-2 py-1.5">
                  {activos} activos
                </Badge>
              </td>
              <td className="text-center">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="fw-bold"
                  onClick={() => abrirModalEdicion(rol)}
                >
                  <i className="bi bi-pencil-square me-1"></i>Editar Permisos
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default TablaPermisos;