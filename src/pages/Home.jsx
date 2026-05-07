import { Link } from 'react-router-dom'
import { PRODUCTS, CATEGORIES, REVIEWS, formatPrice } from '../data/products'
import ProductCard from '../components/ProductCard'
import Carousel from '../components/Carousel'
import './Home.css'

// Get featured products (top 6 products sorted by review count)
const FEATURED = PRODUCTS.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 6)
const BEST_SELLERS = PRODUCTS.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4)

// Carousel items from featured products
const CAROUSEL_ITEMS = FEATURED.map(p => ({
  image: p.image,
  name: p.name,
  description: p.shortDesc,
}))

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24"
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

export default function Home() {
  return (
    <main className="home page-wrap">

      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero__left">
          <div className="hero__eyebrow">
            <span className="hero__dot" />
            Nouveautés disponibles
          </div>
          <h1 className="hero__title">
            Découvrez la<br />
            Technologie<br />
            <span className="hero__accent">de Demain</span>
          </h1>
          <p className="hero__sub">
            Laptops, smartphones, tablettes, moniteurs gaming et accessoires. Livraison à Antananarivo.
          </p>
          <div className="hero__actions">
            <Link to="/produits?cat=gaming" className="btn btn--primary btn--lg">
              Voir le catalogue
            </Link>
            <Link to="/produits" className="btn btn--outline btn--lg">
              Tout le catalogue
            </Link>
          </div>
          <div className="hero__badges">
            <div className="hero__trust">✓ Produits authentiques</div>
            <div className="hero__trust">✓ Meilleurs prix Madagascar</div>
            <div className="hero__trust">✓ Livraison rapide</div>
          </div>
        </div>

        <div className="hero__right">
          <Carousel items={CAROUSEL_ITEMS} autoPlay={true} interval={5000} />
        </div>
      </section>

      {/* ─── CATEGORY FILTER BAR ─── */}
      <section className="cat-bar section--soft">
        <div className="container cat-bar__inner">
          {CATEGORIES.filter(c => c.key !== 'all').map(c => (
            <Link key={c.key} to={`/produits?cat=${c.key}`} className="cat-bar__item">
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="section">
        <div className="container">
          <div className="home-sec-head">
            <div className="sec-header">
              <div className="sec-header__label">Sélection du moment</div>
              <h2 className="sec-header__title">Produits Vedettes</h2>
            </div>
            <Link to="/produits" className="btn btn--outline btn--sm">Voir tout →</Link>
          </div>

          <div className="prod-grid">
            {FEATURED.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ─── BEST SELLERS ─── */}
      <section className="section">
        <div className="container">
          <div className="home-sec-head">
            <div className="sec-header">
              <div className="sec-header__label">Les plus populaires</div>
              <h2 className="sec-header__title">Meilleures Ventes</h2>
            </div>
            <Link to="/produits" className="btn btn--outline btn--sm">Voir tout →</Link>
          </div>

          <div className="prod-grid">
            {BEST_SELLERS.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* ─── BANNER CTA ─── */}
      <section className="promo-band">
        <div className="container promo-band__inner">
          <div className="promo-band__text">
            <h2 className="promo-band__title">Besoin d'un conseil tech ?</h2>
            <p className="promo-band__sub">Contactez-nous sur WhatsApp ou via nos canaux de communication. Notre équipe vous guide pour trouver le produit idéal.</p>
          </div>
          <div className="promo-band__actions">
            <Link to="/contact" className="btn btn--primary">Nous contacter</Link>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="btn btn--outline" style={{background:'rgba(255,255,255,0.1)', borderColor:'rgba(255,255,255,0.25)', color:'#fff'}}>
              Facebook
            </a>
          </div>
        </div>
      </section>

      {/* ─── WHY US ─── */}
      <section className="section">
        <div className="container">
          <div className="sec-header" style={{textAlign:'center', marginBottom:'48px'}}>
            <div className="sec-header__label">Pourquoi nous choisir</div>
            <h2 className="sec-header__title">Notre Engagement</h2>
          </div>
          <div className="why-grid">
            {[
              { icon: '🛡️', t: 'Produits Authentiques', d: '100% originaux avec garantie constructeur.' },
              { icon: '💰', t: 'Meilleurs Prix', d: 'Les tarifs les plus compétitifs du marché malgache.' },
              { icon: '🚀', t: 'Livraison Rapide', d: 'Livraison express disponible à Antananarivo.' },
              { icon: '🎯', t: 'Expert & Conseil', d: 'Une équipe disponible pour vous accompagner.' },
            ].map(w => (
              <div key={w.t} className="why-card">
                <div className="why-card__icon">{w.icon}</div>
                <h3 className="why-card__title">{w.t}</h3>
                <p className="why-card__desc">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section className="section section--soft reviews-section">
        <div className="container">
          <div className="sec-header" style={{textAlign:'center', marginBottom:'48px'}}>
            <div className="sec-header__label">Ils nous font confiance</div>
            <h2 className="sec-header__title">Avis de nos clients</h2>
            <p className="sec-header__sub">Plus de 2 000 clients satisfaits à Madagascar</p>
          </div>
          <div className="reviews-grid">
            {REVIEWS.map(r => (
              <div key={r.id} className="review-card">
                <div className="review-card__top">
                  <div className="review-card__avatar">{r.avatar}</div>
                  <div>
                    <div className="review-card__name">{r.name}</div>
                    <div className="review-card__loc">{r.location} · {r.date}</div>
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <div className="review-card__product">{r.product}</div>
                <p className="review-card__comment">"{r.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
