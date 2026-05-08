import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button, Badge } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaPerfil = ({
  perfiles,
  abrirModalEdicion,
  abrirModalEliminacion,
  cargando
}) => {
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  const alternarTarjetaActiva = (id) => {
    setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
  };

  // --- LÓGICA DE ESCAPE PARA CERRAR ACCIONES ---
  const manejarTeclaEscape = useCallback((evento) => {
    if (evento.key === "Escape") {
      setIdTarjetaActiva(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => {
      window.removeEventListener("keydown", manejarTeclaEscape);
    };
  }, [manejarTeclaEscape]);

  const estilos = {
    card: {
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      border: "1px solid #edf2f7",
    },
    avatarContainer: {
      width: "55px",
      height: "55px",
      borderRadius: "15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(5px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    },
    btnAction: {
      width: "55px",
      height: "55px",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      fontSize: "1.3rem",
      transition: "transform 0.2s ease"
    }
  };

  if (cargando) {
    return (
      <div className="text-center my-5 py-4">
        <Spinner animation="border" variant="primary" />
        <h5 className="text-muted mt-2 fw-normal">Cargando perfiles...</h5>
      </div>
    );
  }

  if (!perfiles || perfiles.length === 0) {
    return (
      <div className="text-center my-5 p-4 rounded-4 bg-light border border-dashed">
        <i className="bi bi-people text-muted opacity-50" style={{ fontSize: "3rem" }}></i>
        <p className="text-muted mt-2">No hay perfiles disponibles.</p>
      </div>
    );
  }

  return (
    <div className="px-1">
      {perfiles.map((perfil) => {
        const tarjetaActiva = idTarjetaActiva === perfil.user_id;

        return (
          <Card
            key={perfil.user_id}
            style={{
              ...estilos.card,
              transform: tarjetaActiva ? "scale(0.97)" : "scale(1)",
              boxShadow: tarjetaActiva 
                ? "0 10px 20px -5px rgba(0, 0, 0, 0.1)" 
                : "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
            }}
            className="mb-3 rounded-4 border-0 shadow-sm"
            onClick={() => alternarTarjetaActiva(perfil.user_id)}
          >
            <Card.Body className="p-3">
              <Row className="align-items-center">
                <Col xs={3}>
                  <div 
                    style={estilos.avatarContainer}
                    className={perfil.rol === 'Administrador' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-primary bg-opacity-10 text-primary'}
                  >
                    <i className={`bi ${perfil.rol === 'Administrador' ? 'bi-shield-check' : 'bi-person-circle'} fs-2`}></i>
                  </div>
                </Col>

                <Col xs={9}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="w-100">
                      <div className="fw-bold text-dark fs-5 text-truncate">
                        {perfil.nombre_completo}
                      </div>
                      <Badge 
                        bg={perfil.rol === 'Administrador' ? 'danger' : 'success'} 
                        className="rounded-pill px-2 mb-1"
                        style={{ fontSize: "0.75rem" }}
                      >
                        {perfil.rol}
                      </Badge>
                    </div>
                  </div>
                  <div className="small text-muted mt-1">
                    <i className="bi bi-telephone-fill me-2" style={{ fontSize: "0.8rem" }}></i>
                    {perfil.telefono || "Sin teléfono"}
                  </div>
                </Col>
              </Row>

              {/* Overlay de Acciones (Solo Editar y Eliminar) */}
              {tarjetaActiva && (
                <div 
                  style={estilos.overlay}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdTarjetaActiva(null);
                  }}
                >
                  <div className="d-flex gap-4" onClick={(e) => e.stopPropagation()}>
                    <Button
                      style={{ ...estilos.btnAction, backgroundColor: "#fffbeb", color: "#f59e0b" }}
                      onClick={() => {
                        abrirModalEdicion(perfil);
                        setIdTarjetaActiva(null);
                      }}
                      className="shadow-sm"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </Button>

                    <Button
                      style={{ ...estilos.btnAction, backgroundColor: "#fef2f2", color: "#ef4444" }}
                      onClick={() => {
                        abrirModalEliminacion(perfil);
                        setIdTarjetaActiva(null);
                      }}
                      className="shadow-sm"
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </Button>
                  </div>
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