// Configuration centrale du site vitrine — modifiez ici, pas dans les composants.
export const CONFIG = {
  SITE_NAME: 'Dijital',
  // URL de connexion à la plateforme de suivi des étudiants.
  // Reste une route relative tant que la plateforme vit dans le même déploiement ;
  // remplacez par une URL absolue (https://app.dijitalconsulting.com/login) si elle est déployée séparément.
  LOGIN_URL: '/login',
  // Numéro WhatsApp au format international, sans "+" ni espaces.
  // Ligne de la responsable du service communication.
  WHATSAPP_NUMBER: '237655599463',
  WHATSAPP_MESSAGE: "Bonjour Dijital, je souhaite en savoir plus sur vos services.",
  CONTACT_EMAIL: 'contact@dijitalconsulting.com',
  CONTACT_PHONE: '+237 655 599 463',
  ADDRESS: 'Château Ngoa Ekele, Yaoundé, Cameroun',
  // Lien de partage Google Maps (bouton "Voir sur Google Maps").
  MAPS_URL: 'https://maps.app.goo.gl/R8prAzm3mfoxC6rP9',
  // URL d'intégration (iframe) construite à partir du plus code, sans clé API.
  MAPS_EMBED_URL: 'https://www.google.com/maps?q=VG43%2BJQ4+Yaound%C3%A9+Cameroun&output=embed',
  SOCIALS: {
    linkedin: 'https://linkedin.com/company/dijital',
    twitter: 'https://twitter.com/dijital',
    instagram: 'https://instagram.com/dijital',
    facebook: 'https://facebook.com/dijital'
  }
}

export function buildWhatsAppUrl() {
  const text = encodeURIComponent(CONFIG.WHATSAPP_MESSAGE)
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${text}`
}
