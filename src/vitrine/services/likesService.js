// Service de likes découplé de son implémentation : aujourd'hui basé sur localStorage
// (accessible sans connexion, un like par visiteur/navigateur), mais toutes les fonctions
// sont asynchrones pour pouvoir être remplacées demain par de vrais appels Supabase
// sans changer le code des composants qui les consomment.

const STORAGE_KEY = 'dijital_vitrine_likes'

function readStore() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

function writeStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

// Retourne { count, likedByMe } pour un projet donné.
export async function getLikeState(projectId, baseCount = 0) {
  const store = readStore()
  const entry = store[projectId] ?? { count: 0, likedByMe: false }
  return { count: baseCount + entry.count, likedByMe: entry.likedByMe }
}

// Bascule le like du visiteur courant pour ce projet (like / unlike).
export async function toggleLike(projectId) {
  const store = readStore()
  const entry = store[projectId] ?? { count: 0, likedByMe: false }

  const likedByMe = !entry.likedByMe
  const count = Math.max(0, entry.count + (likedByMe ? 1 : -1))

  store[projectId] = { count, likedByMe }
  writeStore(store)

  return { count, likedByMe }
}
