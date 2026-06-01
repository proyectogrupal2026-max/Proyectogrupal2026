import React from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";

const FormularioLogin = ({
  usuario,
  contrasena,
  error,
  setUsuario,
  setContrasena,
  iniciarSesion,
  cargando
}) => {
  const alEnviarFormulario = (e) => {
    e.preventDefault();
    iniciarSesion(e);
  };

  return (
    <Card style={{ minWidth: "320px", maxWidth: "400px", width: "100%" }} className="p-4 shadow-lg border-0 rounded-3">
      <Card.Body>
        <h3 className="text-center mb-4 fw-bold">Iniciar Sesión</h3>
        
        {error && <Alert variant="danger" className="text-center small py-2">{error}</Alert>}

        <Form onSubmit={alEnviarFormulario}>
          <Form.Group className="mb-3" controlId="usuario">
            <Form.Label className="small fw-semibold text-muted">Usuario (Email)</Form.Label>
            <Form.Control
              type="email"
              placeholder="ejemplo@correo.com"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              disabled={cargando}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="contrasena">
            <Form.Label className="small fw-semibold text-muted">Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              disabled={cargando}
              required
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit"
            className="w-100 py-2 fw-bold" 
            disabled={cargando}
          >
            Iniciar Sesión
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FormularioLogin;