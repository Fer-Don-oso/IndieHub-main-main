const express = require('express');
const Game = require('../models/Game');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - nombre
 *         - precio
 *         - imagen
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado del juego
 *         nombre:
 *           type: string
 *           description: Nombre del juego
 *         precio:
 *           type: number
 *           description: Precio del juego en USD
 *         imagen:
 *           type: string
 *           description: URL de la imagen del juego
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *       example:
 *         _id: 507f1f77bcf86cd799439011
 *         nombre: Hollow Knight
 *         precio: 14.99
 *         imagen: https://ejemplo.com/imagen.jpg
 *         createdAt: 2025-11-26T10:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: API para gestionar juegos
 */

/**
 * @swagger
 * /api/games:
 *   post:
 *     summary: Crear un nuevo juego
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - precio
 *               - imagen
 *             properties:
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *               imagen:
 *                 type: string
 *             example:
 *               nombre: Celeste
 *               precio: 19.99
 *               imagen: https://ejemplo.com/celeste.jpg
 *     responses:
 *       201:
 *         description: Juego creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       400:
 *         description: Error en los datos enviados
 */
router.post('/', async (req, res) => {
    const game = new Game(req.body);
    try {
        const savedGame = await game.save();
        res.status(201).json(savedGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Obtener todos los juegos
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: Lista de todos los juegos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     summary: Obtener un juego por ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del juego
 *     responses:
 *       200:
 *         description: Juego encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Juego no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) return res.status(404).json({ message: 'Juego no encontrado' });
        res.json(game);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/games/{id}:
 *   put:
 *     summary: Actualizar un juego
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del juego
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *               imagen:
 *                 type: string
 *             example:
 *               nombre: Hollow Knight Deluxe
 *               precio: 24.99
 *               imagen: https://ejemplo.com/imagen-actualizada.jpg
 *     responses:
 *       200:
 *         description: Juego actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Juego no encontrado
 *       400:
 *         description: Error en los datos enviados
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedGame) return res.status(404).json({ message: 'Juego no encontrado' });
        res.json(updatedGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * @swagger
 * /api/games/{id}:
 *   delete:
 *     summary: Eliminar un juego
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del juego
 *     responses:
 *       200:
 *         description: Juego eliminado exitosamente
 *       404:
 *         description: Juego no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedGame = await Game.findByIdAndDelete(req.params.id);
        if (!deletedGame) return res.status(404).json({ message: 'Juego no encontrado' });
        res.json({ message: 'Juego eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

