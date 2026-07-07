import SectionHeading from './ui/SectionHeading'
import TestimonialCarousel from './TestimonialCarousel'
import { DotGrid } from './ui/FloatingShapes'

export default function Testimonials() {
  return (
    <section id="temoignages" className="relative py-20 sm:py-28 bg-white overflow-hidden">
      <DotGrid className="absolute top-10 right-6 text-teal-200/70 hidden sm:block" rows={5} cols={5} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          eyebrow="Témoignages"
          title="Ce qu'ils en pensent"
          description="Étudiants et partenaires témoignent de leur expérience avec Dijital."
        />
        <div className="mt-16">
          <TestimonialCarousel />
        </div>
      </div>
    </section>
  )
}
