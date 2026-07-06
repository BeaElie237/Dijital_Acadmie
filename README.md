# Suivi des Stages

Application web de gestion et suivi des étudiants en stage : étapes du stage, notes/appréciations, progression, et présence par QR code.

**Stack** : React + Vite + Tailwind CSS · Supabase (Auth, PostgreSQL, RLS) · Netlify (hébergement + Functions) · qrcode.react / html5-qrcode · recharts.

## 1. Créer le projet Supabase

1. Aller sur [supabase.com](https://supabase.com) → **New project** (plan gratuit).
2. Une fois le projet créé, récupérer dans **Project Settings > API** :
   - `Project URL` → `VITE_SUPABASE_URL` / `SUPABASE_URL`
   - `anon public key` → `VITE_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ secret, ne jamais exposer côté frontend)
3. Dans **Authentication > Providers**, laisser "Email" activé. Dans **Authentication > Settings**, désactiver "Confirm email" si vous voulez pouvoir connecter les comptes de test immédiatement (sinon confirmez-les manuellement).

## 2. Exécuter le script SQL

1. Ouvrir **SQL Editor** dans le dashboard Supabase.
2. Copier-coller le contenu de [`supabase/schema.sql`](supabase/schema.sql) et l'exécuter.
   Ce script crée :
   - les tables `profiles`, `students`, `id_history`, `tasks`, `attendance_sessions`, `attendance_records`
   - les fonctions `is_admin()`, `current_student_id()`, `update_own_task_status()`, `mark_password_changed()`, `mark_attendance()`
   - les triggers (création automatique des 10 étapes à la création d'un étudiant)
   - toutes les policies RLS (un étudiant ne voit que ses données, l'admin voit tout)

## 3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Renseigner `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans `.env`.

Pour le seed (étape suivante), créer un fichier `.env.seed` (non commité) avec :

```
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

## 4. Installer les dépendances et lancer en local

```bash
npm install
npm run dev
```

L'app démarre sur `http://localhost:5173`. Les Netlify Functions (`/netlify/functions/*`) ne sont **pas** servies par `vite dev` seul : pour les tester en local, utilisez plutôt `netlify dev` (Netlify CLI) :

```bash
npm install -g netlify-cli
netlify dev
```

## 5. Créer les comptes de test (seed)

```bash
npm run seed
```

Crée :
- **Admin** : `admin@stages.local` / `Admin123!`
- **ST001** — Awa Diallo — `awa.diallo@stages.local` / mot de passe `ST001`
- **ST002** — Marc Lefèvre — `marc.lefevre@stages.local` / mot de passe `ST002`
- **ST003** — Sofia Martins — `sofia.martins@stages.local` / mot de passe `ST003`

Chaque étudiant reçoit automatiquement ses 10 étapes de stage (les 9 étapes du cahier des charges, la pré-soutenance étant suivie en 2 lignes distinctes : session 1 et session 2).

## 6. Déploiement sur Netlify

1. Pousser le projet sur GitHub/GitLab.
2. Sur [app.netlify.com](https://app.netlify.com) → **Add new site > Import an existing project**, sélectionner le repo.
3. Netlify détecte `netlify.toml` (build command `npm run build`, publish `dist`, functions `netlify/functions`).
4. Dans **Site settings > Environment variables**, ajouter :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (secret — utilisé uniquement côté Netlify Functions)
5. Déployer. Les fonctions serverless (`create-student`, `regenerate-id`, `update-student`, `delete-student`) gèrent les opérations nécessitant la clé `service_role` (création de comptes Auth, reset de mot de passe, suppression) sans jamais exposer cette clé au navigateur.

## Architecture des identifiants et régénération

- La clé primaire de `students` est un **UUID interne**, jamais exposé/modifié.
- `student_code` (ex: `ST001`, puis `ST4X7K2` après régénération) est un champ texte modifiable, unique, utilisé uniquement pour l'affichage et comme mot de passe par défaut.
- Régénérer l'ID d'un étudiant (bouton sur sa fiche) :
  - génère un nouveau code aléatoire unique (`ST` + 5 caractères),
  - l'enregistre dans `id_history` (traçabilité complète),
  - réinitialise le mot de passe au nouveau code **si** l'étudiant a encore son mot de passe par défaut, ou si l'admin le demande explicitement (cas d'un mot de passe déjà personnalisé),
  - est réalisée par la fonction Netlify `regenerate-id` (nécessite `service_role` pour modifier le mot de passe Auth).

## Rôles

- **Étudiant** : met à jour l'avancement de ses étapes (Non commencé / En cours / Terminé), consulte ses notes/appréciations (lecture seule), scanne les QR codes de présence, change son mot de passe.
- **Admin/Enseignant** : gère les comptes étudiants (créer/modifier/supprimer), régénère les identifiants, valide les étapes, ajoute notes et commentaires, gère les dates, génère les sessions de présence QR code, consulte les statistiques globales et exporte les présences en CSV.

## Structure du projet

```
src/
  components/        composants UI partagés (layouts, badges, graphiques...)
  contexts/          AuthContext (session + profil Supabase)
  lib/               client Supabase, appels aux Netlify Functions, constantes, utilitaires
  pages/admin/       dashboard admin, fiche étudiant, présence
  pages/student/     dashboard étudiant, scan QR, historique, paramètres
netlify/functions/   opérations nécessitant la clé service_role
supabase/schema.sql  tables + RLS + fonctions + triggers
scripts/seed.mjs     création des comptes de démonstration
```
