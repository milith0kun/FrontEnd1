const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { validateProducto, sanitizeProducto } = require('../validators/productoValidator');

// Obtener todos los productos con paginación y búsqueda
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM productos';
    let countQuery = 'SELECT COUNT(*) as total FROM productos';
    const params = [];

    if (search) {
      query += ' WHERE nombre LIKE ?';
      countQuery += ' WHERE nombre LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    
    const [rows] = await pool.query(query, [...params, parseInt(limit), parseInt(offset)]);
    const [countResult] = await pool.query(countQuery, params);
    
    res.json({
      success: true,
      data: rows,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (isNaN(id)) {
      const error = new Error('ID debe ser un número válido');
      error.statusCode = 400;
      throw error;
    }

    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (rows.length === 0) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
});

// Crear un nuevo producto
router.post('/', async (req, res, next) => {
  try {
    const validation = validateProducto(req.body);
    if (!validation.isValid) {
      const error = new Error('Datos de validación incorrectos');
      error.statusCode = 400;
      error.details = validation.errors;
      throw error;
    }

    const producto = sanitizeProducto(req.body);
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
      [producto.nombre, producto.precio, producto.stock]
    );
    
    res.status(201).json({ 
      success: true,
      message: 'Producto creado exitosamente',
      data: { id: result.insertId, ...producto }
    });
  } catch (err) {
    if (err.details) {
      return res.status(err.statusCode || 400).json({
        success: false,
        error: { message: err.message, details: err.details }
      });
    }
    next(err);
  }
});

// Actualizar un producto
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (isNaN(id)) {
      const error = new Error('ID debe ser un número válido');
      error.statusCode = 400;
      throw error;
    }

    const validation = validateProducto(req.body);
    if (!validation.isValid) {
      const error = new Error('Datos de validación incorrectos');
      error.statusCode = 400;
      error.details = validation.errors;
      throw error;
    }

    const producto = sanitizeProducto(req.body);
    const [result] = await pool.query(
      'UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?',
      [producto.nombre, producto.precio, producto.stock, id]
    );
    
    if (result.affectedRows === 0) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    res.json({ 
      success: true,
      message: 'Producto actualizado exitosamente'
    });
  } catch (err) {
    if (err.details) {
      return res.status(err.statusCode || 400).json({
        success: false,
        error: { message: err.message, details: err.details }
      });
    }
    next(err);
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (isNaN(id)) {
      const error = new Error('ID debe ser un número válido');
      error.statusCode = 400;
      throw error;
    }

    const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      const error = new Error('Producto no encontrado');
      error.statusCode = 404;
      throw error;
    }
    
    res.json({ 
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
