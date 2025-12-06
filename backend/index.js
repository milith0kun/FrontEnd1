const express = require('express');
const cors = require('cors');
const pool = require('./db/connection');
const productosRoutes = require('./routes/productos.routes');
const { errorHandler, notFound, requestLogger } = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// Rutas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/productos', productosRoutes);
app.use('/api/clientes', require('./routes/clientes.routes'));
app.use('/api/ventas', require('./routes/ventas.routes'));

// Middleware de rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores (debe ser el último)
app.use(errorHandler);

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`✓ Servidor corriendo en http://localhost:${port}`);
    console.log(`✓ Health check disponible en http://localhost:${port}/health`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Puerto ${port} ocupado, intentando con ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
};

async function start() {
  try {
    // Verificar conexión a la base de datos antes de iniciar el servidor
    await pool.query('SELECT 1');
    console.log('✓ Conexión a la base de datos exitosa');

    const initialPort = process.env.PORT || 3001;
    startServer(initialPort);

  } catch (err) {
    console.error('✗ Error al conectar con la base de datos:', err);
    process.exit(1);
  }
}

start();
