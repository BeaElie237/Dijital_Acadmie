import { supabase } from './supabaseClient'

// Appelle une Netlify Function protégée en y joignant le token de session
// Supabase courant (vérifié côté fonction avec la clé service_role).
async function callFunction(name, payload) {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  const res = await fetch(`/.netlify/functions/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token ?? ''}`
    },
    body: JSON.stringify(payload)
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.error || `Erreur (${res.status})`)
  }

  return data
}

export const api = {
  createStudent: (payload) => callFunction('create-student', payload),
  regenerateId: (payload) => callFunction('regenerate-id', payload),
  updateStudent: (payload) => callFunction('update-student', payload),
  deleteStudent: (payload) => callFunction('delete-student', payload)
}
