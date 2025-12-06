// Test CRUD para /api/productos
const http = require('http');

const baseUrl = 'http://localhost:3001/api/productos';
let createdId = null;

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const fullPath = path.startsWith('/') ? `/api/productos${path}` : `/api/productos/${path}`;
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: fullPath,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('=== PRUEBAS CRUD API PRODUCTOS ===\n');

  try {
    // Test 1: POST - Crear producto
    console.log('1. POST /api/productos - Crear producto');
    const createRes = await request('POST', '/', {
      nombre: 'Laptop Lenovo',
      precio: 3200.50,
      stock: 10
    });
    console.log(`   Status: ${createRes.status}`);
    console.log(`   Respuesta:`, createRes.data);
    createdId = createRes.data.id;
    console.log('');

    // Test 2: GET - Obtener todos
    console.log('2. GET /api/productos - Obtener todos');
    const getAllRes = await request('GET', '/');
    console.log(`   Status: ${getAllRes.status}`);
    console.log(`   Total productos: ${getAllRes.data.length}`);
    console.log(`   Productos:`, getAllRes.data);
    console.log('');

    // Test 3: GET - Obtener por ID
    console.log(`3. GET /api/productos/${createdId} - Obtener por ID`);
    const getByIdRes = await request('GET', `/${createdId}`);
    console.log(`   Status: ${getByIdRes.status}`);
    console.log(`   Respuesta:`, getByIdRes.data);
    console.log('');

    // Test 4: PUT - Actualizar
    console.log(`4. PUT /api/productos/${createdId} - Actualizar producto`);
    const updateRes = await request('PUT', `/${createdId}`, {
      nombre: 'Laptop Lenovo ThinkPad',
      precio: 3500.00,
      stock: 15
    });
    console.log(`   Status: ${updateRes.status}`);
    console.log(`   Respuesta:`, updateRes.data);
    console.log('');

    // Test 5: Verificar actualización
    console.log(`5. GET /api/productos/${createdId} - Verificar actualización`);
    const verifyRes = await request('GET', `/${createdId}`);
    console.log(`   Status: ${verifyRes.status}`);
    console.log(`   Respuesta:`, verifyRes.data);
    console.log('');

    // Test 6: DELETE - Eliminar
    console.log(`6. DELETE /api/productos/${createdId} - Eliminar producto`);
    const deleteRes = await request('DELETE', `/${createdId}`);
    console.log(`   Status: ${deleteRes.status}`);
    console.log(`   Respuesta:`, deleteRes.data);
    console.log('');

    console.log('=== TODAS LAS PRUEBAS COMPLETADAS ===');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

runTests();
