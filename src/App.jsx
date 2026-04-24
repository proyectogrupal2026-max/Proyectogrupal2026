import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Encabezado from "./components/navegacion/Encabezado";

import Inicio from "./views/Inicio";
import Categorias from "./views/Categorias";
import Catalogo from "./views/Catalogo";
import Productos from "./views/Productos";
import Ventas from "./views/Ventas"; // <-- NUEVA IMPORTACIÓN
import Login from "./views/Login";
import Proveedores from "./views/Proveedores";
import Perfiles from "./views/Perfiles";
import RutaProtegida from "./components/rutas/RutaProtegida";
import Pagina404 from "./views/Pagina404";

import "./App.css";

const App = () => {
  return (
    <Router>

      <Encabezado />

      <main className="margen-superior-main">
        <Routes>

          <Route path="/login" element={<Login />} />

          <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />
          <Route path="/categorias" element={<RutaProtegida><Categorias /></RutaProtegida>} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/productos" element={<RutaProtegida><Productos /></RutaProtegida>} />
          
          {/* --- NUEVA RUTA PARA VENTAS --- */}
          <Route path="/ventas" element={<RutaProtegida><Ventas /></RutaProtegida>} />
          
          <Route path="/proveedores" element={<RutaProtegida><Proveedores /></RutaProtegida>} />
          <Route path="/perfiles" element={<RutaProtegida><Perfiles /></RutaProtegida>} />

          <Route path="*" element={<Pagina404 />} />

        </Routes>
      </main>
    </Router>
  );
}

export default App;