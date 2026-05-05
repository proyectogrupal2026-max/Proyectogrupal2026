import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCategoria = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  categoriaEditar,
  manejoCambioInputEdicion,
  actualizarCategoria,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  // Validación para permitir solo letras y espacios
  const validarSoloLetras = (e) => {
    const { value } = e.target;
    const patron = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (patron.test(value)) {
      manejoCambioInputEdicion(e);
    }
  };

  const handleActualizar = async (e) => {
    if (e) e.preventDefault(); // Evita recarga si viene del form
    if (deshabilitado) return;
    if (!categoriaEditar.nombre_categoria?.trim()) return;

    setDeshabilitado(true);
    await actualizarCategoria();
    setDeshabilitado(false);
  };

  // --- LÓGICA PARA DETECTAR ENTER EN TODO EL MODAL ---
  useEffect(() => {
    const detectarEnter = (e) => {
      if (mostrarModalEdicion && e.key === "Enter" && !deshabilitado) {
        // Solo ejecuta si el nombre no está vacío
        if (categoriaEditar.nombre_categoria?.trim()) {
          handleActualizar();
        }
      }
    };

    if (mostrarModalEdicion) {
      window.addEventListener("keydown", detectarEnter);
    }

    return () => {
      window.removeEventListener("keydown", detectarEnter);
    };
  }, [mostrarModalEdicion, deshabilitado, categoriaEditar]);

  // Resetear estado deshabilitado al cerrar
  useEffect(() => {
    if (!mostrarModalEdicion) {
      setDeshabilitado(false);
    }
  }, [mostrarModalEdicion]);

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
      padding: "0 25px 25px 25px",
      gap: "10px",
    },
    btnPrimary: {
      borderRadius: "10px",
      padding: "12px 30px",
      fontWeight: "700",
      backgroundColor: "#007bff",
      border: "none",
      fontSize: "1.1rem",
    }
  };

  return (
    <Modal
      show={mostrarModalEdicion}
      onHide={() => setMostrarModalEdicion(false)}
      backdrop="static"
      keyboard={true}
      centered
      style={{ backdropFilter: "blur(6px)" }}
    >
      <div style={estilos.modalContent}>
        <Form onSubmit={handleActualizar}>
          <Modal.Header closeButton style={estilos.header}>
            <Modal.Title style={estilos.title}>Editar Categoría</Modal.Title>
          </Modal.Header>

          <Modal.Body style={estilos.body}>
            <Form.Group className="mb-4">
              <Form.Label style={estilos.label}>Nombre de la Categoría</Form.Label>
              <Form.Control
                type="text"
                name="nombre_categoria"
                value={categoriaEditar.nombre_categoria || ""}
                onChange={validarSoloLetras}
                placeholder="Ej: Electrónicos"
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
                value={categoriaEditar.descripcion_categoria || ""}
                onChange={manejoCambioInputEdicion}
                placeholder="Descripción opcional de la categoría..."
                style={{ ...estilos.input, resize: "none" }}
                className="shadow-sm"
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer style={estilos.footer}>
            <Button
              variant="light"
              onClick={() => setMostrarModalEdicion(false)}
              disabled={deshabilitado}
              style={{ borderRadius: "10px", padding: "10px 20px", fontWeight: "600" }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!categoriaEditar.nombre_categoria?.trim() || deshabilitado}
              style={estilos.btnPrimary}
            >
              {deshabilitado ? "Actualizando..." : "Guardar Cambios"}
            </Button>
          </Modal.Footer>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalEdicionCategoria;