import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaProveedor = ({
  proveedores,
  abrirModalEdicion,
  abrirModalEliminacion,
  generarPDFProveedor // <--- Recibimos la función de exportación
}) => {
  const [cargando, setCargando] = useState(true);
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  useEffect(() => {
    setCargando(!(proveedores && proveedores.length > 0));
  }, [proveedores]);

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

  const alternarTarjetaActiva = (id) => {
    setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
  };

  const estilos = {
    card: {
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      border: "1px solid #edf2f7",
    },
    iconContainer: {
      width: "45px",
      height: "45px",
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
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    },
    btnAccion: {
      width: "46px",
      height: "46px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      fontSize: "1.1rem"
    },
    btnEdit: {
      color: "#f59e0b",
      backgroundColor: "#fffbeb",
    },
    btnDelete: {
      color: "#ef4444",
      backgroundColor: "#fef2f2",
    },
    btnPDF: {
      color: "#dc3545",
      backgroundColor: "#fdf2f2",
    }
  };

  return (
    <>
      {cargando ? (
        <div className="text-center my-5">
          <h5 className="text-muted fw-normal">Cargando proveedores...</h5>
          <Spinner animation="border" variant="primary" role="status" />
        </div>
      ) : (
        <div className="px-1">
          {proveedores.map((proveedor) => {
            const tarjetaActiva = idTarjetaActiva === proveedor.id;

            return (
              <Card
                key={proveedor.id}
                style={{
                  ...estilos.card,
                  transform: tarjetaActiva ? "scale(0.98)" : "scale(1)",
                  boxShadow: tarjetaActiva
                    ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
                }}
                className="mb-3 rounded-4 w-100"
                onClick={() => alternarTarjetaActiva(proveedor.id)}
                tabIndex={0}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    alternarTarjetaActiva(proveedor.id);
                  }
                }}
                aria-label={`Proveedor ${proveedor.nombre}`}
              >
                <Card.Body className="p-3">
                  <Row className="align-items-center gx-3">
                    <Col xs={3}>
                      <div className="d-flex align-items-center justify-content-center" style={estilos.iconContainer}>
                        <i className="bi bi-truck fs-4"></i>
                      </div>
                    </Col>

                    <Col xs={9} className="text-start">
                      <div className="fw-bold text-dark fs-5 text-truncate">
                        {proveedor.nombre}
                      </div>
                      <div className="small text-muted text-truncate">
                        <i className="bi bi-telephone me-1"></i>
                        {proveedor.telefono || "Sin teléfono"}
                      </div>
                      <div className="small text-muted text-truncate mt-1">
                        <i className="bi bi-geo-alt me-1"></i>
                        {proveedor.direccion || "Sin dirección"}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>

                {tarjetaActiva && (
                  <div
                    role="dialog"
                    aria-modal="true"
                    style={estilos.overlay}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIdTarjetaActiva(null);
                    }}
                  >
                    <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {/* Editar */}
                      <Button
                        style={{ ...estilos.btnAccion, ...estilos.btnEdit }}
                        onClick={() => {
                          abrirModalEdicion(proveedor);
                          setIdTarjetaActiva(null);
                        }}
                        aria-label={`Editar ${proveedor.nombre}`}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Button>

                      {/* Eliminar */}
                      <Button
                        style={{ ...estilos.btnAccion, ...estilos.btnDelete }}
                        onClick={() => {
                          abrirModalEliminacion(proveedor);
                          setIdTarjetaActiva(null);
                        }}
                        aria-label={`Eliminar ${proveedor.nombre}`}
                      >
                        <i className="bi bi-trash3-fill"></i>
                      </Button>


                      {/* Exportar PDF */}
                      <Button
                        style={{ ...estilos.btnAccion, ...estilos.btnPDF }}
                        onClick={() => {
                          generarPDFProveedor(proveedor);
                          setIdTarjetaActiva(null);
                        }}
                        aria-label={`Exportar PDF de ${proveedor.nombre}`}
                      >
                        <i className="bi bi-file-earmark-pdf-fill"></i>
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

export default TarjetaProveedor;