import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEliminacionCategoria = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarCategoria,
  categoria,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleEliminar = async (e) => {
    if (e) e.preventDefault(); 
    if (deshabilitado) return;
    
    setDeshabilitado(true);
    await eliminarCategoria(categoria?.id);
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
  }, [mostrarModalEliminacion, deshabilitado, categoria]); 

  const estilos = {
    modalContent: {
      borderRadius: "15px",
      border: "none",
      boxShadow: "0 10px 40px rgba(220, 53, 69, 0.15)",
      overflow: "hidden",
    },
    header: {
      borderBottom: "none",
      padding: "25px 25px 10px 25px",
    },
    title: {
      fontWeight: "800",
      color: "#dc3545",
      fontSize: "1.7rem",
    },
    body: {
      padding: "10px 25px 25px 25px",
      fontSize: "1.2rem",
      color: "#495057",
    },
    nombreResaltado: {
      color: "#212529",
      fontWeight: "700",
      backgroundColor: "#fff3f3",
      padding: "2px 8px",
      borderRadius: "6px",
      border: "1px solid #ffe5e5",
    },
    footer: {
      borderTop: "none",
      padding: "0 12px 25px 25px", // Reducido el padding derecho de 15px a 12px para moverlos más a la derecha
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      justifyContent: "flex-end",
      gap: "12px",
      margin: "0 -5px 0 0", // Margen negativo sutil a la derecha para el empuje final
    },
    btnDanger: {
      borderRadius: "10px",
      padding: "12px 30px",
      fontWeight: "700",
      backgroundColor: "#dc3545",
      border: "none",
      fontSize: "1.1rem",
      boxShadow: "0 4px 12px rgba(220, 53, 69, 0.2)",
      whiteSpace: "nowrap",
    },
    btnSecondary: {
      borderRadius: "10px",
      padding: "12px 25px",
      fontWeight: "600",
      backgroundColor: "#f8f9fa",
      color: "#6c757d",
      border: "1px solid #dee2e6",
      fontSize: "1.1rem",
      whiteSpace: "nowrap",
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
        <Form onSubmit={handleEliminar}>
          <Modal.Header closeButton style={estilos.header}>
            <Modal.Title style={estilos.title}>Confirmar Eliminación</Modal.Title>
          </Modal.Header>

          <Modal.Body style={estilos.body}>
            ¿Estás seguro de que deseas eliminar la categoría{" "}
            <span style={estilos.nombreResaltado}>
              "{categoria?.nombre_categoria}"
            </span>?
            <br />
            <div style={{ marginTop: "15px", fontSize: "1rem", color: "#6c757d" }}>
              Esta acción no se puede deshacer.
            </div>
          </Modal.Body>

          <Modal.Footer style={estilos.footer}>
            <Button 
              variant="light" 
              onClick={() => setMostrarModalEliminacion(false)}
              disabled={deshabilitado}
              style={estilos.btnSecondary}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="danger" 
              disabled={deshabilitado}
              style={estilos.btnDanger}
            >
              {deshabilitado ? "Eliminando..." : "Eliminar Categoría"}
            </Button>
          </Modal.Footer>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalEliminacionCategoria;