import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import logo from "../../assets/logo.png";
import { supabase } from "../../database/supabaseconfig";

const Encabezado = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const manejarToggle = () => setMostrarMenu(!mostrarMenu);

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setMostrarMenu(false);
  };

  const cerrarSesion = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem("usuario-supabase");
      setMostrarMenu(false);
      navigate("/login");
    } catch (err) {
      console.error("Error cerrando sesión:", err.message);
    }
  };

  const esLogin = location.pathname === "/login";
  const esCatalogo = location.pathname === "/catalogo" && localStorage.getItem("usuario-supabase") === null;

  let contenidoMenu;

  if (esLogin) {
    contenidoMenu = (
      <Nav className="ms-auto pe-2">
        <Nav.Link onClick={() => manejarNavegacion("/login")} className={mostrarMenu ? "color-texto-marca" : "text-black"}>
          <i className="bi-person-fill-lock me-2"></i> Iniciar sesión
        </Nav.Link>
      </Nav>
    );
  } else if (esCatalogo) {
    contenidoMenu = (
      <Nav className="ms-auto pe-2">
        <Nav.Link onClick={() => manejarNavegacion("/catalogo")} className={mostrarMenu ? "color-texto-marca" : "text-black"}>
          <i className="bi-images me-2"></i> <strong>Catálogo</strong>
        </Nav.Link>
      </Nav>
    );
  } else {
    contenidoMenu = (
      <>
        <Nav className="ms-auto pe-2">
          <Nav.Link onClick={() => manejarNavegacion("/")} className={mostrarMenu ? "color-texto-marca" : "text-black"}>
            {mostrarMenu ? <i className="bi-house-fill me-2"></i> : null} <strong>Inicio</strong>
          </Nav.Link>

          <Nav.Link onClick={() => manejarNavegacion("/categorias")} className={mostrarMenu ? "color-texto-marca" : "text-black"}>
            {mostrarMenu ? <i className="bi-bookmark-fill me-2"></i> : null} <strong>Categorías</strong>
          </Nav.Link>

          <Nav.Link onClick={() => manejarNavegacion("/productos")} className={mostrarMenu ? "color-texto-marca" : "text-black"}>
            {mostrarMenu ? <i className="bi-bag-heart-fill me-2"></i> : null} <strong>Productos</strong>
          </Nav.Link>

          <Nav.Link onClick={() => manejarNavegacion("/ventas")} className={mostrarMenu ? "color-texto-marca" : "text-black"}>
            {mostrarMenu ? <i className="bi-cart-check-fill me-2"></i> : null} <strong>Ventas</strong>
          </Nav.Link>

          {/* OPCIÓN DE COMPRAS AÑADIDA */}
          <Nav.Link onClick={() => manejarNavegacion("/compras")} className={mostrarMenu ? "color-texto-marca" : "text-black"}>
            {mostrarMenu ? <i className="bi-bag-check-fill me-2"></i> : null} <strong>Compras</strong>
          </Nav.Link>
          
          <Nav.Link onClick={() => manejarNavegacion("/proveedores")} className={mostrarMenu ? "color-texto-marca" : "text-black"}>
            {mostrarMenu ? <i className="bi-truck me-2"></i> : null} <strong>Proveedores</strong>
          </Nav.Link>

          <Nav.Link onClick={() => manejarNavegacion("/perfiles")} className={mostrarMenu ? "color-texto-marca" : "text-black"}>
            {mostrarMenu ? <i className="bi-people-fill me-2"></i> : null} <strong>Perfiles</strong>
          </Nav.Link>

          <hr />

          {!mostrarMenu && (
            <Nav.Link onClick={cerrarSesion} className="text-black">
              <i className="bi-box-arrow-right me-2"></i>
            </Nav.Link>
          )}
        </Nav>

        {mostrarMenu && (
          <div className="mt-3 p-3 rounded bg-light text-dark">
            <p className="mb-2 small text-truncate">
              <i className="bi-envelope-fill me-2"></i>
              {localStorage.getItem("usuario-supabase")?.toLowerCase() || "Usuario"}
            </p>
            <button className="btn btn-outline-danger mt-2 w-100 btn-sm" onClick={cerrarSesion}>
              <i className="bi-box-arrow-right me-2"></i> Cerrar sesión
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <Navbar expand="md" fixed="top" className="color-navbar shadow-sm" variant="dark">
      <Container>
        <Navbar.Brand
          onClick={() => manejarNavegacion(esCatalogo ? "/catalogo" : "/")}
          className="text-black fw-bold d-flex align-items-center"
          style={{ cursor: "pointer" }}
        >
          <img alt="Logo" src={logo} width="40" height="40" className="d-inline-block me-2" />
          <h5 className="mb-0 fw-bold">Martita Tools</h5>
        </Navbar.Brand>

        {!esLogin && (
          <Navbar.Toggle aria-controls="menu-offcanvas" onClick={manejarToggle} className="border-0" />
        )}

        <Navbar.Offcanvas id="menu-offcanvas" placement="end" show={mostrarMenu} onHide={() => setMostrarMenu(false)}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="fw-bold">Menú Principal</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {contenidoMenu}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Encabezado;