// Client Supabase "admin" utilisant la clé service_role.
// Ce fichier ne doit JAMAIS être importé côté frontend (dossier netlify/functions
// uniquement, exécuté côté serveur par Netlify Functions).
import { createClient } from '@supabase/supabase-js'

export function getAdminClient() {
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants côté serveur (Netlify env vars).')
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
}

// Vérifie que le token Bearer envoyé par le client correspond à un admin.
// Retourne { user } si ok, lève une erreur sinon.
export async function requireAdmin(event, adminClient) {
  const authHeader = event.headers.authorization || event.headers.Authorization
  const token = authHeader?.replace(/^Bearer\s+/i, '')

  if (!token) {
    const err = new Error('Non authentifié')
    err.statusCode = 401
    throw err
  }

  const { data: userData, error: userError } = await adminClient.auth.getUser(token)
  if (userError || !userData?.user) {
    const err = new Error('Session invalide')
    err.statusCode = 401
    throw err
  }

  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .select('id, role')
    .eq('id', userData.user.id)
    .single()

  if (profileError || profile?.role !== 'admin') {
    const err = new Error('Accès réservé aux administrateurs')
    err.statusCode = 403
    throw err
  }

  return { user: userData.user }
}

export function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }
}
