const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Login endpoint
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            const error = new Error('Usuario y contraseña son requeridos');
            error.statusCode = 400;
            throw error;
        }

        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ? AND password = ?',
            [username, password]
        );

        if (rows.length === 0) {
            const error = new Error('Credenciales inválidas');
            error.statusCode = 401;
            throw error;
        }

        const user = rows[0];
        delete user.password;

        res.json({
            success: true,
            message: 'Login exitoso',
            user: user
        });

    } catch (err) {
        next(err);
    }
});

// Register endpoint (for testing/setup)
router.post('/register', async (req, res, next) => {
    const { nombre, email, password } = req.body;
    try {
        if (!nombre || !email || !password) {
            const error = new Error('Todos los campos son requeridos');
            error.statusCode = 400;
            throw error;
        }

        const [result] = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
            [nombre, email, password]
        );

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            userId: result.insertId
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error('El email ya está registrado');
            error.statusCode = 409;
            return next(error);
        }
        next(err);
    }
});

module.exports = router;
