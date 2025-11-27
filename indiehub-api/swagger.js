// indiehub-api/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IndieHub API',
      version: '1.0.0',
      description: 'API para gestionar juegos indie',
    },
    servers: [{ url: 'http://localhost:5000', description: 'Dev' }],
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);