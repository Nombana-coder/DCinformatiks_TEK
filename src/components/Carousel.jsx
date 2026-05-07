import { useState, useEffect } from 'react'
import './Carousel.css'

export default function Carousel({ items = [], autoPlay = true, interval = 5000 }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!autoPlay || items.length === 0) return

    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % items.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, items.length, interval])

  if (items.length === 0) return null

  const goToPrevious = () => {
    setCurrent(prev => (prev - 1 + items.length) % items.length)
  }

  const goToNext = () => {
    setCurrent(prev => (prev + 1) % items.length)
  }

  const goToSlide = (index) => {
    setCurrent(index)
  }

  return (
    <div className="carousel">
      <div className="carousel__container">
        {items.map((item, index) => (
          <div
            key={index}
            className={`carousel__slide ${index === current ? 'active' : ''}`}
          >
            <img src={item.image} alt={item.name} />
            {item.overlay && (
              <div className="carousel__overlay">
                <div className="carousel__content">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={goToPrevious}
        className="carousel__control carousel__control--prev"
        aria-label="Slide précédent"
      >
        ‹
      </button>
      <button
        onClick={goToNext}
        className="carousel__control carousel__control--next"
        aria-label="Slide suivant"
      >
        ›
      </button>

      <div className="carousel__indicators">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`carousel__dot ${index === current ? 'active' : ''}`}
            aria-label={`Aller au slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
