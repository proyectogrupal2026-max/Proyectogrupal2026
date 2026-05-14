import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionCliente = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  clienteEditar,
  manejoCambioInputEdicion,
  actualizarCliente,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  // Valida que solo entren letras y espacios
  const validarSoloLetras = (e) => {
    const { value } = e.target;
    const patron = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (patron.test(value)) {
      manejoCambioInputEdicion(e);
    }
  };

  // Formatea el teléfono a 0000-0000
  const formatearTelefono = (e) => {
    let input = e.target.value.replace(/\D/g, ""); 
    if (input.length > 8) input = input.substring(0, 8);
    if (input.length > 4) input = `${input.slice(0, 4)}-${input.slice(4)}`;

    const eventoSintetico = {
      target: { name: "telefono", value: input }
    };
    manejoCambioInputEdicion(eventoSintetico);
  };

  const handleActualizar = async (e) => {
    if (e) e.preventDefault();
    // Validación de seguridad antes de disparar la función
    if (deshabilitado || !clienteEditar.nombre?.trim() || !clienteEditar.apellido?.trim()) return;

    setDeshabilitado(true);
    await actualizarCliente();
    setDeshabilitado(false);
  };

  useEffect(() => {
    const detectarEnter = (e) => {
      if (mostrarModalEdicion && e.key === "Enter" && !deshabilitado) {
        if (clienteEditar.nombre?.trim() && clienteEditar.apellido?.trim()) {
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
  }, [mostrarModalEdicion, deshabilitado, clienteEditar]);

  // Resetea el estado de deshabilitado cuando el modal se cierra/abre
  useEffect(() => {
    if (!mostrarModalEdicion) setDeshabilitado(false);
  }, [mostrarModalEdicion]);

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
      padding: "10px 25px 20px 25px",
    },
    label: {
      fontWeight: "700",
      color: "#212529",
      marginBottom: "8px",
      fontSize: "1.1rem",
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
      padding: "10px 25px 25px 25px",
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      justifyContent: "flex-end",
      gap: "12px",
      margin: "0",
    },
    btnPrimary: {
      borderRadius: "10px",
      padding: "12px 25px",
      fontWeight: "700",
      backgroundColor: "#007bff",
      border: "none",
      fontSize: "1.05rem",
      whiteSpace: "nowrap",
      minWidth: "180px", // Espacio suficiente para "Actualizando..."
    },
    btnCancel: {
      borderRadius: "10px",
      padding: "12px 20px",
      fontWeight: "600",
      whiteSpace: "nowrap",
      border: "1px solid #e2e8f0",
      backgroundColor: "#f8fafc",
      color: "#475569",
      fontSize: "1.05rem",
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
            <Modal.Title style={estilos.title}>Editar Cliente</Modal.Title>
          </Modal.Header>

          <Modal.Body style={estilos.body}>
            <Form.Group className="mb-3">
              <Form.Label style={estilos.label}>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={clienteEditar.nombre || ""}
                onChange={validarSoloLetras}
                placeholder="Ej. Juan"
                style={estilos.input}
                className="shadow-sm"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={estilos.label}>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={clienteEditar.apellido || ""}
                onChange={validarSoloLetras}
                placeholder="Ej. Pérez"
                style={estilos.input}
                className="shadow-sm"
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label style={estilos.label}>Teléfono</Form.Label>
              <Form.Control
                type="text"
                inputMode="numeric"
                name="telefono"
                value={clienteEditar.telefono || ""}
                onChange={formatearTelefono}
                placeholder="0000-0000"
                style={estilos.input}
                className="shadow-sm"
                maxLength="9"
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer style={estilos.footer}>
            <Button
              variant="light"
              onClick={() => setMostrarModalEdicion(false)}
              disabled={deshabilitado}
              style={estilos.btnCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!clienteEditar.nombre?.trim() || !clienteEditar.apellido?.trim() || deshabilitado}
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

export default ModalEdicionCliente;