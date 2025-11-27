// ...existing code...
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Datos iniciales para simular temas de discusión
const initialForoData = [
    {
        id: 1,
        titulo: "Opiniones sobre Stardew Valley: ¿Vale la pena en 2024?",
        autor: "Admin",
        fecha: "2024-05-01",
        comentarios: [
            { id: 101, autor: "Jugador123", texto: "¡Absolutamente! Es un juego atemporal. Sigo encontrando cosas nuevas.", fecha: "2024-05-01" },
        ]
    },
    {
        id: 2,
        titulo: "¿Qué esperas de Hollow Knight: Silksong?",
        autor: "Moderador",
        fecha: "2024-04-15",
        comentarios: [
            { id: 201, autor: "FanHK", texto: "Espero que mantengan la dificultad del primero.", fecha: "2024-04-16" },
            { id: 202, autor: "GamerIndie", texto: "¡Que Silksong salga pronto es mi única esperanza!", fecha: "2024-04-16" },
        ]
    },
];

const Foro = () => {
    // El estado principal almacena todos los temas del foro
    const [temas, setTemas] = useState([]);
    // Estado para el texto del nuevo comentario
    const [nuevoComentario, setNuevoComentario] = useState('');
    // Estado para el título del nuevo tema
    const [nuevoTemaTitulo, setNuevoTemaTitulo] = useState('');
    // Estado para saber qué tema está expandido
    const [temaActivo, setTemaActivo] = useState(null); 

    // Se lee el usuario logueado al render (puedes adaptar a contexto si lo tienes)
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    const nombreUsuario = loggedUser ? loggedUser.nombre : 'Invitado';

    // Cargar datos del foro desde localStorage al montar el componente
    useEffect(() => {
        const storedTemas = JSON.parse(localStorage.getItem('foroTemas'));
        if (storedTemas && storedTemas.length > 0) {
            setTemas(storedTemas);
        } else {
            setTemas(initialForoData);
            // Guardar los datos iniciales por si el localStorage está vacío
            localStorage.setItem('foroTemas', JSON.stringify(initialForoData));
        }
    }, []);

    // Función para alternar la vista de comentarios de un tema
    const toggleTema = (id) => {
        setTemaActivo(temaActivo === id ? null : id);
    };

    // Función para agregar un nuevo comentario a un tema
    const agregarComentario = (temaId) => {
        const user = JSON.parse(localStorage.getItem('loggedUser'));
        if (!user) {
            alert("Debes iniciar sesión para comentar.");
            return;
        }

        if (nuevoComentario.trim() === '') return;

        const comentarioData = {
            id: Date.now(), // ID único basado en el tiempo
            autor: user.nombre || 'Usuario Anónimo',
            texto: nuevoComentario.trim(),
            fecha: new Date().toISOString().split('T')[0]
        };

        // Clonar y actualizar el array de temas
        const nuevosTemas = temas.map(tema => {
            if (tema.id === temaId) {
                return {
                    ...tema,
                    comentarios: [...tema.comentarios, comentarioData]
                };
            }
            return tema;
        });

        setTemas(nuevosTemas);
        localStorage.setItem('foroTemas', JSON.stringify(nuevosTemas)); // Guardar en localStorage
        setNuevoComentario(''); // Limpiar el input
    };

    const agregarTema = () => {
        const user = JSON.parse(localStorage.getItem('loggedUser'));
        if (!user) {
            alert("Debes iniciar sesión para crear un nuevo tema.");
            return;
        }

        if (nuevoTemaTitulo.trim() === '') return;

        const nuevoTema = {
            id: Date.now(),
            titulo: nuevoTemaTitulo.trim(),
            autor: user.nombre || 'Usuario Anónimo',
            fecha: new Date().toISOString().split('T')[0],
            comentarios: []
        };

        const nuevosTemas = [...temas, nuevoTema];
        setTemas(nuevosTemas);
        localStorage.setItem('foroTemas', JSON.stringify(nuevosTemas));
        setNuevoTemaTitulo(''); // Limpiar el input
    };

    return (
        <main className="container mt-5">
            <h1 className="mb-4">Foro IndieHub - ¡Bienvenido, {nombreUsuario}!</h1>

            {/* Formulario para agregar un nuevo tema: solo visible si hay sesión */}
            <div className="mb-4">
                {loggedUser ? (
                    <>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Título del nuevo tema..."
                            value={nuevoTemaTitulo}
                            onChange={(e) => setNuevoTemaTitulo(e.target.value)}
                        />
                        <button 
                            className="btn btn-success mt-2" 
                            onClick={agregarTema}
                        >
                            Crear Tema
                        </button>
                    </>
                ) : (
                    <p>
                        Para crear un tema debes <Link to="/login">iniciar sesión</Link>.
                    </p>
                )}
            </div>
            
            {temas.map(tema => (
                <div key={tema.id} className="card mb-3 shadow-sm">
                    <div className="card-header bg-primary text-white" onClick={() => toggleTema(tema.id)} style={{ cursor: 'pointer' }}>
                        <h5 className="mb-0">{tema.titulo}</h5>
                        <small>Publicado por {tema.autor} el {tema.fecha}</small>
                    </div>
                    
                    {/* Contenido expandible (Comentarios) */}
                    {temaActivo === tema.id && (
                        <div className="card-body">
                            <h6>Comentarios:</h6>
                            <div className="list-group mb-3">
                                {tema.comentarios.length > 0 ? (
                                    tema.comentarios.map(comentario => (
                                        <div key={comentario.id} className="list-group-item list-group-item-light">
                                            <p className="mb-1"><strong>{comentario.autor}:</strong> {comentario.texto}</p>
                                            <small className="text-muted">({comentario.fecha})</small>
                                        </div>
                                    ))
                                ) : (
                                    <p>Sé el primero en comentar.</p>
                                )}
                            </div>

                            {/* Formulario para agregar comentario: solo si hay sesión */}
                            {loggedUser ? (
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Escribe tu comentario..."
                                        value={nuevoComentario}
                                        onChange={(e) => setNuevoComentario(e.target.value)}
                                        onKeyDown={(e) => { // enviar con Enter
                                            if (e.key === 'Enter') {
                                                agregarComentario(tema.id);
                                            }
                                        }}
                                    />
                                    <button 
                                        className="btn btn-outline-primary" 
                                        type="button" 
                                        onClick={() => agregarComentario(tema.id)}
                                    >
                                        Comentar
                                    </button>
                                </div>
                            ) : (
                                <p>
                                    Para comentar debes <Link to="/login">iniciar sesión</Link>.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </main>
    );
};

export default Foro;
