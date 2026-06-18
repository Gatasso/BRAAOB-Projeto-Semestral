import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  { src: '/assets/ifsp-slide-3.png', alt: 'IFSP Campus 1' },
  { src: '/assets/ifsp-slide-2.png', alt: 'IFSP Campus 2' },
  { src: '/assets/ifsp-slide-1.png', alt: 'IFSP Campus 3' },
]

const AUTO_INTERVAL_MS = 3000

export interface LoginCarouselProps {
  className?: string
}

export function LoginCarousel({ className = '' }: LoginCarouselProps) {
  const [index, setIndex] = useState(0)

  const prev = () => setIndex((i) => (i === 0 ? SLIDES.length - 1 : i - 1))
  const next = () => setIndex((i) => (i === SLIDES.length - 1 ? 0 : i + 1))

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i === SLIDES.length - 1 ? 0 : i + 1))
    }, AUTO_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [])

  const arrowClass =
    'inline-flex items-center justify-center w-[99px] h-[99px] rounded-xl bg-primary text-white border-0 cursor-pointer hover:bg-primary-active transition-colors shadow-[0px_4px_3px_rgba(0,0,0,0.15)]'

  return (
    <div className={`relative w-full h-full min-h-screen overflow-hidden ${className}`}>
      {SLIDES.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-16">
        <button
          type="button"
          onClick={prev}
          className={arrowClass}
          aria-label="Slide anterior"
        >
          <ChevronLeft size={56} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={next}
          className={arrowClass}
          aria-label="Próximo slide"
        >
          <ChevronRight size={56} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
