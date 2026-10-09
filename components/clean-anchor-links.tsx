'use client'

import { useEffect } from 'react'

// Scrolls to in-page sections without leaving "#secao" in the address bar.
// The links keep their href, so they still work without JavaScript.
export function CleanAnchorLinks() {
  useEffect(() => {
    const cleanUrl = () => history.replaceState(null, '', window.location.pathname + window.location.search)

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as Element).closest('a')
      const href = link?.getAttribute('href')
      if (!href || link?.target === '_blank') return
      const match = href.match(/^\/?#(.*)$/)
      if (!match || (href.startsWith('/') && window.location.pathname !== '/')) return
      const target = match[1] ? document.getElementById(match[1]) : null
      if (match[1] && !target) return
      e.preventDefault()
      if (target) target.scrollIntoView({ behavior: 'smooth' })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
      cleanUrl()
    }

    // Links shared with a hash (e.g. /#contato) still land on the section, then the URL is cleaned.
    if (window.location.hash) {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)))
      if (target) requestAnimationFrame(() => target.scrollIntoView())
      // Next.js rewrites the URL right after hydration, so clean it a moment later.
      setTimeout(cleanUrl, 300)
    }

    // Hash changes inside the same page (e.g. edited in the address bar) are cleaned too.
    const onHashChange = () => { if (window.location.hash) cleanUrl() }

    document.addEventListener('click', onClick)
    window.addEventListener('hashchange', onHashChange)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])
  return null
}
