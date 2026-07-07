import SectionHeading from './ui/SectionHeading'
import TeamCard from './TeamCard'
import { TEAM } from '../data/team'

export default function Team() {
  return (
    <section id="equipe" className="py-20 sm:py-28 bg-pastel-rose/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="L'équipe"
          title="Les personnes derrière"
          accentWord="Dijital"
          description="Une équipe pluridisciplinaire passionnée par la formation et la technologie."
        />

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {TEAM.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
