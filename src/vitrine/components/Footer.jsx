import logo from '../../assets/vitrine/logo-dijital.png'
import { CONFIG } from '../data/config'
import { NAV_LINKS } from '../data/nav'
import { SERVICES } from '../data/services'
import { LinkedinIcon, TwitterIcon, InstagramIcon, FacebookIcon } from './ui/SocialIcons'
import { Mail, Phone, MapPin } from 'lucide-react'

const SOCIAL_ICONS = [
  { key: 'linkedin', Icon: LinkedinIcon },
  { key: 'twitter', Icon: TwitterIcon },
  { key: 'instagram', Icon: InstagramIcon },
  { key: 'facebook', Icon: FacebookIcon }
]

export default function Footer() {
  return (
    <footer className="bg-ink text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <img src={logo} alt="Dijital" className="h-12 w-auto" />
          <p className="text-sm text-slate-400 mt-4 max-w-xs">
            Formation, développement logiciel et solutions IA — Dijital accompagne votre transformation
            numérique.
          </p>
          <div className="flex items-center gap-3 mt-5">
            {SOCIAL_ICONS.map(({ key, Icon }) => (
              <a
                key={key}
                href={CONFIG.SOCIALS[key]}
                aria-label={key}
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal-500 transition-colors"
              >
                <Icon width={16} height={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Liens rapides</h4>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-teal-400 transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            {SERVICES.slice(0, 5).map((service) => (
              <li key={service.id}>
                <a href="#services" className="hover:text-teal-400 transition-colors">
                  {service.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Coordonnées</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-teal-400" /> {CONFIG.CONTACT_EMAIL}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-teal-400" /> {CONFIG.CONTACT_PHONE}
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-teal-400" /> {CONFIG.ADDRESS}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {CONFIG.SITE_NAME}. Tous droits réservés.
      </div>
    </footer>
  )
}
