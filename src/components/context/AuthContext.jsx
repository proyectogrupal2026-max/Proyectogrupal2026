import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../database/supabaseconfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [permisos, setPermisos] = useState(null); 
  const [cargando, setCargando] = useState(true);

  const cargarPermisos = async (rolUsuario) => {
    if (!rolUsuario) {
      setPermisos({});
      return;
    }
    try {
      const { data, error } = await supabase
        .from('permisos')
        .select('permisos')
        .eq('rol', rolUsuario)
        .single();

      if (error) {
        console.error("Error al cargar permisos para el rol:", rolUsuario, error);
        setPermisos({});
        return;
      }
      setPermisos(data?.permisos || {});
    } catch (err) {
      console.error("Error inesperado al cargar permisos:", err);
      setPermisos({});
    }
  };

  const login = async (email, password) => {
    setCargando(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData?.user) throw new Error("No se pudo obtener la información de autenticación.");

      const { data: perfil, error: perfilError } = await supabase
        .from('perfiles')
        .select('*')
        .eq('user_id', authData.user.id)
        .single();

      if (perfilError || !perfil) {
        throw new Error("No se encontró el perfil de usuario en la base de datos.");
      }

      localStorage.setItem("usuario-supabase", email);
      setUsuario(perfil);
      await cargarPermisos(perfil.rol);
      
      return authData;
    } finally {
      setCargando(false);
    }
  };

  const logout = async () => {
    setCargando(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error en signOut:", err);
    } finally {
      localStorage.removeItem("usuario-supabase");
      setUsuario(null);
      setPermisos({}); // ← CORRECCIÓN: Usamos un objeto vacío en lugar de null para evitar congelar la app
      setCargando(false);
    }
  };

  useEffect(() => {
    const cargarSesionInicial = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          localStorage.removeItem("usuario-supabase");
          setUsuario(null);
          setPermisos({}); 
          return;
        }

        const { data: perfil, error } = await supabase
          .from('perfiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (perfil && !error) {
          localStorage.setItem("usuario-supabase", session.user.email);
          setUsuario(perfil);
          await cargarPermisos(perfil.rol);
        } else {
          localStorage.removeItem("usuario-supabase");
          setUsuario(null);
          setPermisos({});
        }
      } catch (err) {
        console.error("Error en sesión inicial:", err);
        localStorage.removeItem("usuario-supabase");
        setUsuario(null);
        setPermisos({});
      } finally {
        setCargando(false);
      }
    };

    cargarSesionInicial();
  }, []);

  const tienePermiso = (permisoKey) => {
    if (!permisos) return false;
    return !!permisos[permisoKey];
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      permisos,
      tienePermiso,
      login,
      logout,
      cargando: cargando || permisos === null
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};