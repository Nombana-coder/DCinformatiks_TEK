import { useState } from 'react'
import './Contact.css'

const INFO = [
  { icon: '📍', label: 'Adresse', value: 'Antananarivo, Madagascar' },
  { icon: '📘', label: 'Facebook', value: 'Dcinformatik TEK', href: 'https://facebook.com' },
  { icon: '⏰', label: 'Horaires', value: 'Lun–Samedi : 8h–18h' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const handleSubmit = e => { e.preventDefault(); setSent(true) }

  return (
    <main className="contact-page page-wrap">

      <div className="contact-hero section--soft">
        <div className="container">
          <div className="sec-header__label" style={{display:'inline-block', marginBottom:'8px'}}>Contact</div>
          <h1 className="contact-hero__title">Parlons Technologie</h1>
          <p className="contact-hero__sub">Notre équipe est disponible pour vous conseiller et prendre vos commandes.</p>
        </div>
      </div>

      <div className="container contact-body">

        {/* About */}
        <div className="about-card">
          <div className="about-card__text">
            <div className="sec-header__label" style={{display:'inline-block', marginBottom:'12px'}}>À propos</div>
            <h2 className="about-card__title">Dcinformatik TEK</h2>
            <p>Fondée à Antananarivo, Dcinformatik TEK est votre revendeur tech de confiance à Madagascar. Nous proposons une large gamme de produits informatiques, smartphones, équipements gaming et accessoires — toujours authentiques, toujours aux meilleurs prix.</p>
            <p>Notre mission : rendre la technologie accessible à tous les Malgaches, avec un service client irréprochable et une équipe d'experts passionnés.</p>
          </div>
          <div className="about-card__perks">
            {[
              { icon: '🛡️', t: 'Produits authentiques', d: '100% originaux, garantie constructeur' },
              { icon: '🚀', t: 'Livraison rapide', d: 'Express dans Antananarivo' },
              { icon: '💬', t: 'Conseil expert', d: "Disponibles pour vous guider" },
            ].map(w => (
              <div key={w.t} className="about-perk">
                <span>{w.icon}</span>
                <div>
                  <div className="about-perk__title">{w.t}</div>
                  <div className="about-perk__desc">{w.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Grid */}
        <div className="contact-grid">

          {/* Info */}
          <div className="contact-info">
            <h3 className="contact-info__title">Informations</h3>
            <div className="info-items">
              {INFO.map(i => (
                <div key={i.label} className="info-item">
                  <div className="info-item__icon">{i.icon}</div>
                  <div>
                    <div className="info-item__label">{i.label}</div>
                    {i.href
                      ? <a href={i.href} target="_blank" rel="noreferrer" className="info-item__val info-item__val--link">{i.value}</a>
                      : <div className="info-item__val">{i.value}</div>}
                  </div>
                </div>
              ))}
            </div>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="contact-fb-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              Retrouvez-nous sur Facebook
            </a>
          </div>

          {/* Form */}
          <div className="contact-form-card">
            {sent ? (
              <div className="contact-success">
                <div className="contact-success__icon">✅</div>
                <h3>Message envoyé !</h3>
                <p>Notre équipe vous répondra dans les plus brefs délais.</p>
                <button className="btn btn--outline" onClick={() => setSent(false)} style={{marginTop:'16px'}}>
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <>
                <h3 className="contact-form-card__title">Envoyez-nous un message</h3>
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="cf-row">
                    <div className="cf-group">
                      <label htmlFor="name">Nom complet *</label>
                      <input id="name" name="name" type="text" placeholder="Votre nom" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="cf-group">
                      <label htmlFor="phone">Téléphone</label>
                      <input id="phone" name="phone" type="tel" placeholder="+261 XX XX XXX XX" value={form.phone} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="cf-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" placeholder="votre@email.com" value={form.email} onChange={handleChange} />
                  </div>
                  <div className="cf-group">
                    <label htmlFor="subject">Sujet *</label>
                    <select id="subject" name="subject" value={form.subject} onChange={handleChange} required>
                      <option value="">Sélectionnez...</option>
                      <option>Passer une commande</option>
                      <option>Demande de devis</option>
                      <option>Renseignement produit</option>
                      <option>Service après-vente</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <div className="cf-group">
                    <label htmlFor="message">Message *</label>
                    <textarea id="message" name="message" rows={5} placeholder="Décrivez votre besoin..." value={form.message} onChange={handleChange} required />
                  </div>
                  <button type="submit" className="btn btn--primary" style={{width:'100%', justifyContent:'center'}}>
                    Envoyer
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
