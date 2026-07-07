import SectionHeading from './ui/SectionHeading'
import ServiceCard from './ServiceCard'
import { SERVICES } from '../data/services'

export default function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Nos expertises"
          title="Nos services"
          description="Un accompagnement complet, de l'apprentissage à la mise en production de vos projets."
        />

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
