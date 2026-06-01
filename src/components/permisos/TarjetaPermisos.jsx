import React from "react";
import { Card, Button, Badge, Row, Col } from "react-bootstrap";

const TarjetaPermisos = ({ roles, abrirModalEdicion }) => {
  return (
    <>
      {roles.map((rol) => {
        // Calculamos los activos de forma segura con un bloque limpio
        const activos = Object.values(rol.permisos || {}).filter(Boolean).length;

        return (
          <Card key={rol.rol} className="mb-3 border-0 shadow-sm rounded-3">
            <Card.Body className="p-3">
              <Row className="align-items-center">
                <Col>
                  <h5 className="fw-bold mb-1 text-dark">{rol.rol}</h5>
                  <small className="text-muted">
                    {rol.descripcion || "Acceso modular al sistema de la ferretería."}
                  </small>
                </Col>
                <Col xs="auto">
                  <Badge bg={activos > 5 ? "success" : "info"}>
                    {activos} Activos
                  </Badge>
                </Col>
              </Row>

              <Button
                variant="outline-primary"
                className="w-100 mt-3 fw-bold"
                onClick={() => abrirModalEdicion(rol)}
              >
                <i className="bi bi-pencil-square me-2"></i>Editar Permisos
              </Button>
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
};

export default TarjetaPermisos;