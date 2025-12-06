# 🛒 Sistema de Gestión de Ventas

Sistema completo de gestión de ventas desarrollado con **React**, **Node.js/Express** y **MySQL**. Implementa buenas prácticas de UI/UX con diseño responsive y componentes reutilizables.

## 📋 Características

### Frontend
- ✅ **React 19** con Vite
- ✅ **Bootstrap 5** y React Bootstrap
- ✅ **React Router** para navegación
- ✅ **Chart.js** para gráficos estadísticos
- ✅ **SweetAlert2** para notificaciones
- ✅ **Axios** para peticiones HTTP
- ✅ Diseño responsive y accesible
- ✅ Sidebar colapsable
- ✅ Tema consistente con variables CSS

### Backend
- ✅ **Express 5** API REST
- ✅ **MySQL2** con conexión por pool
- ✅ **CORS** habilitado
- ✅ Middleware de manejo de errores
- ✅ Validaciones de datos
- ✅ Variables de entorno con dotenv

## 🖼️ Módulos Implementados

### 1. **Login**
- Autenticación de usuarios
- Validación de credenciales
- Diseño centrado y minimalista

### 2. **Dashboard**
- Tarjetas de estadísticas (Ventas, Pedidos, Clientes, Productos)
- Gráfico de ventas mensuales
- Panel de actividad reciente
- Diseño con iconos de react-icons

### 3. **Gestión de Productos**
- Listado con tabla responsive
- Crear, editar y eliminar productos
- Buscador de productos
- Modal para formularios
- Validaciones en tiempo real

### 4. **Gestión de Clientes**
- CRUD completo de clientes
- Información de contacto
- Validación de documentos únicos
- Interfaz consistente con productos

### 5. **Módulo de Ventas**
- Selección de cliente
- Agregado de productos al carrito
- Cálculo automático de totales
- Confirmación antes de guardar
- Resumen de venta

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- MySQL 8.0+
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone https://github.com/milith0kun/FrontEnd1.git
cd FrontEnd1
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=tu_contraseña
DB_NAME=db_ventas
DB_PORT=3306
PORT=3001
```

Importar base de datos:
```bash
mysql -u root -p < db/schema.sql
```

### 3. Configurar Frontend

```bash
cd frontend
npm install
```

## 🎮 Ejecutar el Proyecto

### Backend
```bash
cd backend
npm start
```
Servidor corriendo en: `http://localhost:3001`

### Frontend
```bash
cd frontend
npm run dev
```
Aplicación corriendo en: `http://localhost:5173`

## 🔐 Credenciales de Prueba

**Usuario:** `admin@test.com`  
**Contraseña:** `admin123`

## 📁 Estructura del Proyecto

```
├── backend/
│   ├── db/
│   │   ├── connection.js      # Configuración MySQL
│   │   └── schema.sql         # Esquema de BD
│   ├── middleware/
│   │   └── errorHandler.js    # Manejo de errores
│   ├── routes/
│   │   ├── auth.routes.js     # Autenticación
│   │   ├── productos.routes.js
│   │   ├── clientes.routes.js
│   │   └── ventas.routes.js
│   ├── validators/
│   │   └── productoValidator.js
│   ├── index.js               # Servidor Express
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ProductForm.jsx
│   │   │   └── ProductList.jsx
│   │   ├── layout/
│   │   │   └── Layout.jsx     # Layout con sidebar
│   │   ├── pages/             # Páginas principales
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Productos.jsx
│   │   │   ├── Clientes.jsx
│   │   │   └── Ventas.jsx
│   │   ├── services/
│   │   │   └── api.js         # Configuración Axios
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## 🎨 Buenas Prácticas UI/UX Implementadas

### Diseño Responsive
- Sistema de grillas Bootstrap
- Breakpoints para móvil, tablet y desktop
- Sidebar colapsable automático en móviles

### Consistencia Visual
- Paleta de colores definida en `:root`
- Tipografía uniforme (Inter)
- Espaciado consistente
- Componentes con mismo patrón visual

### Accesibilidad
- Contraste adecuado (WCAG AA)
- Labels descriptivos en formularios
- Navegación por teclado
- Iconos con significado semántico

### Feedback Visual
- Loading states en botones
- Confirmaciones con SweetAlert2
- Mensajes de error claros
- Estados hover y active en elementos interactivos

## 🛠️ Tecnologías Utilizadas

### Frontend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 19.1.1 | Framework principal |
| Vite | 7.1.14 | Build tool |
| Bootstrap | 5.3.8 | Framework CSS |
| React Router | 7.9.6 | Enrutamiento |
| Chart.js | 4.5.1 | Gráficos |
| Axios | 1.13.2 | Cliente HTTP |
| SweetAlert2 | 11.26.3 | Notificaciones |

### Backend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | 18+ | Runtime |
| Express | 5.1.0 | Framework web |
| MySQL2 | 3.15.3 | Driver MySQL |
| CORS | 2.8.5 | Middleware CORS |
| dotenv | 17.2.3 | Variables de entorno |

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

### Productos
- `GET /api/productos` - Listar productos
- `GET /api/productos/:id` - Obtener producto
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Ventas
- `GET /api/ventas` - Listar ventas
- `POST /api/ventas` - Registrar venta
- `GET /api/ventas/:id` - Obtener venta

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run test

# Backend (si existen tests)
cd backend
npm test
```

## 📝 Autor

**Edmil Jampier Saire Bustamante**  
Curso: Desarrollo de Software I  
Universidad: [Tu Universidad]  
Fecha: Diciembre 2025

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📞 Soporte

Para reportar bugs o solicitar features, abre un issue en:  
https://github.com/milith0kun/FrontEnd1/issues

---

⭐ Si te gustó el proyecto, dale una estrella en GitHub!
