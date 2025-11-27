import React, { useState, useEffect } from 'react';
import { gameService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../components/NotificationProvider';

const Upload = () => {
  const navigate = useNavigate();
  const notify = useNotifications();

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [loading, setLoading] = useState(false);

  const [juegos, setJuegos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: '', precio: '', imagen: '' });
  const [error, setError] = useState('');

  const cargarJuegos = async () => {
    try {
      setError('');
      const data = await gameService.getAllGames();
      // Normaliza claves si hicieran falta
      const normalizados = data.map(g => ({
        _id: g._id,
        nombre: g.nombre ?? g.title ?? 'Sin nombre',
        precio: typeof g.precio === 'number' ? g.precio : Number(g.precio ?? 0),
        imagen: g.imagen ?? g.image ?? '/static/img/banner1.jpg',
      }));
      setJuegos(normalizados);
    } catch (e) {
      setError('No se pudieron cargar los juegos. Verifica el servidor API.');
    }
  };

  useEffect(() => {
    cargarJuegos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const precioFloat = parseFloat(precio);
    if (!nombre || !precioFloat || !imagen) {
      notify.error('Completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      await gameService.createGame({ nombre, precio: precioFloat, imagen });
      setNombre(''); setPrecio(''); setImagen('');
      await cargarJuegos();
      notify.success('Juego subido exitosamente');
      navigate('/');
    } catch (error) {
      notify.error('Error al subir el juego. Verifica la API.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const comenzarEdicion = (j) => {
    setEditandoId(j._id);
    setEditForm({ nombre: j.nombre, precio: String(j.precio), imagen: j.imagen });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEditForm({ nombre: '', precio: '', imagen: '' });
  };

  const guardarEdicion = async () => {
    const precioFloat = parseFloat(editForm.precio);
    if (!editForm.nombre || !precioFloat || !editForm.imagen) {
      notify.error('Completa todos los campos de edición.');
      return;
    }
    try {
      await gameService.updateGame(editandoId, { nombre: editForm.nombre, precio: precioFloat, imagen: editForm.imagen });
      await cargarJuegos();
      cancelarEdicion();
      notify.info('Juego actualizado');
    } catch (e) {
      notify.error('Error al actualizar el juego');
      console.error(e);
    }
  };

  const eliminarJuego = async (id) => {
    const ok = confirm('¿Eliminar este juego?');
    if (!ok) return;
    try {
      await gameService.deleteGame(id);
      await cargarJuegos();
      notify.info('Juego eliminado');
    } catch (e) {
      notify.error('Error al eliminar el juego');
      console.error(e);
    }
  };

  const filtrados = juegos.filter(j =>
    j.nombre.toLowerCase().includes(busqueda.toLowerCase().trim())
  );

  return (
    <main className="container my-5 d-flex flex-column align-items-center">
      <h2 className="mb-4 text-center">Sube tu juego indie</h2>

      {/* Formulario de alta */}
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="mb-3">
          <label htmlFor="nombreJuego" className="form-label">Nombre del juego</label>
          <input type="text" className="form-control" id="nombreJuego"
            value={nombre} onChange={(e) => setNombre(e.target.value)} required disabled={loading} />
        </div>
        <div className="mb-3">
          <label htmlFor="precioJuego" className="form-label">Precio (USD)</label>
          <input type="number" className="form-control" id="precioJuego" min="0" step="0.01"
            value={precio} onChange={(e) => setPrecio(e.target.value)} required disabled={loading} />
        </div>
        <div className="mb-3">
          <label htmlFor="imagenJuego" className="form-label">URL de la imagen</label>
          <input type="url" className="form-control" id="imagenJuego"
            value={imagen} onChange={(e) => setImagen(e.target.value)} required disabled={loading} />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Subiendo...' : 'Subir juego'}
        </button>
      </form>

      {/* Búsqueda */}
      <div className="card p-3 w-100 mb-3" style={{ maxWidth: '800px' }}>
        <div className="d-flex align-items-center gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="btn btn-outline-secondary" onClick={cargarJuegos}>Refrescar</button>
        </div>
        {error && <p className="mt-2 text-danger">{error}</p>}
      </div>

      {/* Lista, edición y eliminación */}
      <div className="w-100" style={{ maxWidth: '800px' }}>
        {filtrados.length === 0 ? (
          <p className="text-center">No hay juegos para mostrar.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 g-3">
            {filtrados.map(j => (
              <div className="col" key={j._id}>
                <div className="card h-100">
                  <img src={j.imagen} className="card-img-top" alt={j.nombre} />
                  <div className="card-body">
                    {editandoId === j._id ? (
                      <>
                        <div className="mb-2">
                          <label className="form-label">Nombre</label>
                          <input className="form-control"
                            value={editForm.nombre}
                            onChange={e => setEditForm(s => ({ ...s, nombre: e.target.value }))} />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Precio (USD)</label>
                          <input type="number" min="0" step="0.01" className="form-control"
                            value={editForm.precio}
                            onChange={e => setEditForm(s => ({ ...s, precio: e.target.value }))} />
                        </div>
                        <div className="mb-2">
                          <label className="form-label">Imagen (URL)</label>
                          <input className="form-control"
                            value={editForm.imagen}
                            onChange={e => setEditForm(s => ({ ...s, imagen: e.target.value }))} />
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-success" onClick={guardarEdicion}>Guardar</button>
                          <button className="btn btn-secondary" onClick={cancelarEdicion}>Cancelar</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h5 className="card-title">{j.nombre}</h5>
                        <p className="card-text mb-2">${Number(j.precio).toFixed(2)}</p>
                        <div className="d-flex gap-2">
                          <button className="btn btn-outline-primary" onClick={() => comenzarEdicion(j)}>Editar</button>
                          <button className="btn btn-outline-danger" onClick={() => eliminarJuego(j._id)}>Eliminar</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Upload;