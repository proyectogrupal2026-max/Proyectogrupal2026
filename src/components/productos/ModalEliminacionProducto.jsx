import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionProducto = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarProducto,
  producto,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleEliminar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await eliminarProducto();
    setDeshabilitado(false);
  };

  // Manejador para la tecla Enter
  useEffect(() => {
    const manejarTeclaEnter = (e) => {
      if (mostrarModalEliminacion && e.key === "Enter" && !deshabilitado) {
        e.preventDefault();
        handleEliminar();
      }
    };

    window.addEventListener("keydown", manejarTeclaEnter);
    return () => window.removeEventListener("keydown", manejarTeclaEnter);
  }, [mostrarModalEliminacion, deshabilitado]);

  const estilos = {
    modalContent: {
      borderRadius: "20px",
      border: "none",
      boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    },
    header: {
      borderBottom: "none",
      padding: "25px 25px 10px 25px",
    },
    title: {
      fontWeight: "800",
      color: "#1e293b",
      fontSize: "1.3rem",
    },
    iconContainer: {
      width: "60px",
      height: "60px",
      backgroundColor: "#fef2f2",
      color: "#ef4444",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.8rem",
      marginBottom: "15px"
    },
    body: {
      padding: "10px 25px 25px 25px",
      color: "#64748b",
      fontSize: "1.05rem",
      lineHeight: "1.5"
    },
    footer: {
      borderTop: "none",
      padding: "15px 25px 25px 25px",
      display: "flex",
      gap: "10px"
    },
    btnCancel: {
      borderRadius: "12px",
      padding: "10px 20px",
      fontWeight: "600",
      border: "none",
      backgroundColor: "#f1f5f9",
      color: "#475569",
      flex: 1
    },
    btnDelete: {
      borderRadius: "12px",
      padding: "10px 20px",
      fontWeight: "700",
      backgroundColor: "#ef4444",
      border: "none",
      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
      flex: 1
    }
  };

  return (
    <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
      backdrop="static"
      keyboard={false}
      centered
      style={{ backdropFilter: "blur(6px)" }}
    >
      <div style={estilos.modalContent}>
        <Modal.Header closeButton style={estilos.header}>
          <Modal.Title style={estilos.title}>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        
        <Modal.Body style={estilos.body} className="text-center">
          <div className="d-flex justify-content-center">
            <div style={estilos.iconContainer}>
              <i className="bi bi-exclamation-triangle-fill"></i>
            </div>
          </div>
          <p className="mb-0">
            ¿Estás seguro de que deseas eliminar el producto <br />
            <strong className="text-dark">"{producto?.nombre}"</strong>?
          </p>
          <small className="text-muted d-block mt-2">
            Esta acción no se puede deshacer.
          </small>
        </Modal.Body>

        <Modal.Footer style={estilos.footer}>
          <Button 
            variant="secondary" 
            onClick={() => setMostrarModalEliminacion(false)}
            style={estilos.btnCancel}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleEliminar} 
            disabled={deshabilitado}
            style={estilos.btnDelete}
          >
            {deshabilitado ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              "Eliminar ahora"
            )}
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ModalEliminacionProducto;