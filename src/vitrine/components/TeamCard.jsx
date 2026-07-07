import { motion } from 'framer-motion'
import { LinkedinIcon, TwitterIcon } from './ui/SocialIcons'
import Reveal from './ui/Reveal'

export default function TeamCard({ member, index }) {
  return (
    <Reveal direction="up" delay={(index % 4) * 0.08}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        className="rounded-2xl bg-pastel-lavender p-6 text-center flex flex-col items-center gap-3"
      >
        <img
          src={member.photo}
          alt={member.name}
          className="w-24 h-24 rounded-2xl object-cover shadow-md"
          loading="lazy"
        />
        <h3 className="font-display font-semibold text-ink">{member.name}</h3>
        <p className="text-sm text-slate-500">{member.role}</p>
        <div className="flex items-center gap-3 mt-1">
          {member.socials?.linkedin && (
            <a href={member.socials.linkedin} aria-label={`LinkedIn de ${member.name}`} className="text-slate-400 hover:text-teal-600">
              <LinkedinIcon width={18} height={18} />
            </a>
          )}
          {member.socials?.twitter && (
            <a href={member.socials.twitter} aria-label={`Twitter de ${member.name}`} className="text-slate-400 hover:text-teal-600">
              <TwitterIcon width={18} height={18} />
            </a>
          )}
        </div>
      </motion.div>
    </Reveal>
  )
}
