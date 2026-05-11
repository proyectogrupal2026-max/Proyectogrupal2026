import React, { useState } from "react";
import { Card, Badge, Modal, Button, Stack } from "react-bootstrap";

const TarjetaCatalogo = ({ producto, categoriaNombre }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const nombre = producto.nombre || "Producto sin nombre";
  const stock = producto.stock || 0;
  const precio = producto.precio_venta || 0;
  const nombreCat = categoriaNombre || "General";

  // Estilos dinámicos para la tarjeta
  const cardStyle = {
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
    borderRadius: "1.25rem",
    border: isHovered ? "1px solid #0d6efd" : "1px solid #f1f1f1",
    transform: isHovered ? "translateY(-8px)" : "translateY(0)",
    boxShadow: isHovered 
      ? "0 15px 30px rgba(0,0,0,0.12)" 
      : "0 4px 12px rgba(0,0,0,0.05)",
  };

  return (
    <>
      <Card
        className="h-100 bg-white overflow-hidden position-relative"
        style={cardStyle}
        onClick={() => setMostrarModal(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badge de Stock - CORREGIDO: Muestra el stock exacto */}
        <div className="position-absolute top-0 start-0 m-3" style={{ zIndex: 2 }}>
          <Badge 
            pill 
            bg={stock > 0 ? "success" : "danger"} 
            className="px-3 py-2 shadow-sm fw-bold"
            style={{ opacity: 0.9, fontSize: '0.75rem' }}
          >
            {stock > 0 ? `STOCK: ${stock}` : "AGOTADO"}
          </Badge>
        </div>

        {/* Contenedor de Imagen con Overlay */}
        <div 
          className="d-flex align-items-center justify-content-center bg-light" 
          style={{ height: "200px", overflow: 'hidden' }}
        >
          {producto.url_imagen ? (
            <Card.Img
              variant="top"
              src={producto.url_imagen}
              style={{ 
                objectFit: "cover", 
                height: "100%", 
                transition: "transform 0.5s ease",
                transform: isHovered ? "scale(1.1)" : "scale(1)"
              }}
            />
          ) : (
            <div className="text-center text-secondary opacity-50">
                <i className="bi bi-tools" style={{ fontSize: "3.5rem" }}></i>
            </div>
          )}
        </div>

        <Card.Body className="d-flex flex-column p-4">
          <Stack direction="horizontal" className="mb-2">
            <span className="text-primary fw-bold small text-uppercase ls-wide" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>
              {nombreCat}
            </span>
            <span className="ms-auto text-muted small">ID: #{producto.id}</span>
          </Stack>

          <Card.Title className="h5 fw-bold text-dark mb-3">
            {nombre}
          </Card.Title>

          <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
            <div>
              <p className="text-muted small mb-0">Precio Unitario</p>
              <h4 className="text-dark fw-bolder mb-0">
                <small className="fs-6">C$</small> {parseFloat(precio).toLocaleString('es-NI', { minimumFractionDigits: 2 })}
              </h4>
            </div>
            <div className={`btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm ${isHovered ? 'bg-primary' : 'bg-dark border-dark'}`} style={{ width: '40px', height: '40px', transition: '0.3s' }}>
                <i className="bi bi-arrow-right text-white"></i>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Modal Elegante */}
      <Modal 
        show={mostrarModal} 
        onHide={() => setMostrarModal(false)} 
        centered 
        contentClassName="border-0 shadow-lg rounded-4"
      >
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <Modal.Title className="fw-bold">Detalle del Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="text-center mb-4 p-4 bg-light rounded-4">
               <i className="bi bi-box-seam text-primary" style={{ fontSize: "4.5rem" }}></i>
               <h3 className="fw-bold mt-3 text-dark">{nombre}</h3>
               <Badge bg="secondary" pill className="px-3">{nombreCat}</Badge>
          </div>
          
          <div className="row g-3">
            <div className="col-6">
              <div className="p-3 border rounded-4 text-center bg-white">
                <p className="text-muted small mb-1 uppercase fw-bold">Stock Disponible</p>
                <h5 className={`mb-0 ${stock > 0 ? 'text-success' : 'text-danger'}`}>
                  {stock} <small>unidades</small>
                </h5>
              </div>
            </div>
            <div className="col-6">
              <div className="p-3 border rounded-4 text-center bg-white">
                <p className="text-muted small mb-1 uppercase fw-bold">Precio de Venta</p>
                <h5 className="mb-0 text-primary">C$ {parseFloat(precio).toFixed(2)}</h5>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 px-4 pb-4">
          <Button variant="dark" className="w-100 py-2 rounded-3 fw-bold" onClick={() => setMostrarModal(false)}>
            Regresar al Catálogo
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TarjetaCatalogo;