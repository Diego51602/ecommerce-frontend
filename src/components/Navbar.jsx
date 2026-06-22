import { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../api/axios'

export default function Navbar() {
  const { user, logout, isAdmin } = useContext(AuthContext)
  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(0)

  const fetchCartCount = () => {
    if (user) {
      api.get('/cart').then(res => setCartCount(res.data.items?.length || 0)).catch(() => {})
    } else {
      setCartCount(0)
    }
  }

  useEffect(() => {
    fetchCartCount()
    window.addEventListener('cartUpdated', fetchCartCount)
    return () => window.removeEventListener('cartUpdated', fetchCartCount)
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">🛒 ShopDiego</Link>

        <div className="navbar-links">
          <Link to="/">Inicio</Link>
          {user && (
            <Link to="/cart" className="cart-link">
              Carrito {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}
          {user && <Link to="/orders">Mis Órdenes</Link>}
          {isAdmin && <Link to="/admin" className="admin-link">Admin</Link>}
        </div>

        <div className="navbar-auth">
          {user ? (
            <>
              <span className="navbar-user">Hola, {user.nombre}</span>
              <button onClick={handleLogout} className="btn-outline-sm">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline-sm">Entrar</Link>
              <Link to="/register" className="btn-primary-sm">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
