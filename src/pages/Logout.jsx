import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Limpiar el estado de sesión
        localStorage.removeItem('loggedUser');
        // También limpiamos los datos antiguos que guardabas:
        localStorage.removeItem('usuario'); 
        localStorage.removeItem('email');
        
        setIsLoggedIn(false);

        // Redirigir después de 5 segundos, simulando el setTimeout de tu HTML original
        const timer = setTimeout(() => {
            navigate('/'); // Redirige al Login
        }, 5000);

        return () => clearTimeout(timer); // Limpia el timer si el componente se desmonta
    }, [navigate, setIsLoggedIn]);

    return (
        <main className="container mt-5 text-center">
            <h2>Has cerrado sesión correctamente.</h2>
            <p>Serás redirigido al inicio de sesión en unos segundos...</p>
        </main>
    );
};

export default Logout;