const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Get all clients
router.get('/', async (req, res, next) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clientes ORDER BY id DESC');
        res.json({ success: true, data: rows });
    } catch (err) {
        next(err);
    }
});

// Create client
router.post('/', async (req, res, next) => {
    const { nombre, documento_identidad, direccion, telefono } = req.body;
    try {
        if (!nombre || !documento_identidad) {
            const error = new Error('Nombre y Documento de Identidad son requeridos');
            error.statusCode = 400;
            throw error;
        }

        const [result] = await pool.query(
            'INSERT INTO clientes (nombre, documento_identidad, direccion, telefono) VALUES (?, ?, ?, ?)',
            [nombre, documento_identidad, direccion, telefono]
        );

        res.status(201).json({
            success: true,
            message: 'Cliente registrado exitosamente',
            data: { id: result.insertId, ...req.body }
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error('El documento de identidad ya está registrado');
            error.statusCode = 409;
            return next(error);
        }
        next(err);
    }
});

// Update client
router.put('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { nombre, documento_identidad, direccion, telefono } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE clientes SET nombre = ?, documento_identidad = ?, direccion = ?, telefono = ? WHERE id = ?',
            [nombre, documento_identidad, direccion, telefono, id]
        );

        if (result.affectedRows === 0) {
            const error = new Error('Cliente no encontrado');
            error.statusCode = 404;
            throw error;
        }

        res.json({ success: true, message: 'Cliente actualizado exitosamente' });
    } catch (err) {
        next(err);
    }
});

// Delete client
router.delete('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM clientes WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            const error = new Error('Cliente no encontrado');
            error.statusCode = 404;
            throw error;
        }

        res.json({ success: true, message: 'Cliente eliminado exitosamente' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
