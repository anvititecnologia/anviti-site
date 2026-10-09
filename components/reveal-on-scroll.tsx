'use client'

import { useEffect } from 'react'

// Fades in every `.reveal` element the first time it enters the screen.
export function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' })
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    document.documentElement.classList.add('reveal-ready')
    return () => observer.disconnect()
  }, [])
  return null
}
