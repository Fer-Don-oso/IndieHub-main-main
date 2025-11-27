import React, { useState, useEffect } from 'react';
import { initialJuegosFijos } from '../data/juegos';
import { gameService } from '../services/api';
import { useNotifications } from '../components/NotificationProvider';

const Buscador = () => {
  const notify = useNotifications();

  const [todosLosJuegos, setTodosLosJuegos] = useState([]);
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar juegos (mismo criterio que Home: fijos + API)
  useEffect(() => {
    const cargar = async () => {
      try {
        const apiJuegos = await gameService.getAllGames();
        const normalizados = apiJuegos.map(g => ({
          _id: g._id,
          nombre: g.nombre ?? g.title ?? 'Sin nombre',
          precio: typeof g.precio === 'number' ? g.precio : Number(g.precio ?? 0),
          imagen: g.imagen ?? g.image ?? '/static/img/banner1.jpg',
        }));
        const todos = [...initialJuegosFijos, ...normalizados];
        setTodosLosJuegos(todos);
        setResultados(todos);
      } catch (e) {
        setError('No se pudieron cargar los juegos de la API.');
        notify.error('Error cargando juegos desde la API');
        // Fallback: solo fijos
        setTodosLosJuegos(initialJuegosFijos);
        setResultados(initialJuegosFijos);
      } finally {
        setLoading(false);
      }
    };
    cargar();

    const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '[]');
    setCarrito(carritoGuardado);
  }, []);

  // Filtrado por nombre
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResultados(todosLosJuegos); return; }
    setResultados(
      todosLosJuegos.filter(j => (j.nombre || '').toLowerCase().includes(q))
    );
  }, [query, todosLosJuegos]);

  const agregarAlCarrito = (juego) => {
    const nuevo = [...carrito, juego];
    setCarrito(nuevo);
    localStorage.setItem('carrito', JSON.stringify(nuevo));
    notify.success(`${juego.nombre} agregado al carrito`);
  };

  const GameCard = ({ juego }) => (
    <div className="col-md-4 mb-3">
      <div className="card h-100">
        <img src={juego.imagen || '/static/img/default.jpg'} className="card-img-top" alt={juego.nombre} />
        <div className="card-body text-center">
          <h5 className="card-title">{juego.nombre}</h5>
          <p className="card-text">Precio: ${Number(juego.precio).toFixed(2)}</p>
          <button className="btn btn-primary" onClick={() => agregarAlCarrito(juego)}>
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="container pt-5 mt-3"><p>Cargando juegos…</p></div>;
  }

  return (
    <div className="container pt-5 mt-3">
      <h2>Buscar Juegos</h2>

      <input
        type="text"
        className="form-control"
        placeholder="Buscar por nombre..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {error && <p className="mt-2 text-danger">{error}</p>}

      <div className="row mt-4">
        {resultados.length > 0 ? (
          resultados.map((juego, index) => <GameCard key={juego._id ?? index} juego={juego} />)
        ) : (
          <p>No se encontraron juegos que coincidan con "{query}".</p>
        )}
      </div>
    </div>
  );
};

export default Buscador;