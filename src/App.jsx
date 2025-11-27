// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Carrito from './pages/Carrito';
import Perfil from './pages/Perfil';
import Upload from './pages/Upload';
import Logout from './pages/Logout';
import Buscador from './pages/Buscador';
import Foro from './pages/Foro';
import './styles/notifications.css';

// Componente para proteger rutas
const ProtectedRoute = ({ element: Element, ...rest }) => {
    const loggedUser = localStorage.getItem('loggedUser');
    // Si no hay usuario logeado, redirige a la página de inicio de sesión ('/login')
    return loggedUser ? <Element {...rest} /> : <Navigate to="/login" replace />;
};

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('loggedUser'));

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('loggedUser'));
    }, []);

    return (
        <Router>
            <Navbar loggedIn={isLoggedIn} />
            
            <Routes>
                {/* Página principal pública: muestra productos/juegos */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />

                {/* Rutas públicas */}
                <Route path="/buscador" element={<Buscador />} />
                <Route path="/foro" element={<Foro />} />
                <Route path="/carrito" element={<Carrito />} />

                {/* Autenticación */}
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Rutas que requieren sesión */}
                <Route path="/perfil" element={<ProtectedRoute element={Perfil} />} />
                <Route path="/upload" element={<ProtectedRoute element={Upload} />} />
                <Route path="/logout" element={<ProtectedRoute element={Logout} setIsLoggedIn={setIsLoggedIn} />} />

                <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
            </Routes>
        </Router>
    );
};

export default App;
