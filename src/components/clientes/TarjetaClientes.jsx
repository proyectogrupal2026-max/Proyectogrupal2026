import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaClientes = ({
  clientes,
  abrirModalEdicion,
  abrirModalEliminacion,
  generarPDFCliente,
  copiarCliente // <--- Prop recibida
}) => {
  const [cargando, setCargando] = useState(true);
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  useEffect(() => {
    setCargando(!(clientes && clientes.length > 0));
  }, [clientes]);

  const manejarTeclaEscape = useCallback((evento) => {
    if (evento.key === "Escape") setIdTarjetaActiva(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => window.removeEventListener("keydown", manejarTeclaEscape);
  }, [manejarTeclaEscape]);

  const stylesOverlayToggle = (id) => {
    setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
  };

  const estilos = {
    card: {
      transition: "all 0.3s ease",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      border: "1px solid #edf2f7",
    },
    iconContainer: {
      width: "50px",
      height: "50px",
      backgroundColor: "#f1f5f9",
      color: "#64748b",
      borderRadius: "12px",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.92)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zindex: 10,
    },
    btnEdit: {
      width: "46px",
      height: "46px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      color: "#f59e0b",
      backgroundColor: "#fffbeb",
      fontSize: "1.2rem"
    },
    btnDelete: {
      width: "46px",
      height: "46px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      color: "#ef4444",
      backgroundColor: "#fef2f2",
      fontSize: "1.2rem"
    },
    btnCopy: {
      width: "46px",
      height: "46px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      color: "#198754",
      backgroundColor: "#f0fdf4",
      fontSize: "1.2rem"
    },
    btnPdf: {
      width: "46px",
      height: "46px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      color: "#dc3545",
      backgroundColor: "#fdf2f2",
      fontSize: "1.2rem"
    }
  };

  return (
    <>
      {cargando ? (
        <div className="text-center my-5">
          <h5 className="text-muted fw-normal">Cargando clientes...</h5>
          <Spinner animation="border" variant="primary" role="status" />
        </div>
      ) : (
        <div className="px-1">
          {clientes.map((cliente) => {
            const tarjetaActiva = idTarjetaActiva === cliente.id;

            return (
              <Card
                key={cliente.id}
                style={{
                  ...estilos.card,
                  transform: tarjetaActiva ? "scale(0.98)" : "scale(1)",
                  boxShadow: tarjetaActiva
                    ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
                }}
                className="mb-3 rounded-4 w-100"
                onClick={() => stylesOverlayToggle(cliente.id)}
              >
                <Card.Body className="p-3">
                  <Row className="align-items-center gx-3">
                    <Col xs={3}>
                      <div className="d-flex align-items-center justify-content-center" style={estilos.iconContainer}>
                        <i className="bi bi-person-badge-fill fs-4"></i>
                      </div>
                    </Col>

                    <Col xs={9} className="text-start">
                      <div className="fw-bold text-dark fs-5 text-truncate">
                        {cliente.nombre} {cliente.apellido}
                      </div>
                      <div className="small text-muted text-truncate">
                        <i className="bi bi-telephone me-1"></i>
                        {cliente.telefono || "Sin número registrado"}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>

                {tarjetaActiva && (
                  <div
                    style={estilos.overlay}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIdTarjetaActiva(null);
                    }}
                  >
                    <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {/* Botón de Edición */}
                      <Button
                        style={estilos.btnEdit}
                        className="shadow-sm"
                        onClick={() => {
                          abrirModalEdicion(cliente);
                          setIdTarjetaActiva(null);
                        }}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Button>

                      {/* Botón de Eliminación */}
                      <Button
                        style={estilos.btnDelete}
                        className="shadow-sm"
                        onClick={() => {
                          abrirModalEliminacion(cliente);
                          setIdTarjetaActiva(null);
                        }}
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </Button>

                      {/* Botón de PDF en Móvil */}
                      <Button
                        style={estilos.btnPdf}
                        className="shadow-sm"
                        onClick={() => {
                          generarPDFCliente(cliente);
                          setIdTarjetaActiva(null);
                        }}
                        title="Reporte PDF"
                      >
                        <i className="bi bi-file-earmark-pdf-fill"></i>
                      </Button>

                      {/* Botón de Copiar */}
                      <Button
                        style={estilos.btnCopy}
                        className="shadow-sm"
                        onClick={() => {
                          copiarCliente(cliente);
                          setIdTarjetaActiva(null);
                        }}
                        title="Copiar datos"
                      >
                        <i className="bi bi-clipboard-fill"></i>
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export default TarjetaClientes;