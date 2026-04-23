import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionCategoria = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarCategoria,
  categoria,
}) => {
  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleEliminar = async () => {
    if (deshabilitado) return;
    
    setDeshabilitado(true);
    await eliminarCategoria(categoria?.id);
    setDeshabilitado(false);
    setMostrarModalEliminacion(false); // Cerrar modal después de eliminar
  };

  return (
    <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        ¿Estás seguro de que deseas eliminar la categoría{" "}
        <strong>"{categoria?.nombre_categoria}"</strong>?
        <br />
        <small className="text-muted">
          Esta acción no se puede deshacer.
        </small>
      </Modal.Body>

      <Modal.Footer>
        <Button 
          variant="secondary" 
          onClick={() => setMostrarModalEliminacion(false)}
          disabled={deshabilitado}
        >
          Cancelar
        </Button>
        <Button 
          variant="danger" 
          onClick={handleEliminar}
          disabled={deshabilitado}
        >
          {deshabilitado ? "Eliminando..." : "Eliminar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionCategoria;