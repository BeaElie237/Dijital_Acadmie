export const STEP_NAMES = [
  'Recherche du thème',
  'Première de couverture',
  "Réalisation de la partie accueil et intégration",
  'Rédaction du document et mise en forme',
  'Modélisation des diagrammes',
  "Réalisation de l'application/projet",
  'Pré-soutenance 1',
  'Pré-soutenance 2',
  'Signature des fiches',
  'Soutenance'
]

// NB: le cahier des charges liste 9 étapes mais décrit la pré-soutenance en 2 sessions,
// ce qui donne 10 lignes réelles dans la table tasks. step_number va de 1 à 10.

export const TASK_STATUS = {
  NON_COMMENCE: 'non_commence',
  EN_COURS: 'en_cours',
  TERMINE: 'termine',
  VALIDE: 'valide'
}

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.NON_COMMENCE]: 'Non commencé',
  [TASK_STATUS.EN_COURS]: 'En cours',
  [TASK_STATUS.TERMINE]: 'Terminé',
  [TASK_STATUS.VALIDE]: 'Validé'
}

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.NON_COMMENCE]: 'bg-slate-100 text-slate-600',
  [TASK_STATUS.EN_COURS]: 'bg-amber-100 text-amber-700',
  [TASK_STATUS.TERMINE]: 'bg-blue-100 text-blue-700',
  [TASK_STATUS.VALIDE]: 'bg-green-100 text-green-700'
}

// Statuts que l'étudiant a le droit de choisir lui-même
export const STUDENT_EDITABLE_STATUSES = [
  TASK_STATUS.NON_COMMENCE,
  TASK_STATUS.EN_COURS,
  TASK_STATUS.TERMINE
]
