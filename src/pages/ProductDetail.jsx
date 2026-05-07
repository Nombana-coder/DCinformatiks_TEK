import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProductById, getRelatedProducts, formatPrice } from '../data/products'
import ProductCard from '../components/ProductCard'
import './ProductDetail.css'

function Stars({ rating, size = 16 }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? '#f5a623' : 'none'}
          stroke={i <= Math.round(rating) ? '#f5a623' : '#d1d5db'}
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

const BADGE_CLASS = {
  'NOUVEAU':  'badge--new',
  'OFFRE':    'badge--offer',
  'EPIC':     'badge--epic',
  'POPULAIRE':'badge--popular',
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProductById(id)
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState('specs')

  useEffect(() => {
    window.scrollTo({ top: 0 })
    setActiveImg(0)
  }, [id])

  if (!product) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Produit non trouvé</h2>
        <Link to="/" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  // Normaliser les images pour qu'elles soient toujours un tableau
  const images = Array.isArray(product.images) 
    ? product.images 
    : (product.image ? [product.image] : (product.images ? [product.images] : []));

  const mainImage = images[activeImg] || product.image || 'https://via.placeholder.com/600x400?text=Image+non+disponible';

  const related = getRelatedProducts(product)

  return (
    <main className="page-wrap detail-page">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Accueil</Link>
          <span>›</span>
          <Link to="/produits">Produits</Link>
          <span>›</span>
          <Link to={`/produits?cat=${product.category}`}>{product.category}</Link>
          <span>›</span>
          <span>{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="detail-main">

          {/* Gallery */}
          <div className="detail-gallery">
            <div className="detail-gallery__main">
              <img
                src={mainImage}
                alt={product.name}
                className="detail-gallery__img"
              />
              {product.badge && (
              <span className={`badge ${BADGE_CLASS[product.badge] || 'badge--popular'} detail-gallery__badge`}>
                {product.badge}
              </span>
            )}
            </div>
            {images.length > 1 && (
              <div className="detail-gallery__thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`detail-gallery__thumb${activeImg === i ? ' active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`Vue ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-info__brand">{product.brand} · {product.subcategory}</div>
            <h1 className="detail-info__name">{product.name}</h1>

            <p className="detail-info__desc">{product.description}</p>

            {/* Price */}
            <div className="detail-info__pricing">
              <div className="detail-info__price">{formatPrice(product.price)}</div>
              {product.oldPrice && (
                <div className="detail-info__old">{formatPrice(product.oldPrice)}</div>
              )}
              {product.oldPrice && (
                <div className="detail-info__saving">
                  -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </div>
              )}
            </div>

            {/* Stock */}
            <div className={`detail-info__stock${product.stock <= 3 ? ' low' : ''}`}>
              {product.stock <= 3
                ? `⚠️ Plus que ${product.stock} en stock`
                : `✓ En stock (${product.stock} disponibles)`}
            </div>

            {/* CTA */}
            <div className="detail-info__actions">
              <Link to="/contact" className="btn btn--primary btn--lg detail-cta">
                Commander ce produit
              </Link>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn--outline btn--lg"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Commander via Facebook
              </a>
            </div>

            {/* Guarantees */}
            <div className="detail-info__guarantees">
              <div className="detail-guarantee">
                <span>🛡️</span>
                <span>Produit authentique garanti</span>
              </div>
              <div className="detail-guarantee">
                <span>🚀</span>
                <span>Livraison à Antananarivo</span>
              </div>
              <div className="detail-guarantee">
                <span>💬</span>
                <span>Support client disponible</span>
              </div>
            </div>
          </div>
        </div>

        {/* TABS — Specs & Description */}
        <div className="detail-tabs">
          <div className="detail-tabs__nav">
            {['specs', 'description'].map(tab => (
              <button
                key={tab}
                className={`detail-tabs__tab${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'specs' ? 'Caractéristiques' : 'Description'}
              </button>
            ))}
          </div>

          <div className="detail-tabs__body">
            {activeTab === 'specs' ? (
              <div className="specs-table">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="specs-table__row">
                    <span className="specs-table__key">{key}</span>
                    <span className="specs-table__val">{val}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="detail-desc-text">{product.description}</p>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {related.length > 0 && (
          <div className="detail-related">
            <div className="home-sec-head" style={{marginBottom:'24px'}}>
              <div className="sec-header" style={{marginBottom:0}}>
                <div className="sec-header__label">Même catégorie</div>
                <h2 className="sec-header__title">Produits similaires</h2>
              </div>
              <Link to={`/produits?cat=${product.category}`} className="btn btn--outline btn--sm">Voir tout →</Link>
            </div>
            <div className="prod-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
