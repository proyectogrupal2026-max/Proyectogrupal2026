import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalRegistroProveedor = ({
  mostrarModal,
  setMostrarModal,
  nuevoProveedor,
  manejoCambioInput,
  agregarProveedor,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  // Validación para permitir solo letras y espacios
  const validarSoloLetras = (e) => {
    const { value } = e.target;
    const patron = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (patron.test(value)) {
      manejoCambioInput(e);
    }
  };

  // --- VALIDACIÓN PARA TELÉFONO CON FORMATO 0000-0000 ---
  const validarTelefono = (e) => {
    let { value } = e.target;
    
    // Eliminar todo lo que no sea número para procesar la longitud real
    const numeros = value.replace(/\D/g, "");

    if (numeros.length <= 8) {
      // Si tiene más de 4 números, insertamos el guion
      if (numeros.length > 4) {
        value = `${numeros.slice(0, 4)}-${numeros.slice(4)}`;
      } else {
        value = numeros;
      }
      
      // Creamos un evento sintético para pasarlo al manejador original
      const eventoSintetico = {
        target: {
          name: e.target.name,
          value: value
        }
      };
      manejoCambioInput(eventoSintetico);
    }
  };

  const handleRegistrar = async (e) => {
    if (e) e.preventDefault(); 
    if (deshabilitado || !nuevoProveedor.nombre.trim()) return;

    setDeshabilitado(true);
    await agregarProveedor();
    setDeshabilitado(false);
  };

  useEffect(() => {
    const detectarEnter = (e) => {
      if (mostrarModal && e.key === "Enter" && !deshabilitado) {
        if (nuevoProveedor.nombre.trim() !== "") {
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
  }, [mostrarModal, deshabilitado, nuevoProveedor]);

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
            <Modal.Title style={estilos.title}>Agregar Proveedor</Modal.Title>
          </Modal.Header>

          <Modal.Body style={estilos.body}>
            <Form.Group className="mb-4">
              <Form.Label style={estilos.label}>Nombre del Proveedor *</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={nuevoProveedor.nombre}
                onChange={validarSoloLetras}
                placeholder="Ej. Distribuidora Central"
                style={estilos.input}
                className="shadow-sm"
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={estilos.label}>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={nuevoProveedor.telefono}
                onChange={validarTelefono}
                placeholder="Ej. 8888-8888"
                style={estilos.input}
                className="shadow-sm"
              />
              <Form.Text className="text-muted">
                Formato: 0000-0000 (8 números).
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={estilos.label}>Dirección</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="direccion"
                value={nuevoProveedor.direccion}
                onChange={manejoCambioInput}
                placeholder="Ubicación de la distribuidora..."
                style={{ ...estilos.input, resize: "none" }}
                className="shadow-sm"
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer style={estilos.footer}>
            <Button
              variant="light"
              onClick={() => setMostrarModal(false)}
              style={{ borderRadius: "10px", padding: "10px 20px", fontWeight: "600" }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!nuevoProveedor.nombre.trim() || deshabilitado}
              style={estilos.btnPrimary}
            >
              {deshabilitado ? "Guardando..." : "Guardar Proveedor"}
            </Button>
          </Modal.Footer>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalRegistroProveedor;