import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
  const navigate = useNavigate()

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="product-image">
        {product.imagenUrl
          ? <img src={product.imagenUrl} alt={product.nombre} />
          : <div className="product-placeholder">{product.nombre[0]}</div>
        }
      </div>
      <div className="product-info">
        <span className="product-category">{product.categoriaNombre}</span>
        <h3 className="product-name">{product.nombre}</h3>
        <p className="product-price">${product.precio.toLocaleString('es-MX')}</p>
        <p className="product-stock">
          {product.stock > 0
            ? <span className="stock-ok">✓ En stock ({product.stock})</span>
            : <span className="stock-out">Agotado</span>
          }
        </p>
        <button className="btn-card">Ver detalle →</button>
      </div>
    </div>
  )
}
