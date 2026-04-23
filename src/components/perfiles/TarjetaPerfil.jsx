import React, { useState } from "react";
import { Card, Row, Col, Spinner, Button, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaPerfil = ({
  perfiles,
  abrirModalEdicion,
  abrirModalEliminacion,
  cargando // Recibimos el estado de carga del padre
}) => {
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  const alternarTarjetaActiva = (id) => {
    setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
  };

  // 1. Estado de carga
  if (cargando) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <h5 className="text-muted mt-2">Cargando perfiles...</h5>
      </div>
    );
  }

  // 2. Estado vacío
  if (!perfiles || perfiles.length === 0) {
    return (
      <div className="text-center my-5 p-4 border rounded bg-light">
        <i className="bi bi-people text-muted fs-1"></i>
        <p className="text-muted mt-2">No hay perfiles disponibles.</p>
      </div>
    );
  }

  return (
    <div className="px-2">
      {perfiles.map((perfil) => {
        const tarjetaActiva = idTarjetaActiva === perfil.user_id;

        return (
          <Card
            key={perfil.user_id}
            className={`mb-3 shadow-sm border-0 position-relative ${
              tarjetaActiva ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => alternarTarjetaActiva(perfil.user_id)}
            style={{ cursor: "pointer", overflow: "hidden" }}
          >
            <Card.Body className="p-3">
              <Row className="align-items-center">
                {/* Avatar/Icono */}
                <Col xs={3} className="text-center">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto" 
                       style={{ width: "50px", height: "50px" }}>
                    <i className="bi bi-person-fill fs-3"></i>
                  </div>
                </Col>

                {/* Información */}
                <Col xs={9}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold text-dark">{perfil.nombre_completo}</div>
                      <Badge bg={perfil.rol === 'Administrador' ? 'danger' : 'info'} className="mb-1">
                        {perfil.rol}
                      </Badge>
                    </div>
                  </div>
                  <div className="small text-muted">
                    <i className="bi bi-telephone me-1"></i>
                    {perfil.telefono || "Sin teléfono"}
                  </div>
                </Col>
              </Row>

              {/* Capa de Acciones (Aparece al tocar la tarjeta) */}
              {tarjetaActiva && (
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center gap-3"
                  style={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.9)", 
                    zIndex: 10,
                    backdropFilter: "blur(2px)" 
                  }}
                >
                  <Button
                    variant="warning"
                    className="rounded-circle shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirModalEdicion(perfil);
                      setIdTarjetaActiva(null);
                    }}
                  >
                    <i className="bi bi-pencil-fill text-white"></i>
                  </Button>

                  <Button
                    variant="danger"
                    className="rounded-circle shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirModalEliminacion(perfil);
                      setIdTarjetaActiva(null);
                    }}
                  >
                    <i className="bi bi-trash-fill"></i>
                  </Button>

                  <Button
                    variant="secondary"
                    className="rounded-circle shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIdTarjetaActiva(null);
                    }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default TarjetaPerfil;