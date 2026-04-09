// ================================================
// 1. Componente: FormularioLogin.jsx
// (Crea este archivo en: src/components/FormularioLogin.jsx)
// ================================================

import React from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";

const FormularioLogin = ({ 
  usuario, 
  contraseña, 
  error, 
  setUsuario, 
  setContraseña, 
  iniciarSesión 
}) => {
  return (
    <Card 
      style={{ 
        width: "420px", 
        maxWidth: "100%", 
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)" 
      }}
    >
      <Card.Body className="p-4">
        <h3 className="text-center mb-4 text-primary">Iniciar Sesión</h3>
        
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        <Form>
          {/* Campo Usuario (Correo) */}
          <Form.Group className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingrese su correo"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </Form.Group>

          {/* Campo Contraseña */}
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese su contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
          </Form.Group>

          {/* Botón Iniciar Sesión */}
          <Button 
            variant="primary" 
            className="w-100 mt-3 py-2 fw-bold"
            onClick={iniciarSesión}
          >
            Iniciar Sesión
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FormularioLogin;