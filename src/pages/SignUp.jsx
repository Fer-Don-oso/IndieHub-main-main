import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    // Hooks para los campos del formulario
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const navigate = useNavigate();

    const registroUsuario = (e) => {
        e.preventDefault(); // Evita el refresco de la página, crucial en React

        if (!nombre || !correo || !password || !password2) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        if (nombre.length < 4) {
            alert('El nombre debe tener al menos 4 caracteres.');
            return;
        }

        if (password !== password2) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        if (password.length < 8) {
            alert('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
            alert('La contraseña debe incluir letras y números.');
            return;
        }

        let users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(u => u.correo === correo)) {
            alert('El correo ya está registrado.');
            return;
        }

        const newUser = { nombre, correo, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // La lógica original guardaba 'usuario' y 'email' también:
        localStorage.setItem('usuario', nombre);
        localStorage.setItem('email', correo);

        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        navigate('/'); // Redirige al login
    }

    return (
        <main className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow-lg p-4" style={{ maxWidth: '500px', width: '100%' }}>
                <h3 className="text-center mb-4">Crear Cuenta</h3>
                
                <form onSubmit={registroUsuario}> {/* Usamos onSubmit y preventDefault */}
                    <div className="mb-3">
                        <label htmlFor="nombreCompleto" className="form-label">Nombre completo</label>
                        <input type="text" id="nombreCompleto" className="form-control" placeholder="Ingresa tu nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="correoElectronico" className="form-label">Correo electrónico</label>
                        <input type="email" id="correoElectronico" className="form-control" placeholder="ejemplo@correo.com" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input type="password" id="password" className="form-control" placeholder="Ingresa tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password2" className="form-label">Repetir contraseña</label>
                        <input type="password" id="password2" className="form-control" placeholder="Repite tu contraseña" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-success w-100">Enviar</button>
                </form>
            </div>
        </main>
    );
};

export default SignUp;