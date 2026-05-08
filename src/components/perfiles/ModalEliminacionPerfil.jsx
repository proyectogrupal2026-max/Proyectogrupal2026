import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionPerfil = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarPerfil,
  perfil,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleEliminar = async () => {
    if (deshabilitado) return;

    setDeshabilitado(true);
    await eliminarPerfil(perfil?.user_id);
    setDeshabilitado(false);
    setMostrarModalEliminacion(false);
  };

  // --- LÓGICA DE TECLA ENTER PARA CONFIRMAR ---
  useEffect(() => {
    const detectarEnter = (e) => {
      if (mostrarModalEliminacion && e.key === "Enter" && !deshabilitado) {
        handleEliminar();
      }
    };

    if (mostrarModalEliminacion) {
      window.addEventListener("keydown", detectarEnter);
    }

    return () => {
      window.removeEventListener("keydown", detectarEnter);
    };
  }, [mostrarModalEliminacion, deshabilitado, perfil]);

  const estilos = {
    modalContent: {
      borderRadius: "15px",
      border: "none",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    },
    header: {
      borderBottom: "none",
      padding: "25px 25px 10px 25px",
    },
    title: {
      fontWeight: "800",
      color: "#1a252f",
      fontSize: "1.5rem",
    },
    body: {
      padding: "10px 25px 25px 25px",
      fontSize: "1.1rem",
    },
    footer: {
      borderTop: "none",
      padding: "0 25px 25px 25px",
      gap: "10px",
    },
    btnDanger: {
      borderRadius: "10px",
      padding: "10px 25px",
      fontWeight: "700",
      backgroundColor: "#ef4444",
      border: "none",
    }
  };

  return (
    <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
      backdrop="static"
      keyboard={true}
      centered
      style={{ backdropFilter: "blur(6px)" }}
    >
      <div style={estilos.modalContent}>
        <Modal.Header closeButton style={estilos.header}>
          <Modal.Title style={estilos.title}>Confirmar Eliminación</Modal.Title>
        </Modal.Header>

        <Modal.Body style={estilos.body}>
          <div className="text-center mb-3">
             <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: "3rem" }}></i>
          </div>
          ¿Estás seguro de que deseas eliminar el perfil de{" "}
          <strong className="text-dark">{perfil?.nombre_completo}</strong>?
          <br />
          <small className="text-muted d-block mt-2">
            Esta acción no se puede deshacer y el usuario perderá el acceso.
          </small>
        </Modal.Body>

        <Modal.Footer style={estilos.footer}>
          <Button
            variant="light"
            onClick={() => setMostrarModalEliminacion(false)}
            disabled={deshabilitado}
            style={{ borderRadius: "10px", padding: "10px 20px", fontWeight: "600" }}
          >
            Cancelar
          </Button>

          <Button
            variant="danger"
            onClick={handleEliminar}
            disabled={deshabilitado}
            style={estilos.btnDanger}
          >
            {deshabilitado ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Eliminando...
              </>
            ) : (
              "Eliminar Perfil"
            )}
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ModalEliminacionPerfil;