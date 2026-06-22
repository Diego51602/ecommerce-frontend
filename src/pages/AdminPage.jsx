import { useState, useEffect } from 'react'
import api from '../api/axios'

const STATUSES = ['PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO']

export default function AdminPage() {
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '', imagenUrl: '', categoryId: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/products'),
      api.get('/categories'),
      api.get('/orders/all'),
    ]).then(([p, c, o]) => {
      setProducts(p.data)
      setCategories(c.data)
      setOrders(o.data)
      setLoading(false)
    })
  }, [])

  const createProduct = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/products', {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio),
        stock: parseInt(form.stock),
        imagenUrl: form.imagenUrl || null,
        categoryId: parseInt(form.categoryId),
      })
      setProducts(prev => [...prev, data])
      setForm({ nombre: '', descripcion: '', precio: '', stock: '', imagenUrl: '', categoryId: '' })
      showMsg('✓ Producto creado correctamente')
    } catch (err) {
      showMsg(err.response?.data?.error || 'Error al crear producto', true)
    }
  }

  const deleteProduct = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    await api.delete(`/products/${id}`)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const updateStatus = async (orderId, status) => {
    const { data } = await api.put(`/orders/${orderId}/status`, { status })
    setOrders(prev => prev.map(o => o.id === orderId ? data : o))
  }

  const showMsg = (text, isError = false) => {
    setMsg({ text, isError })
    setTimeout(() => setMsg(''), 3000)
  }

  if (loading) return <div className="loading">Cargando panel...</div>

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Panel Admin</h1>

        <div className="admin-tabs">
          <button className={`tab-btn ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
            Productos ({products.length})
          </button>
          <button className={`tab-btn ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>
            Órdenes ({orders.length})
          </button>
        </div>

        {tab === 'products' && (
          <>
            <div className="form-card">
              <h3>Nuevo Producto</h3>
              {msg && (
                <div className={msg.isError ? 'alert-error' : 'alert-success'} style={{ marginBottom: '16px' }}>
                  {msg.text}
                </div>
              )}
              <form onSubmit={createProduct}>
                <div className="form-grid">
                  <input className="input" placeholder="Nombre del producto" value={form.nombre}
                    onChange={e => setForm({ ...form, nombre: e.target.value })} required />
                  <select className="input" value={form.categoryId}
                    onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
                    <option value="">Seleccionar categoría</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                  <input className="input" type="number" placeholder="Precio (MXN)" value={form.precio}
                    onChange={e => setForm({ ...form, precio: e.target.value })} required min="0" step="0.01" />
                  <input className="input" type="number" placeholder="Stock" value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })} required min="0" />
                  <input className="input" placeholder="Descripción" value={form.descripcion}
                    onChange={e => setForm({ ...form, descripcion: e.target.value })} />
                  <input className="input" placeholder="URL de imagen (opcional)" value={form.imagenUrl}
                    onChange={e => setForm({ ...form, imagenUrl: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>
                  + Agregar Producto
                </button>
              </form>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="muted">{p.id}</td>
                    <td style={{ fontWeight: 600 }}>{p.nombre}</td>
                    <td><span className="gold" style={{ fontSize: '12px' }}>{p.categoriaNombre}</span></td>
                    <td className="gold">${p.precio.toLocaleString('es-MX')}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button className="btn-danger" onClick={() => deleteProduct(p.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'orders' && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className="muted">{order.id}</td>
                  <td>{order.userEmail}</td>
                  <td className="muted text-sm">
                    {new Date(order.fecha).toLocaleDateString('es-MX')}
                  </td>
                  <td className="muted text-sm">{order.items.length} item(s)</td>
                  <td className="gold">${order.total.toLocaleString('es-MX')}</td>
                  <td>
                    <select
                      className="status-select"
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value)}
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
