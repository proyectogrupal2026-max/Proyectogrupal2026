// ================================================
// 2. Vista: Login.jsx (o pages/Login.jsx)
// (Crea este archivo en: src/views/Login.jsx o src/pages/Login.jsx)
// ================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormularioLogin from "../components/login/FormularioLogin";   // ← Ajusta la ruta según tu carpeta
import { supabase } from "../database/supabaseconfig";       // ← Ajusta la ruta según tu proyecto

const Login = () => {
  // Variables de estado
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");

  // Hook de navegación
  const navegar = useNavigate();

  // Función para iniciar sesión con Supabase
  const iniciarSesion = async () => {
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: usuario,
        password: contraseña,
      });

      if (authError) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      if (data.user) {
        // Guardamos en localStorage (como indica la guía)
        localStorage.setItem("usuario-supabase", usuario);
        navegar("/");   // Redirige al dashboard o página principal
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error("Error en la solicitud:", err);
    }
  };

  // useEffect para verificar si ya hay sesión activa
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario-supabase");
    if (usuarioGuardado) {
      navegar("/");
    }
  }, [navegar]);

  // Estilos del contenedor (fondo degradado)
  const estiloContenedor = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #FFDEA9, #B5FFFC)", // corregí el hex incompleto de la guía
    overflow: "hidden",
    padding: "20px",
  };

  return (
    <div style={estiloContenedor}>
      <FormularioLogin
        usuario={usuario}
        contraseña={contraseña}
        error={error}
        setUsuario={setUsuario}
        setContraseña={setContraseña}
        iniciarSesión={iniciarSesion}
      />
    </div>
  );
};

export default Login;