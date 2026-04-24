import React, { useState } from "react";
import { Table, Badge, Button } from "react-bootstrap";
import ModalDetalleVenta from "./ModalDetalleVenta";

const TablaVentas = ({ ventas }) => {
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [verDetalle, setVerDetalle] = useState(false);

  const manejarVerDetalle = (id) => {
    setIdSeleccionado(id);
    setVerDetalle(true);
  };

  return (
    <>
      <Table striped hover responsive className="shadow-sm align-middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id}>
              <td>#{venta.id}</td>
              <td>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
              <td>
                <Badge bg="success">{venta.estado}</Badge>
              </td>
              <td className="text-center">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => manejarVerDetalle(venta.id)}
                >
                  <i className="bi bi-eye-fill me-1"></i> Ver Detalle
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <ModalDetalleVenta 
        show={verDetalle} 
        onHide={() => setVerDetalle(false)} 
        ventaId={idSeleccionado} 
      />
    </>
  );
};

export default TablaVentas;