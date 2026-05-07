import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/products'
import './Footer.css'
import logo from '../assets/dc-logo.png'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__main">
        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <img src={logo} alt="Dcinformatik TEK" />
            <div>
              <div className="footer__logo-name">Dcinformatik</div>
              <div className="footer__logo-tag">La Technologie Autrement</div>
            </div>
          </Link>
          <p className="footer__tagline">
            Votre partenaire tech de confiance à Madagascar. Produits authentiques, prix imbattables, service irréprochable.
          </p>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="footer__fb"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            Dcinformatik TEK
          </a>
        </div>

        {/* Catégories */}
        <div className="footer__col">
          <h4>Catégories</h4>
          {CATEGORIES.filter(c => c.key !== 'all').map(c => (
            <Link key={c.key} to={`/produits?cat=${c.key}`}>{c.label}</Link>
          ))}
        </div>

        {/* Navigation */}
        <div className="footer__col">
          <h4>Navigation</h4>
          <Link to="/">Accueil</Link>
          <Link to="/produits">Tous les produits</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/admin">Espace Admin</Link>
        </div>

        {/* Contact */}
        <div className="footer__col">
          <h4>Informations</h4>
          <span>📍 Antananarivo, Madagascar</span>
          <span>⏰ Lun–Sam : 8h–18h</span>
          <span>📘 Facebook : Dcinformatik TEK</span>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© {new Date().getFullYear()} Dcinformatik TEK — Tous droits réservés</span>
          <span className="footer__made">Madagascar 🇲🇬</span>
        </div>
      </div>
    </footer>
  )
}
