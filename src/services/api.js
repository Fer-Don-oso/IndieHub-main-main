// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'https://indiehub-main-main-production.up.railway.app/api';

export const gameService = {
    // Obtener todos los juegos
    getAllGames: async () => {
        try {
            const response = await fetch(`${API_URL}/games`);
            if (!response.ok) throw new Error('Error al obtener juegos');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Crear un nuevo juego
    createGame: async (gameData) => {
        try {
            const response = await fetch(`${API_URL}/games`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameData)
            });
            if (!response.ok) throw new Error('Error al crear juego');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Obtener un juego por ID
    getGameById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/games/${id}`);
            if (!response.ok) throw new Error('Error al obtener juego');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Actualizar un juego
    updateGame: async (id, gameData) => {
        try {
            const response = await fetch(`${API_URL}/games/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameData)
            });
            if (!response.ok) throw new Error('Error al actualizar juego');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    },

    // Eliminar un juego
    deleteGame: async (id) => {
        try {
            const response = await fetch(`${API_URL}/games/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Error al eliminar juego');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
};

