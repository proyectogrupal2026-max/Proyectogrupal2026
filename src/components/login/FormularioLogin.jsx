import React, { useState } from "react";
import { Form, Button, Card, Alert, InputGroup } from "react-bootstrap";

const FormularioLogin = ({ 
  usuario, 
  contraseña, 
  error, 
  setUsuario, 
  setContraseña, 
  iniciarSesión 
}) => {
  const [verPassword, setVerPassword] = useState(false);

  // Esta función captura el "Enter" y el clic en el botón
  const manejarEnvio = (e) => {
    e.preventDefault(); // IMPORTANTE: Evita que la página se refresque
    iniciarSesión();    // Ejecuta la lógica de Supabase
  };

  return (
    <Card 
      style={{ 
        width: "420px", 
        maxWidth: "100%", 
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        borderRadius: "12px",
        border: "none"
      }}
    >
      <Card.Body className="p-4">
        <div className="text-center mb-4">
          <i className="bi bi-person-circle text-primary" style={{ fontSize: "3rem" }}></i>
          <h3 className="mt-2 fw-bold text-dark">Iniciar Sesión</h3>
        </div>
        
        {error && (
          <Alert variant="danger" className="py-2 text-center" style={{ fontSize: '0.85rem' }}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}

        {/* El evento onSubmit aquí permite que funcione el Enter */}
        <Form onSubmit={manejarEnvio}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Correo electrónico</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <i className="bi bi-envelope text-muted"></i>
              </InputGroup.Text>
              <Form.Control
                className="bg-light border-start-0"
                type="email"
                placeholder="nombre@correo.com"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold">Contraseña</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <i className="bi bi-lock text-muted"></i>
              </InputGroup.Text>
              <Form.Control
                className="bg-light border-start-0 border-end-0"
                type={verPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
              <Button 
                variant="outline-light"
                className="bg-light border-start-0 text-muted border"
                onClick={() => setVerPassword(!verPassword)}
                style={{ borderColor: "#dee2e6" }}
              >
                <i className={`bi ${verPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </Button>
            </InputGroup>
          </Form.Group>

          {/* El botón DEBE ser type="submit" */}
          <Button 
            variant="primary" 
            type="submit"
            className="w-100 py-2 fw-bold shadow-sm"
            style={{ borderRadius: "8px" }}
          >
            Entrar <i className="bi bi-box-arrow-in-right ms-2"></i>
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FormularioLogin;