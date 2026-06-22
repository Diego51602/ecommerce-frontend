import { useState, useEffect } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/categories')]).then(([p, c]) => {
      setProducts(p.data)
      setCategories(c.data)
      setLoading(false)
    })
  }, [])

  const filtered = selected
    ? products.filter(p => p.categoriaId === selected)
    : products

  if (loading) return <div className="loading">Cargando productos...</div>

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Catálogo</h1>
          <p>Explora nuestra selección de productos</p>
        </div>

        <div className="category-filters">
          <button
            className={`filter-btn ${!selected ? 'active' : ''}`}
            onClick={() => setSelected(null)}
          >
            Todos ({products.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${selected === cat.id ? 'active' : ''}`}
              onClick={() => setSelected(cat.id)}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No hay productos en esta categoría.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
