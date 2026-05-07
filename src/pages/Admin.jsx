import { useState, useEffect } from 'react'
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES, formatPrice } from '../data/products'
import './Admin.css'

const EMPTY_PRODUCT = {
  id: null, name: '', brand: '', category: 'laptops', subcategory: '',
  price: '', oldPrice: '', stock: '',
  image: '', shortDesc: '', description: '',
  images: [], specs: {},
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [pwd, setPwd] = useState('')
  const [pwdError, setPwdError] = useState(false)

  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('dc_products')
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS
    } catch { return INITIAL_PRODUCTS }
  })

  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [modal, setModal] = useState(null) // null | 'add' | 'edit' | 'delete'
  const [editProduct, setEditProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [specsInput, setSpecsInput] = useState('')
  const [toast, setToast] = useState(null)

  // Persist to localStorage
  useEffect(() => {
    if (authenticated) {
      localStorage.setItem('dc_products', JSON.stringify(products))
    }
  }, [products, authenticated])

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(t)
    }
  }, [toast])

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const handleLogin = (e) => {
    e.preventDefault()
    if (pwd === 'admin123') {
      setAuthenticated(true)
      setPwdError(false)
    } else {
      setPwdError(true)
    }
  }

  const filteredProducts = products.filter(p => {
    const matchCat = catFilter === 'all' || p.category === catFilter
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const openAdd = () => {
    setForm({ ...EMPTY_PRODUCT, id: Date.now() })
    setSpecsInput('')
    setModal('add')
  }

  const openEdit = (p) => {
    setForm({ ...p, price: String(p.price), oldPrice: p.oldPrice ? String(p.oldPrice) : '', stock: String(p.stock) })
    setSpecsInput(Object.entries(p.specs || {}).map(([k, v]) => `${k}: ${v}`).join('\n'))
    setEditProduct(p)
    setModal('edit')
  }

  const openDelete = (p) => {
    setDeleteTarget(p)
    setModal('delete')
  }

  const closeModal = () => {
    setModal(null)
    setEditProduct(null)
    setDeleteTarget(null)
  }

  const handleFormChange = (field, val) => {
    setForm(f => ({ ...f, [field]: val }))
  }

  const parseSpecs = (text) => {
    const specs = {}
    text.split('\n').forEach(line => {
      const i = line.indexOf(':')
      if (i > 0) {
        specs[line.slice(0, i).trim()] = line.slice(i + 1).trim()
      }
    })
    return specs
  }

  const handleSave = () => {
    if (!form.name || !form.brand || !form.price) {
      showToast('Nom, marque et prix sont requis.', 'error')
      return
    }
    const specs = parseSpecs(specsInput)
    const product = {
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock: Number(form.stock) || 0,
      specs,
      images: form.image ? [form.image] : [],
      rating: 4.5,
      reviewCount: 0,
      badge: null,
    }
    if (modal === 'add') {
      setProducts(prev => [product, ...prev])
      showToast(`"${product.name}" ajouté avec succès !`)
    } else {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p))
      showToast(`"${product.name}" mis à jour !`)
    }
    closeModal()
  }

  const handleDelete = () => {
    setProducts(prev => prev.filter(p => p.id !== deleteTarget.id))
    showToast(`"${deleteTarget.name}" supprimé.`, 'warning')
    closeModal()
  }

  const handleStockQuickEdit = (id, delta) => {
    setProducts(prev => prev.map(p =>
      p.id === id ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) } : p
    ))
  }

  const resetToDefaults = () => {
    if (confirm('Réinitialiser tous les produits aux données par défaut ?')) {
      setProducts(INITIAL_PRODUCTS)
      localStorage.removeItem('dc_products')
      showToast('Données réinitialisées.')
    }
  }

  const exportProductsAsJS = () => {
    const jsContent = `// ============================================================
//  Dcinformatik TEK — Base de données produits
//  Images: liens Unsplash (libres de droits)
// ============================================================

export const PRODUCTS = ${JSON.stringify(products, null, 2)}

export const CATEGORIES = [
  { key: 'all', label: 'Tous les produits' },
  { key: 'laptops', label: 'Laptops' },
  { key: 'smartphones', label: 'Smartphones' },
  { key: 'tablettes', label: 'Tablettes' },
  { key: 'gaming', label: 'Gaming' },
  { key: 'moniteurs', label: 'Moniteurs' },
  { key: 'imprimantes', label: 'Imprimantes' },
  { key: 'accessoires', label: 'Accessoires' },
]

export const REVIEWS = [
  {
    id: 1,
    name: 'Rakoto Jean-Pierre',
    location: 'Antananarivo',
    rating: 5,
    product: 'Samsung Galaxy S24 Ultra',
    comment: "Service impeccable et produit 100% authentique. La livraison était rapide et l'emballage soigné. Je recommande vivement Dcinformatik TEK à tous mes proches.",
    date: 'Mars 2024',
    avatar: 'RJ',
  },
  {
    id: 2,
    name: 'Ravelo Miora',
    location: 'Antananarivo',
    rating: 5,
    product: 'ASUS ROG Strix G16',
    comment: "J'ai commandé via Facebook et tout s'est passé parfaitement. Le laptop gaming était au meilleur prix du marché. L'équipe m'a bien conseillé sur le modèle adapté à mes besoins.",
    date: 'Février 2024',
    avatar: 'RM',
  },
  {
    id: 3,
    name: 'Andriantsoa F.',
    location: 'Antananarivo',
    rating: 4,
    product: 'HP EliteBook 840',
    comment: "Très satisfait de mon achat. Le produit correspond exactement à la description. Prix compétitif et vendeur sérieux. Un seul bémol : le délai de livraison un peu plus long que prévu.",
    date: 'Janvier 2024',
    avatar: 'AF',
  },
  {
    id: 4,
    name: 'Tsiry Rakotoarisoa',
    location: 'Antananarivo',
    rating: 5,
    product: 'Samsung Odyssey G5',
    comment: "Magnifique moniteur gaming, les couleurs sont bluffantes ! Dcinformatik TEK est ma référence pour tout ce qui est tech à Madagascar. Professionnels et de confiance.",
    date: 'Décembre 2023',
    avatar: 'TR',
  },
  {
    id: 5,
    name: 'Hery Andriamaro',
    location: 'Antananarivo',
    rating: 5,
    product: 'iPhone 15 Pro Max',
    comment: "Livraison le jour même après commande le matin, c'est exceptionnel ! L'iPhone est évidemment parfait. Je reviendrai certainement pour mes prochains achats tech.",
    date: 'Novembre 2023',
    avatar: 'HA',
  },
]

export function formatPrice(p) {
  return p.toLocaleString('fr-MG') + ' Ar'
}

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id))
}
`
    const blob = new Blob([jsContent], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'products.js'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast('Fichier products.js exporté ! Remplacez le fichier src/data/products.js')
  }

  // ─── LOGIN SCREEN ───────────────────────────────────────
  if (!authenticated) {
    return (
      <main className="admin-login page-wrap">
        <div className="admin-login__box">
          <div className="admin-login__logo">⚙️</div>
          <h1 className="admin-login__title">Espace Admin</h1>
          <p className="admin-login__sub">Dcinformatik TEK — Gestion du stock</p>
          <form onSubmit={handleLogin} className="admin-login__form">
            <div className={`admin-login__field${pwdError ? ' error' : ''}`}>
              <label>Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={pwd}
                onChange={e => { setPwd(e.target.value); setPwdError(false) }}
                autoFocus
              />
              {pwdError && <span className="admin-login__err">Mot de passe incorrect</span>}
            </div>
            <button type="submit" className="btn btn--primary" style={{width:'100%', justifyContent:'center'}}>
              Se connecter
            </button>
          </form>
          <p className="admin-login__hint">Demo : <code>admin123</code></p>
        </div>
      </main>
    )
  }

  // ─── ADMIN DASHBOARD ────────────────────────────────────
  const totalProducts = products.length
  const lowStock = products.filter(p => (p.stock || 0) <= 3).length
  const totalValue = products.reduce((sum, p) => sum + p.price * (p.stock || 0), 0)

  return (
    <main className="admin-page page-wrap">
      {/* Toast */}
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>
          {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : '⚠'} {toast.msg}
        </div>
      )}

      <div className="container">

        {/* Header */}
        <div className="admin-header">
          <div>
            <h1 className="admin-header__title">Gestion du stock</h1>
            <p className="admin-header__sub">Dcinformatik TEK — Tableau de bord admin</p>
          </div>
          <div className="admin-header__actions">
            <button className="btn btn--outline btn--sm" onClick={exportProductsAsJS}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Exporter
            </button>
            <button className="btn btn--outline btn--sm" onClick={resetToDefaults}>Réinitialiser</button>
            <button className="btn btn--primary" onClick={openAdd}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Ajouter un produit
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat">
            <div className="admin-stat__val">{totalProducts}</div>
            <div className="admin-stat__label">Produits total</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat__val" style={{color: lowStock > 0 ? '#ea580c' : 'inherit'}}>{lowStock}</div>
            <div className="admin-stat__label">Stock faible (≤ 3)</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat__val" style={{fontSize:'1.1rem'}}>{formatPrice(totalValue)}</div>
            <div className="admin-stat__label">Valeur totale stock</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="search-input">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="admin-cat-pills">
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                className={`filter-pill${catFilter === c.key ? ' active' : ''}`}
                onClick={() => setCatFilter(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <tr key={p.id} className={p.stock <= 3 ? 'low-stock' : ''}>
                  <td>
                    <div className="admin-table__product">
                      <img src={p.image} alt={p.name} className="admin-table__thumb" />
                      <div>
                        <div className="admin-table__name">{p.name}</div>
                        <div className="admin-table__brand">{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="admin-table__cat">{p.category}</span>
                  </td>
                  <td>
                    <div className="admin-table__price">{formatPrice(p.price)}</div>
                    {p.oldPrice && <div className="admin-table__old">{formatPrice(p.oldPrice)}</div>}
                  </td>
                  <td>
                    <div className="admin-stock-ctrl">
                      <button className="admin-stock-btn" onClick={() => handleStockQuickEdit(p.id, -1)}>−</button>
                      <span className={`admin-stock-val${p.stock <= 3 ? ' low' : ''}`}>{p.stock}</span>
                      <button className="admin-stock-btn" onClick={() => handleStockQuickEdit(p.id, 1)}>+</button>
                    </div>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-btn admin-btn--edit" onClick={() => openEdit(p)}>
                        Modifier
                      </button>
                      <button className="admin-btn admin-btn--delete" onClick={() => openDelete(p)}>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="admin-empty">Aucun produit trouvé.</div>
          )}
        </div>
      </div>

      {/* ── MODAL ADD/EDIT ── */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>{modal === 'add' ? 'Ajouter un produit' : 'Modifier le produit'}</h2>
              <button className="admin-modal__close" onClick={closeModal}>✕</button>
            </div>
            <div className="admin-modal__body">
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label>Nom du produit *</label>
                  <input type="text" value={form.name} onChange={e => handleFormChange('name', e.target.value)} placeholder="Ex: ASUS ROG Strix G16" />
                </div>
                <div className="admin-form-group">
                  <label>Marque *</label>
                  <input type="text" value={form.brand} onChange={e => handleFormChange('brand', e.target.value)} placeholder="Ex: ASUS" />
                </div>
                <div className="admin-form-group">
                  <label>Catégorie</label>
                  <select value={form.category} onChange={e => handleFormChange('category', e.target.value)}>
                    {CATEGORIES.filter(c => c.key !== 'all').map(c => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Sous-catégorie</label>
                  <input type="text" value={form.subcategory} onChange={e => handleFormChange('subcategory', e.target.value)} placeholder="Ex: Gaming, Professionnel..." />
                </div>
                <div className="admin-form-group">
                  <label>Prix (Ar) *</label>
                  <input type="number" value={form.price} onChange={e => handleFormChange('price', e.target.value)} placeholder="Ex: 4660000" />
                </div>
                <div className="admin-form-group">
                  <label>Ancien prix (Ar)</label>
                  <input type="number" value={form.oldPrice} onChange={e => handleFormChange('oldPrice', e.target.value)} placeholder="Laisser vide si pas de promo" />
                </div>
                <div className="admin-form-group">
                  <label>Stock</label>
                  <input type="number" value={form.stock} onChange={e => handleFormChange('stock', e.target.value)} placeholder="Ex: 5" />
                </div>
                <div className="admin-form-group admin-form-group--full">
                  <label>URL image principale</label>
                  <input type="text" value={form.image} onChange={e => handleFormChange('image', e.target.value)} placeholder="https://images.unsplash.com/..." />
                </div>
                <div className="admin-form-group admin-form-group--full">
                  <label>Description courte</label>
                  <input type="text" value={form.shortDesc} onChange={e => handleFormChange('shortDesc', e.target.value)} placeholder="Une ligne descriptive..." />
                </div>
                <div className="admin-form-group admin-form-group--full">
                  <label>Description complète</label>
                  <textarea rows={4} value={form.description} onChange={e => handleFormChange('description', e.target.value)} placeholder="Description détaillée du produit..." />
                </div>
                <div className="admin-form-group admin-form-group--full">
                  <label>Caractéristiques (format : Clé: Valeur, une par ligne)</label>
                  <textarea
                    rows={6}
                    value={specsInput}
                    onChange={e => setSpecsInput(e.target.value)}
                    placeholder={"Processeur: Intel Core i9\nRAM: 16 Go\nStockage: 1 To SSD"}
                    style={{fontFamily:'monospace', fontSize:'0.82rem'}}
                  />
                </div>
              </div>
            </div>
            <div className="admin-modal__footer">
              <button className="btn btn--outline" onClick={closeModal}>Annuler</button>
              <button className="btn btn--primary" onClick={handleSave}>
                {modal === 'add' ? 'Ajouter' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DELETE ── */}
      {modal === 'delete' && deleteTarget && (
        <div className="admin-modal-overlay" onClick={closeModal}>
          <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>Supprimer ce produit ?</h2>
              <button className="admin-modal__close" onClick={closeModal}>✕</button>
            </div>
            <div className="admin-modal__body">
              <div className="admin-delete-confirm">
                <img src={deleteTarget.image} alt={deleteTarget.name} />
                <div>
                  <div className="admin-delete-confirm__name">{deleteTarget.name}</div>
                  <div className="admin-delete-confirm__price">{formatPrice(deleteTarget.price)}</div>
                </div>
              </div>
              <p className="admin-delete-warn">Cette action est irréversible.</p>
            </div>
            <div className="admin-modal__footer">
              <button className="btn btn--outline" onClick={closeModal}>Annuler</button>
              <button className="btn btn--primary" style={{background:'var(--red)', borderColor:'var(--red)'}} onClick={handleDelete}>
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
