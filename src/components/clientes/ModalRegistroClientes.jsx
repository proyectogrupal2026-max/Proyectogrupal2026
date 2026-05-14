import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroClientes = ({
  mostrarModal,
  setMostrarModal,
  nuevoCliente,
  manejoCambioInput,
  agregarCliente,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  // Valida que solo entren letras y espacios
  const validarSoloLetras = (e) => {
    const { value } = e.target;
    const patron = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (patron.test(value)) {
      manejoCambioInput(e);
    }
  };

  // Formatea el teléfono a 0000-0000 y limita a 8 dígitos + guion
  const formatearTelefono = (e) => {
    let input = e.target.value.replace(/\D/g, ""); // Elimina todo lo que no sea número
    
    if (input.length > 8) {
      input = input.substring(0, 8); // Limita a 8 dígitos
    }

    if (input.length > 4) {
      input = `${input.slice(0, 4)}-${input.slice(4)}`;
    }

    // Creamos un evento sintético para que manejoCambioInput lo procese normalmente
    const eventoSintetico = {
      target: {
        name: "telefono",
        value: input
      }
    };
    manejoCambioInput(eventoSintetico);
  };

  const handleRegistrar = async (e) => {
    if (e) e.preventDefault();
    if (deshabilitado || !nuevoCliente.nombre.trim() || !nuevoCliente.apellido.trim()) return;

    setDeshabilitado(true);
    await agregarCliente();
    setDeshabilitado(false);
  };

  useEffect(() => {
    const detectarEnter = (e) => {
      if (mostrarModal && e.key === "Enter" && !deshabilitado) {
        if (nuevoCliente.nombre.trim() && nuevoCliente.apellido.trim()) {
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
  }, [mostrarModal, deshabilitado, nuevoCliente]);

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
      fontSize: "1.2rem",
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
      padding: "0 15px 25px 25px",
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
            <Modal.Title style={estilos.title}>Agregar Cliente</Modal.Title>
          </Modal.Header>

          <Modal.Body style={estilos.body}>
            <Form.Group className="mb-3">
              <Form.Label style={estilos.label}>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={nuevoCliente.nombre}
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
                value={nuevoCliente.apellido}
                onChange={validarSoloLetras}
                placeholder="Ej. Pérez"
                style={estilos.input}
                className="shadow-sm"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={estilos.label}>Teléfono</Form.Label>
              <Form.Control
                type="text"
                inputMode="numeric" // Forza el teclado numérico en móviles
                name="telefono"
                value={nuevoCliente.telefono}
                onChange={formatearTelefono}
                placeholder="0000-0000"
                style={estilos.input}
                className="shadow-sm"
                maxLength="9" // 8 números + 1 guion
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
              disabled={!nuevoCliente.nombre.trim() || !nuevoCliente.apellido.trim() || deshabilitado}
              style={estilos.btnPrimary}
            >
              {deshabilitado ? "Guardando..." : "Guardar Cliente"}
            </Button>
          </Modal.Footer>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalRegistroClientes;