import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";
import FormularioLogin from "../components/login/FormularioLogin";

const Login = () => {
  const [usuarioInput, setUsuarioInput] = useState("");
  const [contrasenaInput, setContrasenaInput] = useState("");
  const [errorLocal, setErrorLocal] = useState("");
  const [autenticando, setAutenticando] = useState(false);

  const navigate = useNavigate();
  const { login, usuario, cargando } = useAuth();

  // Redirección inmediata si el usuario ya inició sesión
  useEffect(() => {
    if (!cargando && usuario) {
      navigate("/", { replace: true });
    }
  }, [usuario, cargando, navigate]);

  const iniciarSesion = async (e) => {
    if (e) e.preventDefault();
    setErrorLocal("");

    if (!usuarioInput.trim() || !contrasenaInput.trim()) {
      setErrorLocal("Por favor, complete todos los campos.");
      return;
    }

    try {
      setAutenticando(true);
      await login(usuarioInput.trim(), contrasenaInput);
    } catch (err) {
      console.error("Error al autenticar:", err);
      setErrorLocal(err.message || "Credenciales incorrectas. Intente de nuevo.");
      setAutenticando(false);
    }
  };

  // CORRECCIÓN: Si el usuario existe, dejamos que el useEffect maneje la redirección.
  // Si no hay usuario, renderizamos el formulario de inmediato evitando la pantalla en blanco.
  if (cargando && usuario) {
    return null;
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <FormularioLogin
        usuario={usuarioInput}
        contrasena={contrasenaInput}
        error={errorLocal}
        setUsuario={setUsuarioInput}
        setContrasena={setContrasenaInput}
        iniciarSesion={iniciarSesion}
        cargando={autenticando}
      />
    </div>
  );
};

export default Login;