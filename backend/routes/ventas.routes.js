const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Create a new sale
router.post('/', async (req, res, next) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { cliente_id, usuario_id, items, total } = req.body;

        if (!cliente_id || !usuario_id || !items || items.length === 0) {
            throw new Error('Datos de venta incompletos');
        }

        // 1. Create Sale
        const [ventaResult] = await connection.query(
            'INSERT INTO ventas (cliente_id, usuario_id, total) VALUES (?, ?, ?)',
            [cliente_id, usuario_id, total]
        );
        const ventaId = ventaResult.insertId;

        // 2. Insert Details and Update Stock
        for (const item of items) {
            // Check stock
            const [prodRows] = await connection.query('SELECT stock FROM productos WHERE id = ?', [item.producto_id]);
            if (prodRows.length === 0) throw new Error(`Producto ${item.producto_id} no encontrado`);
            if (prodRows[0].stock < item.cantidad) throw new Error(`Stock insuficiente para el producto ${item.producto_id}`);

            // Insert detail
            await connection.query(
                'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                [ventaId, item.producto_id, item.cantidad, item.precio_unitario, item.subtotal]
            );

            // Update stock
            await connection.query(
                'UPDATE productos SET stock = stock - ? WHERE id = ?',
                [item.cantidad, item.producto_id]
            );
        }

        await connection.commit();
        res.status(201).json({ success: true, message: 'Venta registrada exitosamente', ventaId });

    } catch (err) {
        await connection.rollback();
        next(err);
    } finally {
        connection.release();
    }
});

module.exports = router;
