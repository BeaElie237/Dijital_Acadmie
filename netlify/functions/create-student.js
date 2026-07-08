import { getAdminClient, requireAdmin, jsonResponse } from './_supabaseAdmin.js'
import { generateUniqueStudentCode } from './_idGenerator.js'
import { sendStudentCredentialsEmail } from './_email.js'

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Méthode non autorisée' })
  }

  try {
    const supabaseAdmin = getAdminClient()
    await requireAdmin(event, supabaseAdmin)

    const { fullName, email } = JSON.parse(event.body || '{}')
    if (!fullName || !email) {
      return jsonResponse(400, { error: 'fullName et email sont requis' })
    }

    const studentCode = await generateUniqueStudentCode(supabaseAdmin)

    // Le mot de passe par défaut est l'identifiant lui-même.
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: studentCode,
      email_confirm: true
    })

    if (createError) {
      return jsonResponse(400, { error: `Création du compte impossible : ${createError.message}` })
    }

    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: created.user.id,
      role: 'student',
      full_name: fullName,
      email
    })
    if (profileError) throw profileError

    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .insert({
        profile_id: created.user.id,
        student_code: studentCode,
        full_name: fullName,
        email
      })
      .select()
      .single()

    if (studentError) throw studentError

    // Envoi de l'email d'accès en best-effort : un échec d'envoi ne doit pas
    // faire échouer la création du compte, déjà effectuée à ce stade.
    let emailSent = false
    let emailError = null
    try {
      const proto = event.headers['x-forwarded-proto'] || 'https'
      const loginUrl = `${proto}://${event.headers.host}/login`
      await sendStudentCredentialsEmail({
        to: email,
        fullName,
        studentCode,
        loginUrl
      })
      emailSent = true
    } catch (err) {
      emailError = err.message
    }

    return jsonResponse(200, { student, emailSent, emailError })
  } catch (err) {
    return jsonResponse(err.statusCode || 500, { error: err.message })
  }
}
