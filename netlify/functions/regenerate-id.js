const { getAdminClient, requireAdmin, jsonResponse } = require('./_supabaseAdmin')
const { generateUniqueStudentCode } = require('./_idGenerator')

// Régénère l'identifiant (ST + code aléatoire) d'UN étudiant précis.
// - Toujours enregistré dans id_history.
// - Si l'étudiant a encore son mot de passe par défaut, le mot de passe est
//   automatiquement remis au nouvel identifiant.
// - S'il a déjà personnalisé son mot de passe, il faut passer resetPassword=true
//   explicitement (confirmation demandée côté UI) pour aussi le réinitialiser.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Méthode non autorisée' })
  }

  const supabaseAdmin = getAdminClient()

  try {
    const { user } = await requireAdmin(event, supabaseAdmin)

    const { studentId, resetPassword } = JSON.parse(event.body || '{}')
    if (!studentId) {
      return jsonResponse(400, { error: 'studentId est requis' })
    }

    const { data: student, error: fetchError } = await supabaseAdmin
      .from('students')
      .select('id, profile_id, student_code, password_is_default')
      .eq('id', studentId)
      .single()

    if (fetchError || !student) {
      return jsonResponse(404, { error: 'Étudiant introuvable' })
    }

    const shouldResetPassword = student.password_is_default || resetPassword === true
    const newCode = await generateUniqueStudentCode(supabaseAdmin)

    if (shouldResetPassword) {
      const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(student.profile_id, {
        password: newCode
      })
      if (pwError) throw pwError
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('students')
      .update({
        student_code: newCode,
        password_is_default: shouldResetPassword ? true : student.password_is_default
      })
      .eq('id', studentId)
      .select()
      .single()

    if (updateError) throw updateError

    const { error: historyError } = await supabaseAdmin.from('id_history').insert({
      student_id: studentId,
      old_code: student.student_code,
      new_code: newCode,
      password_reset: shouldResetPassword,
      changed_by: user.id
    })
    if (historyError) throw historyError

    return jsonResponse(200, {
      student: updated,
      passwordReset: shouldResetPassword
    })
  } catch (err) {
    return jsonResponse(err.statusCode || 500, { error: err.message })
  }
}
