import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const ModalEdicionProveedor = ({
  mostrarModalEdicion,
  setMostrarModalEdicion,
  proveedorEditar,
  manejoCambioInputEdicion,
  actualizarProveedor,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  useEffect(() => {
    if (!mostrarModalEdicion) {
      setDeshabilitado(false);
    }
  }, [mostrarModalEdicion]);

  // --- VALIDACIÓN: SOLO LETRAS ---
  const validarSoloLetras = (e) => {
    const { value } = e.target;
    const patron = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (patron.test(value)) {
      manejoCambioInputEdicion(e);
    }
  };

  // --- VALIDACIÓN: TELÉFONO CON FORMATO 0000-0000 ---
  const validarTelefono = (e) => {
    let { value } = e.target;
    const numeros = value.replace(/\D/g, "");

    if (numeros.length <= 8) {
      if (numeros.length > 4) {
        value = `${numeros.slice(0, 4)}-${numeros.slice(4)}`;
      } else {
        value = numeros;
      }
      
      const eventoSintetico = {
        target: {
          name: e.target.name,
          value: value
        }
      };
      manejoCambioInputEdicion(eventoSintetico);
    }
  };

  const handleActualizar = async (e) => {
    if (e) e.preventDefault();
    if (deshabilitado) return;
    if (!proveedorEditar.nombre?.trim()) return;

    setDeshabilitado(true);
    await actualizarProveedor();
    setDeshabilitado(false);
  };

  // --- LÓGICA DE TECLA ENTER ---
  useEffect(() => {
    const detectarEnter = (e) => {
      if (mostrarModalEdicion && e.key === "Enter" && !deshabilitado) {
        if (proveedorEditar.nombre?.trim()) {
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
  }, [mostrarModalEdicion, deshabilitado, proveedorEditar]);

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
            <Modal.Title style={estilos.title}>Editar Proveedor</Modal.Title>
          </Modal.Header>

          <Modal.Body style={estilos.body}>
            <Form.Group className="mb-4">
              <Form.Label style={estilos.label}>Nombre *</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={proveedorEditar.nombre || ""}
                onChange={validarSoloLetras}
                placeholder="Ingresa el nombre del proveedor"
                style={estilos.input}
                className="shadow-sm"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={estilos.label}>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={proveedorEditar.telefono || ""}
                onChange={validarTelefono}
                placeholder="0000-0000"
                style={estilos.input}
                className="shadow-sm"
              />
              <Form.Text className="text-muted">Formato automático: 8 números.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={estilos.label}>Dirección</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="direccion"
                value={proveedorEditar.direccion || ""}
                onChange={manejoCambioInputEdicion}
                placeholder="Ingresa la dirección"
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
              disabled={!proveedorEditar.nombre?.trim() || deshabilitado}
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

export default ModalEdicionProveedor;