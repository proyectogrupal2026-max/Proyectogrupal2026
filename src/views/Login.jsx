import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormularioLogin from "../components/login/FormularioLogin";   
import { supabase } from "../database/supabaseconfig";       

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navegar = useNavigate();

  const iniciarSesion = async () => {
    setError("");
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
        localStorage.setItem("usuario-supabase", usuario);
        navegar("/");   
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("usuario-supabase")) {
      navegar("/");
    }
  }, [navegar]);

  const estiloContenedor = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #FFDEA9, #B5FFFC)", 
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