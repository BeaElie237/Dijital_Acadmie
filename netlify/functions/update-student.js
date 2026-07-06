const { getAdminClient, requireAdmin, jsonResponse } = require('./_supabaseAdmin')

// Met à jour nom/email d'un étudiant. L'email étant aussi l'identifiant de
// connexion Supabase Auth, il doit être synchronisé côté auth.users.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Méthode non autorisée' })
  }

  const supabaseAdmin = getAdminClient()

  try {
    await requireAdmin(event, supabaseAdmin)

    const { studentId, fullName, email } = JSON.parse(event.body || '{}')
    if (!studentId) {
      return jsonResponse(400, { error: 'studentId est requis' })
    }

    const { data: student, error: fetchError } = await supabaseAdmin
      .from('students')
      .select('id, profile_id, email')
      .eq('id', studentId)
      .single()

    if (fetchError || !student) {
      return jsonResponse(404, { error: 'Étudiant introuvable' })
    }

    if (email && email !== student.email) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(student.profile_id, { email })
      if (authError) throw authError
    }

    const updates = {}
    if (fullName) updates.full_name = fullName
    if (email) updates.email = email

    const { data: updatedStudent, error: studentError } = await supabaseAdmin
      .from('students')
      .update(updates)
      .eq('id', studentId)
      .select()
      .single()
    if (studentError) throw studentError

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update(updates.full_name || updates.email ? { ...(fullName && { full_name: fullName }), ...(email && { email }) } : {})
      .eq('id', student.profile_id)
    if (profileError) throw profileError

    return jsonResponse(200, { student: updatedStudent })
  } catch (err) {
    return jsonResponse(err.statusCode || 500, { error: err.message })
  }
}
