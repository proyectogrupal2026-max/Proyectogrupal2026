import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionProveedor = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarProveedor,
  proveedor,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleEliminar = async () => {
    if (deshabilitado) return;

    setDeshabilitado(true);
    await eliminarProveedor(proveedor?.id);
    setDeshabilitado(false);
    setMostrarModalEliminacion(false);
  };

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
  }, [mostrarModalEliminacion, deshabilitado, proveedor]);

  const estilos = {
    modalContent: {
      borderRadius: "15px",
      border: "none",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },
    header: {
      borderBottom: "none",
      padding: "25px 25px 10px 25px",
    },
    title: {
      fontWeight: "800",
      color: "#dc3545",
      fontSize: "1.8rem",
    },
    body: {
      padding: "10px 25px 25px 25px",
      fontSize: "1.2rem",
      color: "#4a5568",
    },
    footer: {
      borderTop: "none",
      padding: "0 15px 25px 15px", // Reducido el padding lateral para pegar los botones más a la derecha
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      justifyContent: "flex-end", // Alineación total a la derecha
      gap: "10px",
      margin: "0",
    },
    btnDanger: {
      borderRadius: "10px",
      padding: "12px 25px",
      fontWeight: "700",
      fontSize: "1rem",
      boxShadow: "0 4px 6px rgba(220, 53, 69, 0.2)",
      whiteSpace: "nowrap",
    },
    btnCancel: {
      borderRadius: "10px",
      padding: "12px 20px",
      fontWeight: "600",
      fontSize: "1rem",
      whiteSpace: "nowrap",
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      color: "#475569",
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
          <Modal.Title style={estilos.title}>¿Eliminar Proveedor?</Modal.Title>
        </Modal.Header>

        <Modal.Body style={estilos.body}>
          ¿Estás seguro de que deseas eliminar al proveedor{" "}
          <strong className="text-dark">"{proveedor?.nombre}"</strong>?
          <div className="mt-2">
            <small className="text-muted" style={{ fontSize: "0.95rem" }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Esta acción no se puede deshacer.
            </small>
          </div>
        </Modal.Body>

        <Modal.Footer style={estilos.footer}>
          <Button
            variant="light"
            onClick={() => setMostrarModalEliminacion(false)}
            disabled={deshabilitado}
            style={estilos.btnCancel}
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
              "Confirmar Eliminación"
            )}
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default ModalEliminacionProveedor;