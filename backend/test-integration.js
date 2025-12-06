const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function testAPI() {
    try {
        console.log('--- Testing Backend API ---');

        // 1. Health Check
        try {
            const health = await axios.get('http://localhost:3001/health');
            console.log('✓ Health Check:', health.data.status);
        } catch (e) {
            console.error('✗ Health Check Failed');
            return;
        }

        // 2. Register & Login
        let userId;
        try {
            // Register
            try {
                const reg = await axios.post(`${API_URL}/auth/register`, {
                    nombre: 'Admin User',
                    email: 'admin@example.com',
                    password: 'password123'
                });
                userId = reg.data.userId;
                console.log('✓ Register User:', true);
            } catch (e) {
                if (e.response?.status === 409) {
                    console.log('✓ User already exists (skipping registration)');
                } else {
                    throw e;
                }
            }

            // Login
            const login = await axios.post(`${API_URL}/auth/login`, {
                username: 'admin@example.com',
                password: 'password123'
            });
            console.log('✓ Login:', login.data.success);
            userId = login.data.user.id;

        } catch (e) {
            console.error('✗ Auth Failed:', e.response?.data?.message || e.message);
            return;
        }

        // 3. Create Product
        let productId;
        try {
            const prod = await axios.post(`${API_URL}/productos`, {
                nombre: 'Test Product ' + Date.now(),
                precio: 50.00,
                stock: 100
            });
            console.log('✓ Create Product:', prod.data.success);
            productId = prod.data.data.id;
        } catch (e) {
            console.error('✗ Create Product Failed:', e.response?.data || e.message);
        }

        // 4. Get Products
        try {
            const prods = await axios.get(`${API_URL}/productos`);
            console.log('✓ Get Products:', prods.data.data.length > 0);
        } catch (e) {
            console.error('✗ Get Products Failed');
        }

        // 5. Create Client
        let clientId;
        try {
            const client = await axios.post(`${API_URL}/clientes`, {
                nombre: 'Test Client ' + Date.now(),
                documento_identidad: 'DOC' + Date.now(),
                direccion: 'Test Address',
                telefono: '555-0000'
            });
            console.log('✓ Create Client:', client.data.success);
            clientId = client.data.data.id;
        } catch (e) {
            console.error('✗ Create Client Failed:', e.response?.data || e.message);
        }

        // 6. Create Sale
        if (productId && clientId && userId) {
            try {
                const sale = await axios.post(`${API_URL}/ventas`, {
                    cliente_id: clientId,
                    usuario_id: userId,
                    items: [
                        { producto_id: productId, cantidad: 2, precio_unitario: 50.00, subtotal: 100.00 }
                    ],
                    total: 100.00
                });
                console.log('✓ Create Sale:', sale.data.success);
            } catch (e) {
                console.error('✗ Create Sale Failed:', e.response?.data || e.message);
            }
        }

        console.log('--- Test Complete ---');

    } catch (err) {
        console.error('Unexpected Error:', err.message);
    }
}

testAPI();
