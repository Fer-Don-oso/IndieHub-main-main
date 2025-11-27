import React, { useState, useEffect } from 'react';

const Perfil = () => {
    // Definimos el estado para el usuario y su biblioteca
    const [usuario, setUsuario] = useState({});
    const [biblioteca, setBiblioteca] = useState([]);

    useEffect(() => {
        // Cargar datos del usuario logeado
        const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
        if (loggedUser) {
            setUsuario({
                nombre: loggedUser.nombre || 'Invitado',
                email: loggedUser.correo || 'No registrado'
            });
        }

        // Cargar biblioteca de juegos (comprados)
        const juegosComprados = JSON.parse(localStorage.getItem('juegosComprados') || '[]');
        setBiblioteca(juegosComprados);
    }, []);
    
    // Componente funcional interno para la tarjeta de juego
    const BibliotecaCard = ({ titulo, fecha }) => (
        <div className="col">
            <div className="card h-100">
                <div className="card-body">
                    <h5 className="card-title">{titulo}</h5>
                    <p className="card-text">Fecha de compra: {fecha}</p>
                    {/* El archivo-prueba.txt debe estar en /public/static/ */}
                    <a href="/static/archivo-prueba.txt" download="archivo-prueba.txt" className="btn btn-primary">
                        Descargar Juego
                    </a>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mt-4">
            <h2>Mi Perfil</h2>
            
            <div className="card" style={{ maxWidth: '400px' }}>
                <div className="card-body">
                    <h5 className="card-title">Usuario: {usuario.nombre}</h5>
                    <p className="card-text">Email: {usuario.email}</p>
                </div>
            </div>

            <div className="mt-4">
                <h3>Mi Biblioteca de Juegos</h3>
                <div id="biblioteca-juegos" className="row row-cols-1 row-cols-md-3 g-4">
                    {biblioteca.length > 0 ? (
                        biblioteca.map((juego, index) => (
                            // Renderiza una tarjeta por cada juego en la biblioteca
                            <BibliotecaCard key={index} titulo={juego.titulo} fecha={juego.fecha} />
                        ))
                    ) : (
                        <p>No has comprado ningún juego aún.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Perfil;