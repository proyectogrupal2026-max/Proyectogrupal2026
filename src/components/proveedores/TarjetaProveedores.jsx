import React, { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TarjetaProveedor = ({
  proveedores,
  abrirModalEdicion,
  abrirModalEliminacion,
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

  return (
    <>
      {cargando ? (
        <div className="text-center my-5">
          <h5>Cargando proveedores...</h5>
          <Spinner animation="border" variant="success" role="status" />
        </div>
      ) : (
        <div>
          {proveedores.map((proveedor) => {
            const tarjetaActiva = idTarjetaActiva === proveedor.id;

            return (
              <Card
                key={proveedor.id}
                className="mb-3 border-0 rounded-3 shadow-sm w-100 tarjeta-categoria-contenedor"
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
                <Card.Body
                  className={`p-2 tarjeta-categoria-cuerpo ${
                    tarjetaActiva
                      ? "tarjeta-categoria-cuerpo-activo"
                      : "tarjeta-categoria-cuerpo-inactivo"
                  }`}
                >
                  <Row className="align-items-center gx-3">
                    <Col xs={2} className="px-2">
                      <div className="bg-light d-flex align-items-center justify-content-center rounded tarjeta-categoria-placeholder-imagen">
                        <i className="bi bi-truck text-muted fs-3"></i>
                      </div>
                    </Col>

                    <Col xs={6} className="text-start">
                      <div className="fw-semibold text-truncate">
                        {proveedor.nombre}
                      </div>

                      <div className="small text-muted text-truncate">
                        {proveedor.telefono || "Sin teléfono"}
                      </div>
                    </Col>

                    <Col
                      xs={4}
                      className="d-flex flex-column align-items-end justify-content-center text-end"
                    >
                      <div className="small text-muted text-truncate">
                        {proveedor.direccion || "Sin dirección"}
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
                    className="tarjeta-categoria-capa"
                  >
                    <div
                      className="d-flex gap-2 tarjeta-categoria-botones-capa"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => {
                          abrirModalEdicion(proveedor);
                          setIdTarjetaActiva(null);
                        }}
                        aria-label={`Editar ${proveedor.nombre}`}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          abrirModalEliminacion(proveedor);
                          setIdTarjetaActiva(null);
                        }}
                        aria-label={`Eliminar ${proveedor.nombre}`}
                      >
                        <i className="bi bi-trash"></i>
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