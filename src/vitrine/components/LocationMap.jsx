import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react'
import Reveal from './ui/Reveal'
import { CONFIG } from '../data/config'

export default function LocationMap() {
  return (
    <Reveal direction="up" delay={0.15} className="relative mt-12 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid sm:grid-cols-2">
        <div className="p-8 flex flex-col justify-center gap-4 text-left">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-teal-600">
            <MapPin size={14} /> Où nous trouver
          </span>
          <p className="text-ink font-display font-semibold text-lg">{CONFIG.ADDRESS}</p>
          <ul className="text-sm text-slate-500 space-y-2">
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-teal-500" /> {CONFIG.CONTACT_PHONE}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-teal-500" /> {CONFIG.CONTACT_EMAIL}
            </li>
          </ul>
          <a
            href={CONFIG.MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 mt-2"
          >
            Voir sur Google Maps <ExternalLink size={14} />
          </a>
        </div>

        <iframe
          title={`Localisation de ${CONFIG.SITE_NAME} — ${CONFIG.ADDRESS}`}
          src={CONFIG.MAPS_EMBED_URL}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-64 sm:h-full min-h-[220px] border-0"
        />
      </div>
    </Reveal>
  )
}
