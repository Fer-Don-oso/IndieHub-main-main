import React, { useState, useEffect } from 'react';
import { useNotifications } from '../components/NotificationProvider';

const Carrito = () => {
    const notify = useNotifications();
    const [juegosEnCarrito, setJuegosEnCarrito] = useState([]);
    const [total, setTotal] = useState(0);

    // Carga inicial y lógica de PayPal (ejecutada en el lado del cliente)
    useEffect(() => {
        const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
        setJuegosEnCarrito(carrito);
        
        const newTotal = carrito.reduce((sum, juego) => sum + juego.precio, 0);
        setTotal(newTotal);

        // Cargar script de PayPal (como se hacía en tu HTML)
        const script = document.createElement('script');
        script.src = "https://www.paypal.com/sdk/js?client-id=sb&currency=USD&locale=es_CL";
        script.onload = () => initPayPalButtons(newTotal);
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script); // Limpia el script al desmontar
        };
    }, []);

    const handleCompraExitosa = () => {
        const juegosComprados = JSON.parse(localStorage.getItem('juegosComprados')) || [];
        
        // Mover juegos del carrito a la biblioteca
        juegosEnCarrito.forEach(juego => {
            // Se asegura de no agregar duplicados
            if (!juegosComprados.some(j => j.titulo === juego.nombre)) {
                juegosComprados.push({
                    titulo: juego.nombre,
                    fecha: new Date().toISOString().split('T')[0]
                });
            }
        });

        localStorage.setItem('juegosComprados', JSON.stringify(juegosComprados));
        localStorage.removeItem('carrito');
        setJuegosEnCarrito([]); // Vacía el carrito en el estado de React
        setTotal(0);
    };

    const initPayPalButtons = (currentTotal) => {
        // Asegura que PayPal y el contenedor existan antes de renderizar
        if (typeof paypal !== 'undefined' && document.getElementById('paypal-button-container')) {
            paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: currentTotal.toFixed(2)
                            }
                        }]
                    });
                },
                onApprove: function(data, actions) {
                  return actions.order.capture().then(function(details) {
                    notify.success(`Transacción completada por ${details.payer.name.given_name}`);
                    handleCompraExitosa();
                  });
                }
            }).render('#paypal-button-container');
        }
    };
    
    const vaciarCarrito = () => {
        localStorage.removeItem('carrito');
        setJuegosEnCarrito([]);
        setTotal(0);
        notify.info('Carrito vaciado');
    };

    const simularCompra = () => {
        handleCompraExitosa();
        notify.success('¡Compra simulada exitosa! Tus juegos fueron agregados a tu biblioteca');
    };

    return (
        <main className="container">
            <h1 className="text-center my-4">Tu Carrito de Compras</h1>
            <div className="row">
                <div className="col">
                    <p>Aquí puedes ver los juegos que has agregado a tu carrito.</p>
                    <ul id="cart-list" className="list-group mb-4">
                        {juegosEnCarrito.map((juego, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                {juego.nombre}
                                <span>${juego.precio.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <p><strong>Total: $<span id="cart-total">{total.toFixed(2)}</span></strong></p>
                    <button onClick={vaciarCarrito} id="vaciar-carrito" className="btn btn-danger mb-3">Vaciar carrito</button>
                </div>
            </div>
            
            <div id="paypal-button-container" className="my-4"></div>
            
            <div className="text-center mb-4">
                <button onClick={simularCompra} id="simular-compra" className="btn btn-success">Simular compra (modo prueba)</button>
            </div>
        </main>
    );
};

export default Carrito;