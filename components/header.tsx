'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/brand'
import { navItems } from '@/lib/site'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('inicio')

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const closeOnDesktop = () => { if (window.innerWidth > 640) setOpen(false) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', closeOnDesktop)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', closeOnDesktop)
    }
  }, [open])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlights the menu link of the section currently in the middle of the screen.
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id)
    }), { rootMargin: '-45% 0px -50% 0px' })
    navItems.forEach(([, id]) => { const section = document.getElementById(id); if (section) observer.observe(section) })
    return () => observer.disconnect()
  }, [])

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}
      <div className="container navbar-inner">
        <a className="navbar-brand" href="#inicio" aria-label="Anviti Tecnologia, voltar ao início"><Logo light /></a>
        <nav id="menu-principal" className={open ? 'nav-links nav-open' : 'nav-links'}>
          {navItems.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'is-active' : undefined}
              aria-current={active === id ? 'true' : undefined}
              onClick={() => { setActive(id); setOpen(false) }}
            >
              {label}
            </a>
          ))}
        </nav>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="menu-principal" onClick={() => setOpen(!open)} aria-label={open ? 'Fechar menu' : 'Abrir menu'}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  )
}
