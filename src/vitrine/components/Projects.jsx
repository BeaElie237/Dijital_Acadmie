import SectionHeading from './ui/SectionHeading'
import ProjectCard from './ProjectCard'
import { PROJECTS } from '../data/projects'

export default function Projects() {
  return (
    <section id="solutions" className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Nos réalisations"
          title="Solutions & projets"
          description="Un aperçu de projets réalisés par nos équipes et nos étudiants."
        />

        <div className="mt-16 grid sm:grid-cols-2 gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
