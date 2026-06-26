import { useState, useEffect } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('default')

  useEffect(() => {
    Promise.all([api.get('/products'), api.get('/categories')]).then(([p, c]) => {
      setProducts(p.data)
      setCategories(c.data)
      setLoading(false)
    })
  }, [])

  const filtered = products
    .filter(p => selected ? p.categoriaId === selected : true)
    .filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => {
      switch (orden) {
        case 'asc':
          return a.precio - b.precio
        case 'desc':
          return b.precio - a.precio
        case 'nombre_az':
          return a.nombre.localeCompare(b.nombre)
        default:
          return 0
      }
    })

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
          <div className="search-sort">
            <input
              className="input"
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />

            <select value={orden} onChange={e => setOrden(e.target.value)}>
              <option value="default">Ordenar por defecto</option>
              <option value="asc">Precio: Menor a Mayor</option>
              <option value="desc">Precio: Mayor a Menor</option>
              <option value="nombre_az">Nombre A-Z</option>
            </select>
          </div>
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
