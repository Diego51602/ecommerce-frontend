import { useState, useEffect } from 'react'
import api from '../api/axios'

const STATUS_COLOR = {
  PENDIENTE: '#f59e0b',
  CONFIRMADO: '#3b82f6',
  ENVIADO: '#8b5cf6',
  ENTREGADO: '#10b981',
  CANCELADO: '#ef4444',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders').then(res => { setOrders(res.data); setLoading(false) })
  }, [])

  if (loading) return <div className="loading">Cargando órdenes...</div>

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Mis Órdenes</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <p>No tienes órdenes aún.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const color = STATUS_COLOR[order.status] || '#888'
              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <p style={{ fontWeight: 700 }}>Orden #{order.id}</p>
                      <p className="muted text-sm" style={{ marginTop: '4px' }}>
                        {new Date(order.fecha).toLocaleDateString('es-MX', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span
                      className="badge"
                      style={{ background: color + '22', color, border: `1px solid ${color}44` }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="order-items">
                    {order.items.map((item, i) => (
                      <div key={i} className="order-item-row">
                        <span>{item.nombre} <span className="muted">×{item.cantidad}</span></span>
                        <span className="muted">${item.subtotal.toLocaleString('es-MX')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <span className="muted">Total</span>
                    <span className="gold" style={{ fontSize: '18px', fontWeight: 800 }}>
                      ${order.total.toLocaleString('es-MX')}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
