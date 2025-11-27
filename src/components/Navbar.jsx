import React, { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ loggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const baseRoutes = [
    { path: '/home', name: 'Inicio' },
    { path: '/buscador', name: 'Buscar juegos!' },
    { path: '/foro', name: 'Foro' },
    { path: '/carrito', name: 'Carrito' },
    { path: '/perfil', name: 'Perfil' },
    { path: '/upload', name: 'Sube tu juego!' },
  ];

  const navItems = loggedIn
    ? [...baseRoutes, { path: '/logout', name: 'Cerrar sesión' }]
    : [...baseRoutes, { path: '/login', name: 'Login' }, { path: '/signup', name: 'Registrate' }];

  const closeOffcanvas = () => {
    const el = document.getElementById('mainNav');
    const bs = window.bootstrap;
    if (el && bs?.Offcanvas) {
      const inst = bs.Offcanvas.getInstance(el) || bs.Offcanvas.getOrCreateInstance(el);
      inst.hide();
    }
  };

  const handleNavClick = (e, item) => {
    // Bloquea carrito si no hay login
    if (item.path === '/carrito' && !loggedIn) {
      e.preventDefault();
      const goLogin = window.confirm('Debes iniciar sesión para comprar. ¿Ir al login?');
      if (goLogin) navigate('/login', { state: { from: location }, replace: true });
      // Cierra el panel igualmente
      setTimeout(closeOffcanvas, 0);
      return;
    }
    // Cierra después del enrutamiento
    setTimeout(closeOffcanvas, 0);
  };

  useEffect(() => {
    // Si la ruta cambió, asegúrate de cerrar el panel (fallback)
    closeOffcanvas();
  }, [location.pathname]);

  return (
    <header>
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg fixed-top" data-bs-theme="dark">
        <div className="container-fluid">
          <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/home">
            <img src="/static/img/logo.png" alt="Logo" width="28" height="28" className="d-inline-block" />
            <span>IndieHub</span>
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="offcanvas offcanvas-end text-bg-dark" tabIndex="-1" id="mainNav" aria-labelledby="mainNavLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="mainNavLabel">Menú</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav ms-auto gap-1 fs-6">
                {navItems.map((item) => (
                  <li className="nav-item" key={item.path}>
                    <NavLink
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      to={item.path}
                      onClick={(e) => handleNavClick(e, item)}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;