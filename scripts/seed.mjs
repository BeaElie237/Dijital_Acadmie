// Script de seed — crée un compte admin et 3 étudiants de test.
// Nécessite la clé SERVICE ROLE (jamais exposée au frontend).
//
// Utilisation :
//   1. Copier .env.example vers .env.seed et renseigner :
//        SUPABASE_URL=...
//        SUPABASE_SERVICE_ROLE_KEY=...
//   2. npm run seed
//
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.seed' })

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définis (fichier .env.seed).')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function upsertAuthUser({ email, password }) {
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (!createError) return created.user

  // Si l'utilisateur existe déjà, on le retrouve par email.
  const { data: list, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) throw listError
  const existing = list.users.find((u) => u.email === email)
  if (!existing) throw createError
  return existing
}

async function createAdmin() {
  const email = 'admin@stages.local'
  const password = 'Admin123!'
  const user = await upsertAuthUser({ email, password })

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    role: 'admin',
    full_name: 'Administrateur',
    email
  })
  if (error) throw error

  console.log(`✔ Admin prêt → email: ${email} / mot de passe: ${password}`)
}

async function createStudent({ code, fullName, email }) {
  const password = code // mot de passe par défaut = identifiant
  const user = await upsertAuthUser({ email, password })

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: user.id,
    role: 'student',
    full_name: fullName,
    email
  })
  if (profileError) throw profileError

  const { data: existingStudent } = await supabase
    .from('students')
    .select('id')
    .eq('profile_id', user.id)
    .maybeSingle()

  if (!existingStudent) {
    const { error: studentError } = await supabase.from('students').insert({
      profile_id: user.id,
      student_code: code,
      full_name: fullName,
      email
    })
    if (studentError) throw studentError
  }

  console.log(`✔ Étudiant prêt → ${code} / ${fullName} / email: ${email} / mot de passe: ${password}`)
}

async function main() {
  await createAdmin()
  await createStudent({ code: 'ST001', fullName: 'Awa Diallo', email: 'awa.diallo@stages.local' })
  await createStudent({ code: 'ST002', fullName: 'Marc Lefèvre', email: 'marc.lefevre@stages.local' })
  await createStudent({ code: 'ST003', fullName: 'Sofia Martins', email: 'sofia.martins@stages.local' })
  console.log('\nSeed terminé.')
}

main().catch((err) => {
  console.error('Erreur seed :', err)
  process.exit(1)
})
