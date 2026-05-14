import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import fotoNegocio1 from "../components/img/1.jpg";
import fotoNegocio2 from "../components/img/2.jpg";

const Inicio = () => {
  const animaciones = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&family=Lexend:wght@300;600;800&display=swap');

    .inicio-container {
      font-family: 'Inter', sans-serif;
      color: #1e293b;
    }

    h1, h2, h3, .h-style {
      font-family: 'Lexend', sans-serif;
      letter-spacing: -0.03em;
    }

    .text-gradient-blue {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }

    .text-gradient-green {
      background: linear-gradient(135deg, #10b981 0%, #065f46 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .anim-fade-in { animation: fadeIn 1.2s ease-out forwards; }
    .anim-fade-up { animation: fadeInUp 0.8s ease-out forwards; }
    .delay-1 { animation-delay: 0.2s; }
    .delay-2 { animation-delay: 0.4s; }
    
    .hover-card {
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
      border: 1px solid rgba(0,0,0,0.05) !important;
      border-radius: 24px !important;
    }

    .hover-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.06) !important;
    }
    
    .icon-circle {
      width: 65px;
      height: 65px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 1.6rem;
    }

    .glass-pill {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 6px 18px;
      border-radius: 50px;
      display: inline-block;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
    }

    .call-to-action-line {
      border-left: 4px solid #2563eb;
      padding-left: 25px;
      margin: 40px 0;
      font-family: 'Lexend', sans-serif;
    }
  `;

  const estilos = {
    heroSection: {
      position: "relative",
      borderRadius: "32px",
      overflow: "hidden",
      marginBottom: "40px",
      minHeight: "480px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      color: "white",
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    },
    heroImage: {
      position: "absolute",
      width: "100%", height: "100%",
      objectFit: "cover", zIndex: 0,
    },
    heroOverlay: {
      position: "absolute",
      top: 0, left: 0, width: "100%", height: "100%",
      background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))",
      zIndex: 1
    },
    heroContent: { position: "relative", zIndex: 2, padding: "30px", maxWidth: "850px" },
    imgPrincipal: {
      width: "100%",
      maxWidth: "750px",
      borderRadius: "28px",
      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
      margin: "40px auto",
      display: "block"
    }
  };

  return (
    <Container className="py-5 inicio-container anim-fade-in">
      <style>{animaciones}</style>

      {/* 1. HERO AREA */}
      <div style={estilos.heroSection} className="anim-fade-up">
        <img src={fotoNegocio1} style={estilos.heroImage} alt="Ferretería Martita" />
        <div style={estilos.heroOverlay}></div>
        <div style={estilos.heroContent}>
          <div className="glass-pill mb-4 fw-bold">Multiplataforma Real-Time</div>
          <h1 className="display-2 fw-bold mb-3">MartitaTools</h1>
          <p className="lead fs-3 fw-light mb-0" style={{ fontStyle: 'italic', color: '#f8fafc' }}>
            "El que no se actualiza no se estanca: simplemente deja de existir"
          </p>
        </div>
      </div>

      {/* 2. THE CHALLENGE (PREGUNTA DE ENGANCHE) */}
      <div className="anim-fade-up delay-1 container" style={{ maxWidth: "800px" }}>
        <div className="call-to-action-line">
          <h3 className="fw-bold text-dark m-0 fs-2" style={{ lineHeight: "1.2" }}>
            ¿Vas a digitalizar tu stock hoy o vas a esperar a rematar el inventario mañana?
          </h3>
        </div>
      </div>

      {/* 3. THE NARRATIVE (PWA FOCUS) */}
      <div className="text-center mb-5 anim-fade-up delay-1 pt-4">
        <Row className="justify-content-center">
          <Col lg={9}>
            <h2 className="display-5 fw-bold mb-4">La Auditoría de la Realidad</h2>
            <p className="fs-5 mb-5 text-secondary px-md-5" style={{ lineHeight: "1.8", fontWeight: "300" }}>
              <span className="text-gradient-blue uppercase small d-block mb-2">Diagnóstico de Operaciones</span>
              Miles de córdobas se pierden silenciosamente debido a una gestión manual. El papel es lento y los registros físicos son vulnerables. En <strong>Ferretería Martita Castilla</strong>, cada segundo que un vendedor duda sobre un precio o un stock, es una venta que se pierde.
            </p>

            <h2 className="display-5 fw-bold mb-4">La Potencia de una PWA</h2>
            <p className="fs-5 mb-5 text-secondary px-md-5" style={{ lineHeight: "1.8", fontWeight: "300" }}>
              <span className="text-gradient-green uppercase small d-block mb-2">Estrategia Tecnológica</span>
              MartitaTools es una <strong>Progressive Web App (PWA)</strong> de alto rendimiento. Se instala en segundos en cualquier dispositivo Android o PC, permitiendo una sincronización total con la nube. Es la infraestructura digital que inyecta agilidad inmediata a tu capital de trabajo.
            </p>
            <img src={fotoNegocio2} style={estilos.imgPrincipal} alt="Ferretería" className="img-fluid shadow-lg" />
          </Col>
        </Row>
      </div>

      {/* 4. VALUE PROPOSITIONS */}
      <Row className="g-4 text-center mt-4">
        <Col md={4} className="anim-fade-up delay-2">
          <Card className="p-5 hover-card">
            <div className="icon-circle shadow-sm" style={{ background: "#eff6ff", color: "#2563eb" }}>
              <i className="bi bi-phone-vibrate"></i>
            </div>
            <h4 className="fw-bold mb-3">Acceso Nativo</h4>
            <p className="text-muted lh-base">Instálalo como una App nativa. Rapidez total desde el escritorio o desde tu celular.</p>
          </Card>
        </Col>
        <Col md={4} className="anim-fade-up delay-2">
          <Card className="p-5 hover-card">
            <div className="icon-circle shadow-sm" style={{ background: "#fdf2f8", color: "#db2777" }}>
              <i className="bi bi-arrow-repeat"></i>
            </div>
            <h4 className="fw-bold mb-3">Sincronía Total</h4>
            <p className="text-muted lh-base">Cualquier cambio en el stock se refleja al instante para todo tu equipo de ventas.</p>
          </Card>
        </Col>
        <Col md={4} className="anim-fade-up delay-2">
          <Card className="p-5 hover-card">
            <div className="icon-circle shadow-sm" style={{ background: "#f0fdf4", color: "#16a34a" }}>
              <i className="bi bi-database-fill-check"></i>
            </div>
            <h4 className="fw-bold">Nube Supabase</h4>
            <p className="text-muted lh-base">Tus datos protegidos y disponibles 24/7 con tecnología de base de datos de élite.</p>
          </Card>
        </Col>
      </Row>

      {/* 5. FOOTER CLOSING */}
      <div className="mt-5 pt-5 text-center anim-fade-up delay-2">
        <h3 className="fw-bold display-6 mb-3">El futuro es digital y es ahora</h3>
        <p className="text-secondary fs-5 fw-light">
          Innovación estratégica para <strong>Ferretería Martita Castilla</strong>.<br />
          <span className="small opacity-50 text-uppercase fw-bold" style={{ letterSpacing: "3px" }}>Juigalpa 2026</span>
        </p>
      </div>
    </Container>
  );
};

export default Inicio;