// Envoi d'emails transactionnels via l'API Resend (https://resend.com).
// Nécessite la variable d'environnement RESEND_API_KEY côté Netlify (jamais exposée au frontend).
//
// Par défaut, l'expéditeur est "onboarding@resend.dev", qui fonctionne sans
// configuration DNS (pratique pour démarrer). Pour un vrai nom de domaine
// (ex: no-reply@dijital.com), il faut vérifier le domaine dans Resend puis
// définir RESEND_FROM_EMAIL sur Netlify.

const RESEND_API_URL = 'https://api.resend.com/emails'

async function sendEmail({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error("RESEND_API_KEY manquant côté serveur (variable d'environnement Netlify).")
  }

  const from = process.env.RESEND_FROM_EMAIL || 'Dijital <onboarding@resend.dev>'

  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from, to, subject, html, text })
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Envoi de l'email impossible (${res.status})`)
  }

  return res.json()
}

export async function sendStudentCredentialsEmail({ to, fullName, studentCode, loginUrl }) {
  const subject = 'Vos accès à la plateforme de suivi des stages Dijital'

  const text = `Bonjour ${fullName},

Un compte a été créé pour vous sur la plateforme de suivi des stages Dijital.

Identifiant : ${studentCode}
Mot de passe : ${studentCode} (identique à votre identifiant)

Connectez-vous ici : ${loginUrl}

Nous vous recommandons de changer votre mot de passe dès votre première connexion (menu Paramètres).

— L'équipe Dijital`

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #161a20;">
      <h2 style="color: #149179;">Bienvenue sur Dijital</h2>
      <p>Bonjour ${fullName},</p>
      <p>Un compte a été créé pour vous sur la plateforme de suivi des stages Dijital.</p>
      <table style="margin: 16px 0; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 12px; font-weight: 600;">Identifiant</td>
          <td style="padding: 6px 12px; font-family: monospace;">${studentCode}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px; font-weight: 600;">Mot de passe</td>
          <td style="padding: 6px 12px; font-family: monospace;">${studentCode}</td>
        </tr>
      </table>
      <p>
        <a href="${loginUrl}" style="display: inline-block; background: #1bab8a; color: white; text-decoration: none; padding: 10px 20px; border-radius: 999px; font-weight: 600;">
          Se connecter
        </a>
      </p>
      <p style="color: #64748b; font-size: 13px; margin-top: 24px;">
        Nous vous recommandons de changer votre mot de passe dès votre première connexion
        (menu Paramètres).
      </p>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">— L'équipe Dijital</p>
    </div>
  `

  return sendEmail({ to, subject, html, text })
}
