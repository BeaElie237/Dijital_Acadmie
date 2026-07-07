import { useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import StatsBanner from './components/StatsBanner'
import Services from './components/Services'
import About from './components/About'
import Projects from './components/Projects'
import Team from './components/Team'
import Testimonials from './components/Testimonials'
import ContactCTA from './components/ContactCTA'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import { CONFIG } from './data/config'

export default function VitrineHome() {
  useEffect(() => {
    document.title = `${CONFIG.SITE_NAME} — Formations, logiciels sur mesure & solutions IA`
  }, [])

  return (
    <div className="font-body text-ink antialiased">
      <Header />
      <main>
        <Hero />
        <StatsBanner />
        <Services />
        <About />
        <Projects />
        <Team />
        <Testimonials />
        <ContactCTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
