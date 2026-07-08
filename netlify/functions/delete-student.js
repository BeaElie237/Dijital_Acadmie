import { getAdminClient, requireAdmin, jsonResponse } from './_supabaseAdmin.js'

// Supprime un étudiant : suppression du compte auth.users, qui cascade sur
// profiles -> students -> tasks/id_history/attendance_records (FK on delete cascade).
export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Méthode non autorisée' })
  }

  try {
    const supabaseAdmin = getAdminClient()
    await requireAdmin(event, supabaseAdmin)

    const { studentId } = JSON.parse(event.body || '{}')
    if (!studentId) {
      return jsonResponse(400, { error: 'studentId est requis' })
    }

    const { data: student, error: fetchError } = await supabaseAdmin
      .from('students')
      .select('id, profile_id')
      .eq('id', studentId)
      .single()

    if (fetchError || !student) {
      return jsonResponse(404, { error: 'Étudiant introuvable' })
    }

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(student.profile_id)
    if (deleteError) throw deleteError

    return jsonResponse(200, { success: true })
  } catch (err) {
    return jsonResponse(err.statusCode || 500, { error: err.message })
  }
}
