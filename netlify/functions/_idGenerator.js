const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sans 0/O/1/I pour éviter les confusions

function randomCode(length = 5) {
  let code = ''
  for (let i = 0; i < length; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)]
  }
  return code
}

// Génère un identifiant ST+code aléatoire garanti unique dans la table students.
async function generateUniqueStudentCode(supabaseAdmin) {
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = `ST${randomCode()}`
    const { data, error } = await supabaseAdmin
      .from('students')
      .select('id')
      .eq('student_code', candidate)
      .maybeSingle()

    if (error) throw error
    if (!data) return candidate
  }
  throw new Error("Impossible de générer un identifiant unique, réessayez.")
}

module.exports = { generateUniqueStudentCode }
