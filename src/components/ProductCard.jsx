import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products'
import './ProductCard.css'

export default function ProductCard({ product: p }) {
  return (
    <Link to={`/produits/${p.id}`} className="prod-card">
      <div className="prod-card__img-wrap">
        <img src={p.image} alt={p.name} loading="lazy" />
      </div>
      <div className="prod-card__body">
        <div className="prod-card__brand">{p.brand}</div>
        <div className="prod-card__name">{p.name}</div>
        <div className="prod-card__desc">{p.shortDesc}</div>
        <div className="prod-card__footer">
          <div className="prod-card__price-wrap">
            <div className="prod-card__price">{formatPrice(p.price)}</div>
          </div>
          <div className="prod-card__cta">Voir →</div>
        </div>
      </div>
    </Link>
  )
}
