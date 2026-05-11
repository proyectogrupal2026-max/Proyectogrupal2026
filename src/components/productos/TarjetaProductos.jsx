import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button, Image } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaProducto = ({
  productos,
  abrirModalEdicion,
  abrirModalEliminacion
}) => {
  const [cargando, setCargando] = useState(true);
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  useEffect(() => {
    setCargando(!(productos));
  }, [productos]);

  const manejarTeclaEscape = useCallback((evento) => {
    if (evento.key === "Escape") setIdTarjetaActiva(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => window.removeEventListener("keydown", manejarTeclaEscape);
  }, [manejarTeclaEscape]);

  const alternarTarjetaActiva = (id) => {
    setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
  };

  const estilos = {
    tarjeta: {
      borderRadius: "16px",
      transition: "all 0.3s ease",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      border: "1px solid #f1f5f9"
    },
    cuerpoActivo: {
      backgroundColor: "#f8fafc",
      transform: "scale(0.98)"
    },
    cuerpoInactivo: {
      backgroundColor: "#ffffff"
    },
    capaAcciones: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
      borderRadius: "16px"
    },
    btnRound: {
      width: "45px",
      height: "45px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.2rem",
      border: "none",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    },
    precioTag: {
      fontSize: "1.1rem",
      fontWeight: "800",
      color: "#3b82f6"
    }
  };

  return (
    <>
      {cargando ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" role="status" />
          <h5 className="mt-3 text-muted fw-normal">Cargando productos...</h5>
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center my-5">
          <i className="bi bi-search text-muted opacity-25" style={{ fontSize: "3rem" }}></i>
          <h5 className="mt-3 text-muted fw-normal">No se encontraron productos.</h5>
        </div>
      ) : (
        <div className="px-1">
          {productos.map((producto) => {
            const tarjetaActiva = idTarjetaActiva === producto.id;

            return (
              <Card
                key={producto.id}
                className="mb-3 shadow-sm w-100"
                style={{ 
                  ...estilos.tarjeta,
                  ...(tarjetaActiva ? estilos.cuerpoActivo : estilos.cuerpoInactivo)
                }}
                onClick={() => alternarTarjetaActiva(producto.id)}
                tabIndex={0}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    alternarTarjetaActiva(producto.id);
                  }
                }}
                aria-label={`Producto ${producto.nombre}`}
              >
                <Card.Body className="p-2">
                  <Row className="align-items-center gx-3">
                    <Col xs={3} sm={2} className="px-2">
                      <Image
                        src={producto.url_imagen}
                        alt={producto.nombre}
                        rounded
                        className="w-100"
                        style={{ 
                          aspectRatio: "1/1", 
                          objectFit: "cover",
                          borderRadius: "12px" 
                        }}
                      />
                    </Col>

                    <Col xs={5} sm={6} className="text-start">
                      <div className="fw-bold text-dark text-truncate" style={{ fontSize: "1rem" }}>
                        {producto.nombre}
                      </div>
                      <div className="small text-muted text-truncate">
                        {producto.categorias?.nombre_categoria || "Sin categoría"}
                      </div>
                      <div className="small mt-1">
                        <span className={`badge rounded-pill ${producto.stock <= 5 ? "bg-danger" : "bg-light text-dark border"}`}>
                          Stock: {producto.stock}
                        </span>
                      </div>
                    </Col>

                    <Col xs={4} className="d-flex flex-column align-items-end justify-content-center text-end pe-3">
                      <div style={estilos.precioTag}>
                        ${parseFloat(producto.precio_venta).toFixed(2)}
                      </div>
                    </Col>
                  </Row>
                </Card.Body>

                {tarjetaActiva && (
                  <div
                    role="dialog"
                    aria-modal="true"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIdTarjetaActiva(null);
                    }}
                    style={estilos.capaAcciones}
                  >
                    <div
                      className="d-flex gap-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="warning"
                        style={{ ...estilos.btnRound, backgroundColor: "#fffbeb", color: "#f59e0b" }}
                        onClick={() => {
                          abrirModalEdicion(producto);
                          setIdTarjetaActiva(null);
                        }}
                        aria-label={`Editar ${producto.nombre}`}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </Button>

                      <Button
                        variant="danger"
                        style={{ ...estilos.btnRound, backgroundColor: "#fef2f2", color: "#ef4444" }}
                        onClick={() => {
                          abrirModalEliminacion(producto);
                          setIdTarjetaActiva(null);
                        }}
                        aria-label={`Eliminar ${producto.nombre}`}
                      >
                        <i className="bi bi-trash3-fill"></i>
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

export default TarjetaProducto;