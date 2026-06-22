import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  const fetchCart = () =>
    api.get('/cart').then(res => { setCart(res.data); setLoading(false) })

  useEffect(() => { fetchCart() }, [])

  const removeItem = async (itemId) => {
    await api.delete(`/cart/remove/${itemId}`)
    fetchCart()
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const updateItem = async (itemId, cantidad) => {
    if (cantidad < 1) return removeItem(itemId)
    try {
      await api.put(`/cart/update/${itemId}?cantidad=${cantidad}`)
      fetchCart()
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error al actualizar')
    }
  }

  const checkout = async () => {
    try {
      await api.post('/orders/checkout')
      setMsg('✓ ¡Orden creada exitosamente!')
      window.dispatchEvent(new Event('cartUpdated'))
      setTimeout(() => navigate('/orders'), 1800)
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error al procesar la orden')
    }
  }

  if (loading) return <div className="loading">Cargando carrito...</div>

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Mi Carrito</h1>

        {!cart?.items?.length ? (
          <div className="empty-state">
            <p>Tu carrito está vacío</p>
            <button className="btn-primary" onClick={() => navigate('/')}>Ver productos</button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-placeholder">{item.nombre[0]}</div>
                  <div className="cart-item-info">
                    <h3>{item.nombre}</h3>
                    <p className="muted text-sm">${item.precio.toLocaleString('es-MX')}</p>
                  </div>
                  <div className="quantity-control">
                    <button onClick={() => updateItem(item.id, item.cantidad - 1)}>−</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => updateItem(item.id, item.cantidad + 1)}>+</button>
                  </div>
                  <p className="cart-item-subtotal">${item.subtotal.toLocaleString('es-MX')}</p>
                  <button className="btn-danger" onClick={() => removeItem(item.id)}>✕</button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Resumen del pedido</h2>
              <div className="summary-row">
                <span className="muted">Productos ({cart.items.length})</span>
                <span>${cart.total.toLocaleString('es-MX')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total</span>
                <span className="gold text-xl">${cart.total.toLocaleString('es-MX')}</span>
              </div>
              {msg && (
                <div className={msg.startsWith('✓') ? 'alert-success' : 'alert-error'}>{msg}</div>
              )}
              <button className="btn-primary btn-full" onClick={checkout}>
                Finalizar compra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
