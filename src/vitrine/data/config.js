// Configuration centrale du site vitrine — modifiez ici, pas dans les composants.
export const CONFIG = {
  SITE_NAME: 'Dijital',
  // URL de connexion à la plateforme de suivi des étudiants.
  // Reste une route relative tant que la plateforme vit dans le même déploiement ;
  // remplacez par une URL absolue (https://app.dijital.com/login) si elle est déployée séparément.
  LOGIN_URL: '/login',
  // Numéro WhatsApp au format international, sans "+" ni espaces (placeholder à remplacer).
  WHATSAPP_NUMBER: '221771234567',
  WHATSAPP_MESSAGE: "Bonjour Dijital, je souhaite en savoir plus sur vos services.",
  CONTACT_EMAIL: 'contact@dijital.com',
  CONTACT_PHONE: '+221 77 123 45 67',
  ADDRESS: 'Dakar, Sénégal',
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
