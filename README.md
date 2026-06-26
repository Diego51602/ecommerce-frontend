# E-Commerce Frontend

Aplicacion web de comercio electronico construida con React y Vite. Consume la API REST del proyecto ecommerce-api y cuenta con autenticacion JWT, carrito de compras, historial de ordenes y panel de administracion.

## Tecnologias

- React 19
- Vite
- React Router v6
- Axios
- Context API

## Funcionalidades

**Usuario**
- Registro e inicio de sesion
- Catalogo de productos con filtro por categoria, buscador y ordenamiento
- Vista de detalle de producto con selector de cantidad
- Carrito de compras con control de cantidades
- Historial de ordenes con estado en tiempo real

**Administrador**
- Panel de administracion con pestanas Productos y Ordenes
- Crear y eliminar productos
- Actualizar el estado de cualquier orden

## Estructura del proyecto

```
src/
  api/          Configuracion de Axios e interceptores
  components/   Navbar, ProductCard, PrivateRoute, AdminRoute
  context/      AuthContext para manejo de sesion
  pages/        HomePage, LoginPage, RegisterPage, ProductDetailPage, CartPage, OrdersPage, AdminPage
```

## Variables de entorno

```
VITE_API_URL=https://tu-api.onrender.com
```

## Correr localmente

```bash
git clone https://github.com/Diego51602/ecommerce-frontend
npm install
npm run dev
```

Requiere tener la API corriendo. Ver: github.com/Diego51602/ecommerce-api-

## Demo

https://ecommerce-frontend-rose-gamma.vercel.app

Credenciales admin: admin@ecommerce.com / admin123
