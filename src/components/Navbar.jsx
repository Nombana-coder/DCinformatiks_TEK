import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import Logo from '../assets/dc-logo.png'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/produits?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setMobileOpen(false)
    }
  }

  return (
    <>
      {/* ── MAIN NAV ── */}
      <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">

          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <img src={Logo} alt="DC-Informatik Logo" className="navbar__logo-img" />
            <div className="navbar__logo-text">
              <span className="navbar__logo-name">Dcinformatik</span>
              <span className="navbar__logo-tag">La Technologie Autrement</span>
            </div>
          </Link>

          {/* Links */}
          <ul className="navbar__links">
            <li><NavLink to="/" end>Accueil</NavLink></li>
            <li><NavLink to="/produits">Produits</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul>

          {/* Search */}
          <form className="navbar__search" onSubmit={handleSearch}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </form>

          {/* CTA */}
          <Link to="/produits" className="btn btn--primary btn--sm navbar__cta">
            Voir les offres
          </Link>

          {/* Burger */}
          <button className="navbar__burger" onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
            <span className={mobileOpen ? 'open' : ''}/>
            <span className={mobileOpen ? 'open' : ''}/>
            <span className={mobileOpen ? 'open' : ''}/>
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`navbar__mobile${mobileOpen ? ' open' : ''}`}>
        <form onSubmit={handleSearch} className="navbar__mobile-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        </form>
        <NavLink to="/" end onClick={() => setMobileOpen(false)}>Accueil</NavLink>
        <NavLink to="/produits" onClick={() => setMobileOpen(false)}>Produits</NavLink>
        <NavLink to="/contact" onClick={() => setMobileOpen(false)}>Contact</NavLink>
        <NavLink to="/admin" onClick={() => setMobileOpen(false)}>Admin</NavLink>
      </div>
    </>
  )
}
