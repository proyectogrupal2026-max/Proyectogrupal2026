import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert, Row, Col, Badge } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalEdicionPermisos = ({
  mostrarModal,
  setMostrarModal,
  rolData,
  cargarPermisos
}) => {
  const [permisosEditados, setPermisosEditados] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [errorLocal, setErrorLocal] = useState("");

  // Sincroniza el estado local cuando se abre el rol a editar
  useEffect(() => {
    if (rolData && rolData.permisos) {
      setPermisosEditados(rolData.permisos);
    } else {
      setPermisosEditados({});
    }
    setErrorLocal("");
  }, [rolData]);

  // Modifica dinámicamente el estado del permiso cambiado
  const manejarCheckChange = (permisoKey, valor) => {
    setPermisosEditados((prev) => ({
      ...prev,
      [permisoKey]: valor,
    }));
  };

  // Guarda el objeto de vuelta en la base de datos
  const handleGuardar = async (e) => {
    if (e) e.preventDefault();
    setErrorLocal("");
    setGuardando(true);

    try {
      const { error } = await supabase
        .from("permisos")
        .update({ permisos: permisosEditados })
        .eq("rol", rolData.rol);

      if (error) throw error;

      // Avisa al componente padre para que actualice la vista principal
      if (typeof cargarPermisos === "function") {
        await cargarPermisos();
      }

      setMostrarModal(false);
    } catch (err) {
      console.error("Error al actualizar permisos en Supabase:", err);
      setErrorLocal(err.message || "No se pudieron guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Modal 
      show={mostrarModal} 
      onHide={() => setMostrarModal(false)} 
      centered 
      backdrop="static" 
      size="lg" // Más ancho para aprovechar el espacio horizontal
    >
      <Form onSubmit={handleGuardar}>
        {/* Header compacto de baja altura */}
        <Modal.Header closeButton className="bg-light border-bottom px-4 py-2.5">
          <Modal.Title className="fw-bold text-dark d-flex align-items-center fs-5">
            <i className="bi bi-shield-fill-check text-primary me-2"></i>
            Configurar Accesos: 
            <Badge bg="primary" className="ms-2 px-3 py-1.5 rounded shadow-sm" style={{ fontSize: "0.85rem" }}>
              {rolData?.rol}
            </Badge>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="px-4 py-3">
          {errorLocal && (
            <Alert variant="danger" className="py-2 small fw-semibold shadow-sm mb-2">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>{errorLocal}
            </Alert>
          )}
          
          {/* Panel informativo horizontalizado y ultra compacto para no empujar hacia abajo */}
          <div className="p-2 bg-light rounded-3 mb-3 border d-flex align-items-center gap-2">
            <span className="fw-bold text-dark small text-nowrap" style={{ fontSize: "0.85rem" }}>
              <i className="bi bi-info-circle-fill text-primary me-1"></i> Visibilidad de Módulos:
            </span>
            <span className="text-muted small" style={{ fontSize: "0.82rem" }}>
              Active o desactive las secciones visibles en el menú de este perfil.
            </span>
          </div>
          
          {/* Rejilla de interruptores con espaciado vertical optimizado (py-1) */}
          <Row className="px-1">
            {Object.keys(permisosEditados || {}).map((key) => (
              <Col sm={6} key={key} className="mb-2 py-1 border-bottom border-light-subtle">
                <Form.Check
                  type="switch"
                  id={`switch-real-${key}`}
                  label={
                    <span className="fw-bold text-secondary-emphasis ms-1" style={{ fontSize: '0.85rem', letterSpacing: '0.2px' }}>
                      {key.replace(/_/g, " ").toUpperCase()}
                    </span>
                  }
                  name={key}
                  checked={!!permisosEditados[key]}
                  onChange={(e) => manejarCheckChange(key, e.target.checked)}
                  disabled={guardando}
                  className="fs-5 custom-switch-marcado" 
                />
              </Col>
            ))}
          </Row>

          {/* Validación por si el JSON viene vacío */}
          {Object.keys(permisosEditados || {}).length === 0 && (
            <div className="text-center text-muted p-3 border border-dashed rounded bg-light my-1 small">
              No hay permisos registrados en este rol.
            </div>
          )}
        </Modal.Body>

        {/* Footer clásico ajustado */}
        <Modal.Footer className="bg-light border-top px-4 py-2.5">
          <Button 
            variant="outline-secondary" 
            onClick={() => setMostrarModal(false)} 
            disabled={guardando} 
            className="fw-bold px-4"
            size="sm"
          >
            Cancelar
          </Button>
          <Button 
            variant="success" 
            type="submit" 
            disabled={guardando} 
            className="fw-bold px-4 shadow-sm"
            size="sm"
          >
            {guardando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              <>
                <i className="bi bi-cloud-arrow-up-fill me-1.5"></i> Guardar Cambios
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalEdicionPermisos;