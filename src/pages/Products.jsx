import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PRODUCTS, CATEGORIES, formatPrice } from '../data/products'
import ProductCard from '../components/ProductCard'
import './Products.css'

const SORT_OPTIONS = [
  { key: 'default', label: 'Par défaut' },
  { key: 'price-asc', label: 'Prix croissant' },
  { key: 'price-desc', label: 'Prix décroissant' },
  { key: 'rating', label: 'Mieux notés' },
  { key: 'name', label: 'Nom A–Z' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sort, setSort] = useState('default')
  const [search, setSearch] = useState(searchParams.get('q') || '')

  const activeCat = searchParams.get('cat') || 'all'

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  // Sync URL search param → input
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setSearch(q)
  }, [searchParams])

  const setCat = (cat) => {
    const params = {}
    if (cat !== 'all') params.cat = cat
    if (search) params.q = search
    setSearchParams(params)
  }

  const handleSearch = (val) => {
    setSearch(val)
    const params = {}
    if (activeCat !== 'all') params.cat = activeCat
    if (val.trim()) params.q = val.trim()
    setSearchParams(params)
  }

  const filtered = useMemo(() => {
    let list = [...PRODUCTS]
    if (activeCat !== 'all') list = list.filter(p => p.cat === activeCat || p.category === activeCat)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    switch (sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break
      case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break
    }
    return list
  }, [activeCat, search, sort])

  const activeCatLabel = CATEGORIES.find(c => c.key === activeCat)?.label || 'Tous les produits'

  return (
    <main className="products-page page-wrap">

      {/* ── PAGE HEADER ── */}
      <div className="prod-page-header section--soft">
        <div className="container">
          <h1 className="prod-page-header__title">{activeCatLabel}</h1>
          <p className="prod-page-header__sub">{filtered.length} produit{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="container prod-page-body">

        {/* ── FILTER BAR (TechLand-style) ── */}
        <div className="filter-bar">
          <div className="filter-bar__cats">
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                className={`filter-pill${activeCat === c.key ? ' active' : ''}`}
                onClick={() => setCat(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="filter-bar__right">
            <div className="search-input">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
              />
              {search && (
                <button className="search-input__clear" onClick={() => handleSearch('')}>✕</button>
              )}
            </div>
            <div className="sort-wrap">
              <label>Trier :</label>
              <select value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(s => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── GRID ── */}
        {filtered.length > 0 ? (
          <div className="products-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="products-empty">
            <div className="products-empty__icon">🔍</div>
            <h3>Aucun résultat</h3>
            <p>Aucun produit pour "<strong>{search}</strong>"</p>
            <button onClick={() => { handleSearch(''); setCat('all') }} className="btn btn--outline" style={{marginTop:'16px'}}>
              Réinitialiser
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
