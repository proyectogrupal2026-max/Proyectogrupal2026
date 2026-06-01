import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import TablaPermisos from "../components/permisos/TablaPermisos";
import TarjetaPermisos from "../components/permisos/TarjetaPermisos";
import ModalEditarPermisos from "../components/permisos/ModalEdicionPermisos"; 
import NotificacionOperacion from "../components/NotificacionOperacion";

const Permisos = () => {
  const [rolesPermisos, setRolesPermisos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  const cargarPermisos = async () => {
    try {
      const { data, error } = await supabase
        .from("permisos")
        .select("*");

      if (error) throw error;
      setRolesPermisos(data || []);
    } catch (err) {
      console.error("Error al obtener permisos de la BD:", err);
      setToast({ 
        mostrar: true, 
        mensaje: "No se pudieron cargar los permisos del sistema.", 
        tipo: "error" 
      });
    }
  };

  useEffect(() => {
    cargarPermisos();
  }, []);

  const abrirModalEdicion = (rolData) => {
    setRolSeleccionado(rolData);
    setMostrarModal(true);
  };

  const manejarExitoGuardado = async () => {
    await cargarPermisos();
    setToast({
      mostrar: true,
      mensaje: `Permisos actualizados en la base de datos correctamente`,
      tipo: "exito"
    });
  };

  return (
    <Container className="mt-4">
      <div className="mb-4">
        <h2 className="fw-bold text-dark">
          <i className="bi bi-shield-lock-fill me-2 text-primary"></i>Gestión de Permisos
        </h2>
        <p className="text-muted">
          Control de accesos modulares para los roles de la ferretería (MartitaTools).
        </p>
      </div>

      <Row>
        <Col xs={12} className="d-lg-none">
          <TarjetaPermisos 
            roles={rolesPermisos} 
            abrirModalEdicion={abrirModalEdicion} 
          />
        </Col>

        <Col lg={12} className="d-none d-lg-block">
          <Card className="p-4 shadow-sm border-0 rounded-3">
            <TablaPermisos 
              roles={rolesPermisos} 
              abrirModalEdicion={abrirModalEdicion} 
            />
          </Card>
        </Col>
      </Row>

      <ModalEditarPermisos
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        rolData={rolSeleccionado}
        cargarPermisos={manejarExitoGuardado}
      />

      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />
    </Container>
  );
};

export default Permisos;