import React, { useState, useEffect } from 'react';
import { initialJuegosFijos } from '../data/juegos';
import { gameService } from '../services/api';
import { useNotifications } from '../components/NotificationProvider';
const Home = () => {
  const [juegos, setJuegos] = useState(initialJuegosFijos);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const notify = useNotifications(); // <-- usar notify

  useEffect(() => {
    const cargarJuegos = async () => {
      try {
        const apiJuegos = await gameService.getAllGames();
        const normalizados = apiJuegos.map(g => ({
          nombre: g.nombre ?? g.title ?? 'Sin nombre',
          precio: typeof g.precio === 'number' ? g.precio : Number(g.precio ?? 0),
          imagen: g.imagen ?? g.image ?? '/static/img/banner1.jpg',
          _id: g._id
        }));
        setJuegos([...initialJuegosFijos, ...normalizados]);
      } catch (e) {
        setError('No se pudieron cargar los juegos de la API.');
        notify.error('Error cargando juegos desde la API'); // <-- notificación de error
        setJuegos(initialJuegosFijos);
      } finally {
        setLoading(false);
      }
    };
    cargarJuegos();
  }, []);

  const agregarAlCarrito = (juego) => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push({ ...juego });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    notify.success(`${juego.nombre} agregado al carrito`); // <-- notificación OK
  };

  const Carousel = () => (
    <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {[...Array(3)].map((_, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <img src="/static/img/banner1.jpg" className="d-block w-100" alt={`Slide ${index + 1}`} />
            <div className="carousel-caption d-none d-md-block">
              <h5>¡Bienvenido a la mejor plataforma de videojuegos del mundo!</h5>
              <p>Ten un vistazo de nuestros mejores juegos indie</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <main className="container my-5 text-center"><p>Cargando juegos...</p></main>;
  }

  return (
    <main>
      <Carousel />
      <hr />
      <div style={{ backgroundColor: 'rgba(125, 179, 226, 0.9)' }}>
        <h1 id="tituloHome" style={{ textAlign: 'center' }}>Bienvenido</h1>
      </div>

      <div className="container text-center my-5">
        <h1 style={{ color: 'rgb(0, 0, 0)' }}>
          Juegos Indie que podrían gustarte:
        </h1>
        <p style={{ color: 'rgb(0, 0, 0)' }} className="lead">
          Explora nuestra selección de juegos indie únicos y emocionantes
        </p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div className="container">
        <div id="galeria-juegos" className="row row-cols-1 row-cols-md-3 g-4">
          {juegos.map((juego, index) => (
            <div className="col" key={juego._id ?? index}>
              <div className="card h-100 shadow-sm">
                <img src={juego.imagen} className="card-img-top" alt={juego.nombre} />
                <div className="card-body text-center">
                  <h5 className="card-title">{juego.nombre}</h5>
                  <p className="card-text">${Number(juego.precio).toFixed(2)}</p>
                  <button className="btn btn-primary" onClick={() => agregarAlCarrito(juego)}>
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Home;