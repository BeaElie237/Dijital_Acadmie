import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import Reveal from './ui/Reveal'
import LikeButton from './LikeButton'

export default function ProjectCard({ project, index }) {
  return (
    <Reveal direction="up" delay={(index % 2) * 0.1}>
      <motion.article
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg overflow-hidden h-full flex flex-col"
      >
        <img
          src={project.image}
          alt={`Aperçu du projet ${project.name}`}
          className="w-full h-44 object-cover"
          loading="lazy"
        />
        <div className="p-6 flex flex-col gap-3 flex-1">
          <h3 className="font-display font-semibold text-lg text-ink">{project.name}</h3>
          <p className="text-sm text-slate-500 flex-1">{project.description}</p>

          <div className="flex items-center gap-2 flex-wrap">
            {project.collaborators.map((name) => (
              <span key={name} className="text-xs bg-slate-100 text-slate-600 rounded-full px-2.5 py-1">
                {name}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
            <a
              href={project.demoUrl}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700"
            >
              Voir la démo <ExternalLink size={14} />
            </a>
            <LikeButton projectId={project.id} baseLikes={project.baseLikes} />
          </div>
        </div>
      </motion.article>
    </Reveal>
  )
}
