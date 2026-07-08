import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [errorDetails, setErrorDetails] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setErrorDetails('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      // On affiche le message réel renvoyé par Supabase (pas un message générique) :
      // "Invalid login credentials", "Email not confirmed", erreur réseau, etc.
      // C'est ce qui permet de diagnostiquer directement depuis l'application,
      // sans avoir besoin d'ouvrir la console ou de tester en ligne de commande.
      setError(error.message || 'Erreur de connexion inconnue.')
      setErrorDetails(`code: ${error.status ?? error.code ?? 'n/a'}`)
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100 px-4">
      <div className="w-full max-w-sm card">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-brand-700">Suivi des Stages</h1>
          <p className="mt-1 text-sm text-slate-500">Connectez-vous à votre espace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="etudiant@exemple.com"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre identifiant (ex: ST001) par défaut"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
              <p className="text-sm text-red-600">{error}</p>
              {errorDetails && <p className="text-xs text-red-400 mt-0.5">{errorDetails}</p>}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Étudiant : votre identifiant (ex: ST001) est votre mot de passe par défaut.
        </p>

        {/* Repère de diagnostic : confirme quel projet Supabase ce déploiement utilise réellement.
            Utile pour détecter un décalage de variables d'environnement entre Netlify et Supabase. */}
        <p className="mt-4 text-center text-[11px] text-slate-300 break-all">
          Connecté à : {SUPABASE_URL || '⚠️ VITE_SUPABASE_URL non défini'}
        </p>
      </div>
    </div>
  )
}
