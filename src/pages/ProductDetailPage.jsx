import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { AuthContext } from '../context/AuthContext'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/products/${id}`).then(res => {
      setProduct(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const addToCart = async () => {
    if (!user) { navigate('/login'); return }
    try {
      await api.post('/cart/add', { productId: product.id, cantidad })
      setMsg('✓ Producto agregado al carrito')
      window.dispatchEvent(new Event('cartUpdated'))
      setTimeout(() => setMsg(''), 3000)
    } catch (err) {
      setMsg(err.response?.data?.error || 'Error al agregar al carrito')
    }
  }

  if (loading) return <div className="loading">Cargando...</div>
  if (!product) return <div className="loading">Producto no encontrado</div>

  return (
    <div className="page">
      <div className="container">
        <button className="btn-back" onClick={() => navigate(-1)}>← Volver al catálogo</button>

        <div className="product-detail">
          <div className="product-detail-image">
            {product.imagenUrl
              ? <img src={product.imagenUrl} alt={product.nombre} />
              : <div className="product-placeholder-lg">{product.nombre[0]}</div>
            }
          </div>

          <div className="product-detail-info">
            <span className="product-category">{product.categoriaNombre}</span>
            <h1 className="product-detail-name">{product.nombre}</h1>
            {product.descripcion && (
              <p className="product-detail-desc">{product.descripcion}</p>
            )}
            <p className="product-detail-price">${product.precio.toLocaleString('es-MX')}</p>
            <p className="product-detail-stock">
              {product.stock > 0
                ? <span className="stock-ok">En stock: {product.stock} unidades</span>
                : <span className="stock-out">Sin stock disponible</span>
              }
            </p>

            {product.stock > 0 && (
              <div>
                <p className="muted" style={{ fontSize: '13px', marginBottom: '8px' }}>Cantidad</p>
                <div className="quantity-control">
                  <button onClick={() => setCantidad(c => Math.max(1, c - 1))}>−</button>
                  <span>{cantidad}</span>
                  <button onClick={() => setCantidad(c => Math.min(product.stock, c + 1))}>+</button>
                </div>
              </div>
            )}

            {msg && (
              <div className={msg.startsWith('✓') ? 'alert-success' : 'alert-error'}>{msg}</div>
            )}

            <button
              className="btn-primary btn-full"
              onClick={addToCart}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
