const { getAdminClient, requireAdmin, jsonResponse } = require('./_supabaseAdmin')
const { generateUniqueStudentCode } = require('./_idGenerator')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Méthode non autorisée' })
  }

  const supabaseAdmin = getAdminClient()

  try {
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

    return jsonResponse(200, { student })
  } catch (err) {
    return jsonResponse(err.statusCode || 500, { error: err.message })
  }
}
