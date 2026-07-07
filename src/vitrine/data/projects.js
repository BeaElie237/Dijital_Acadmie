import projectSuivi from '../../assets/vitrine/projects/project-placeholder-1.svg'
import projectIa from '../../assets/vitrine/projects/project-placeholder-2.svg'
import projectErp from '../../assets/vitrine/projects/project-placeholder-3.svg'
import projectMobile from '../../assets/vitrine/projects/project-placeholder-4.svg'

// Projets réalisés — id sert de clé pour le stockage des likes (localStorage).
export const PROJECTS = [
  {
    id: 'suivi-stages',
    name: 'Plateforme de suivi des stages',
    description: "Suivi des étapes de stage, notation, présence par QR code et tableaux de bord en temps réel.",
    image: projectSuivi,
    demoUrl: '#',
    collaborators: ['Awa D.', 'Marc L.', 'Sofia M.'],
    baseLikes: 24
  },
  {
    id: 'assistant-ia',
    name: 'Assistant IA documentaire (RAG)',
    description: "Chatbot d'entreprise interrogeant une base documentaire interne avec un modèle local.",
    image: projectIa,
    demoUrl: '#',
    collaborators: ['Fatou N.', 'Ibrahima S.'],
    baseLikes: 17
  },
  {
    id: 'erp-pme',
    name: 'ERP sur mesure pour PME',
    description: "Gestion des stocks, facturation et ressources humaines dans une interface unifiée.",
    image: projectErp,
    demoUrl: '#',
    collaborators: ['Karim T.', 'Léa B.', 'Omar F.'],
    baseLikes: 31
  },
  {
    id: 'app-mobile-flutter',
    name: 'Application mobile de mise en relation',
    description: "App Flutter multiplateforme connectée à une API temps réel pour la mise en relation d'utilisateurs.",
    image: projectMobile,
    demoUrl: '#',
    collaborators: ['Nadia K.', 'Yann P.'],
    baseLikes: 9
  }
]
