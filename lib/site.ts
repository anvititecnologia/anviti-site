export const contact = {
  whatsapp: '5527995830403',
  whatsappLabel: '(27) 99583-0403',
  email: 'anviti.tecnologia@gmail.com',
  instagram: 'anviti.tecnologia',
}

export const navItems = [
  ['Início', 'inicio'],
  ['Serviços', 'servicos'],
  ['Sobre', 'sobre'],
  ['Contato', 'contato'],
] as const

export const instagramUrl = `https://instagram.com/${contact.instagram}`

export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${contact.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
