import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/context/AuthContext";

import Encabezado from "./components/navegacion/Encabezado";
import RutaProtegida from "./components/rutas/RutaProtegida";

import Inicio from "./views/Inicio";
import Categorias from "./views/Categorias";
import Productos from "./views/Productos";
import Ventas from "./views/Ventas"; 
import Compras from "./views/Compras"; 
import Login from "./views/Login";
import Proveedores from "./views/Proveedores";
import Perfiles from "./views/Perfiles";
import Catalogo from './views/Catalogo';
import Clientes from './views/Clientes';
import Permisos from './views/Permisos';
import Pagina404 from "./views/Pagina404";

import "./App.css";

const App = () => {
  const esLogin = window.location.pathname === "/login";

  return (
    <AuthProvider>
      <Router>
        {!esLogin && <Encabezado />}
        
        <main className="margen-superior-main">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />
            <Route path="/categorias" element={<RutaProtegida><Categorias /></RutaProtegida>} />
            <Route path="/productos" element={<RutaProtegida><Productos /></RutaProtegida>} />
            <Route path="/ventas" element={<RutaProtegida><Ventas /></RutaProtegida>} />
            <Route path="/catalogo" element={<RutaProtegida><Catalogo /></RutaProtegida>} />
            <Route path="/clientes" element={<RutaProtegida><Clientes /></RutaProtegida>} />
            <Route path="/compras" element={<RutaProtegida><Compras /></RutaProtegida>} />
            <Route path="/proveedores" element={<RutaProtegida><Proveedores /></RutaProtegida>} />
            <Route path="/perfiles" element={<RutaProtegida><Perfiles /></RutaProtegida>} />
            <Route path="/permisos" element={<RutaProtegida><Permisos /></RutaProtegida>} />

            <Route path="*" element={<Pagina404 />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;