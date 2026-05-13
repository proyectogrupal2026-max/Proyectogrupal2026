import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroCategoria = ({
  mostrarModal,
  setMostrarModal,
  nuevaCategoria,
  manejoCambioInput,
  agregarCategoria,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const validarSoloLetras = (e) => {
    const { value } = e.target;
    const patron = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (patron.test(value)) {
      manejoCambioInput(e);
    }
  };

  const handleRegistrar = async (e) => {
    if (e) e.preventDefault(); 
    if (deshabilitado || nuevaCategoria.nombre_categoria.trim() === "") return;
    
    setDeshabilitado(true);
    await agregarCategoria();
    setDeshabilitado(false);
  };

  useEffect(() => {
    const detectarEnter = (e) => {
      if (mostrarModal && e.key === "Enter" && !deshabilitado) {
        if (nuevaCategoria.nombre_categoria.trim() !== "") {
          handleRegistrar();
        }
      }
    };

    if (mostrarModal) {
      window.addEventListener("keydown", detectarEnter);
    }

    return () => {
      window.removeEventListener("keydown", detectarEnter);
    };
  }, [mostrarModal, deshabilitado, nuevaCategoria]);

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
      color: "#1a252f",
      fontSize: "1.8rem",
    },
    body: {
      padding: "10px 25px 25px 25px",
    },
    label: {
      fontWeight: "700",
      color: "#212529",
      marginBottom: "12px",
      fontSize: "1.3rem",
      display: "block",
    },
    input: {
      borderRadius: "10px",
      padding: "12px",
      border: "1px solid #dee2e6",
      fontSize: "1.1rem",
    },
    footer: {
      borderTop: "none",
      padding: "0 15px 25px 25px", // Ajustado para pegar a la derecha
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      justifyContent: "flex-end",
      gap: "10px",
      margin: "0",
    },
    btnPrimary: {
      borderRadius: "10px",
      padding: "12px 30px",
      fontWeight: "700",
      backgroundColor: "#007bff",
      border: "none",
      fontSize: "1.1rem",
      whiteSpace: "nowrap",
    },
    btnCancel: {
      borderRadius: "10px", 
      padding: "10px 20px", 
      fontWeight: "600",
      whiteSpace: "nowrap",
      border: "1px solid #e2e8f0",
      backgroundColor: "#f8fafc",
      color: "#475569",
    }
  };

  return (
    <Modal
      show={mostrarModal}
      onHide={() => setMostrarModal(false)}
      backdrop="static"
      keyboard={true}
      centered
      style={{ backdropFilter: "blur(6px)" }}
    >
      <div style={estilos.modalContent}>
        <Form onSubmit={handleRegistrar}>
          <Modal.Header closeButton style={estilos.header}>
            <Modal.Title style={estilos.title}>Agregar Categoría</Modal.Title>
          </Modal.Header>
          
          <Modal.Body style={estilos.body}>
            <Form.Group className="mb-4">
              <Form.Label style={estilos.label}>Nombre de la Categoría</Form.Label>
              <Form.Control
                type="text"
                name="nombre_categoria"
                value={nuevaCategoria.nombre_categoria}
                onChange={validarSoloLetras}
                placeholder="Ej. Herramientas Eléctricas"
                style={estilos.input}
                className="shadow-sm"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label style={estilos.label}>Descripción Detallada</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion_categoria"
                value={nuevaCategoria.descripcion_categoria}
                onChange={manejoCambioInput}
                placeholder="Describe brevemente esta categoría..."
                style={{ ...estilos.input, resize: "none" }}
                className="shadow-sm"
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer style={estilos.footer}>
            <Button 
              variant="light" 
              onClick={() => setMostrarModal(false)}
              style={estilos.btnCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={nuevaCategoria.nombre_categoria.trim() === "" || deshabilitado}
              style={estilos.btnPrimary}
            >
              {deshabilitado ? "Guardando..." : "Guardar Categoría"}
            </Button>
          </Modal.Footer>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalRegistroCategoria;