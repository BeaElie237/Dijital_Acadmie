-- ============================================================================
-- Suivi des stages — schéma Supabase (PostgreSQL)
-- À exécuter dans l'éditeur SQL du projet Supabase (Database > SQL Editor)
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILES — un profil par utilisateur Supabase Auth (admin ou étudiant)
-- ----------------------------------------------------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'student')),
  full_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2. STUDENTS — clé primaire interne UUID ; student_code (ex: ST001) modifiable
-- ----------------------------------------------------------------------------
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references profiles(id) on delete cascade,
  student_code text not null unique,
  full_name text not null,
  email text not null,
  password_is_default boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_students_code on students(student_code);

-- ----------------------------------------------------------------------------
-- 3. ID_HISTORY — historique des anciens identifiants
-- ----------------------------------------------------------------------------
create table if not exists id_history (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  old_code text not null,
  new_code text not null,
  password_reset boolean not null default false,
  changed_by uuid references profiles(id),
  changed_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 4. TASKS — les étapes du stage pour chaque étudiant
--    (Pré-soutenance étant réalisée en 2 sessions distinctes, elle est suivie
--     comme 2 lignes indépendantes : "Pré-soutenance 1" et "Pré-soutenance 2")
-- ----------------------------------------------------------------------------
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  step_number int not null check (step_number between 1 and 10),
  step_name text not null,
  status text not null default 'non_commence'
    check (status in ('non_commence', 'en_cours', 'termine', 'valide')),
  note numeric(4,2) check (note is null or (note >= 0 and note <= 20)),
  comment text,
  start_date date,
  end_date date,
  updated_at timestamptz not null default now(),
  unique (student_id, step_number)
);

create index if not exists idx_tasks_student on tasks(student_id);

-- ----------------------------------------------------------------------------
-- 5. ATTENDANCE_SESSIONS — sessions de présence générées par l'enseignant
-- ----------------------------------------------------------------------------
create table if not exists attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  label text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

-- ----------------------------------------------------------------------------
-- 6. ATTENDANCE_RECORDS — un scan = une présence (unique par session/étudiant)
-- ----------------------------------------------------------------------------
create table if not exists attendance_records (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references attendance_sessions(id) on delete cascade,
  student_id uuid not null references students(id) on delete cascade,
  scanned_at timestamptz not null default now(),
  unique (session_id, student_id)
);

create index if not exists idx_attendance_records_student on attendance_records(student_id);

-- ============================================================================
-- FONCTIONS UTILITAIRES
-- ============================================================================

-- Vérifie si l'utilisateur courant est admin (SECURITY DEFINER pour éviter
-- la récursion RLS sur la table profiles)
create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Récupère l'id interne (uuid) de l'étudiant courant à partir de son profil
create or replace function current_student_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select id from students where profile_id = auth.uid();
$$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Crée automatiquement les 10 lignes de tasks quand un étudiant est créé
create or replace function seed_student_tasks()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  step_names text[] := array[
    'Recherche du thème',
    'Première de couverture',
    'Réalisation de la partie accueil et intégration',
    'Rédaction du document et mise en forme',
    'Modélisation des diagrammes',
    'Réalisation de l''application/projet',
    'Pré-soutenance 1',
    'Pré-soutenance 2',
    'Signature des fiches',
    'Soutenance'
  ];
begin
  for i in 1 .. array_length(step_names, 1) loop
    insert into tasks (student_id, step_number, step_name)
    values (new.id, i, step_names[i]);
  end loop;
  return new;
end;
$$;

drop trigger if exists trg_seed_student_tasks on students;
create trigger trg_seed_student_tasks
  after insert on students
  for each row execute function seed_student_tasks();

-- Maintient updated_at à jour
create or replace function touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_students_touch on students;
create trigger trg_students_touch
  before update on students
  for each row execute function touch_updated_at();

drop trigger if exists trg_tasks_touch on tasks;
create trigger trg_tasks_touch
  before update on tasks
  for each row execute function touch_updated_at();

-- ============================================================================
-- RPC — actions encapsulées exécutées avec les droits du propriétaire
-- (permettent d'ouvrir des actions précises aux étudiants sans élargir les
-- policies RLS en écriture sur les tables sensibles)
-- ============================================================================

-- L'étudiant fait progresser sa propre étape (non_commence / en_cours / termine).
-- Le passage à "valide" reste réservé à l'admin (policy RLS classique).
create or replace function update_own_task_status(p_task_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student_id uuid := current_student_id();
begin
  if v_student_id is null then
    raise exception 'Aucun étudiant associé à cet utilisateur';
  end if;

  if p_status not in ('non_commence', 'en_cours', 'termine') then
    raise exception 'Statut non autorisé pour un étudiant';
  end if;

  update tasks
  set status = p_status,
      start_date = case when p_status = 'en_cours' and start_date is null then current_date else start_date end,
      end_date = case when p_status = 'termine' then coalesce(end_date, current_date) else end_date end
  where id = p_task_id
    and student_id = v_student_id
    and status <> 'valide'; -- une étape validée par l'admin n'est plus modifiable par l'étudiant
end;
$$;

grant execute on function update_own_task_status(uuid, text) to authenticated;

-- L'étudiant confirme avoir changé son mot de passe par défaut
create or replace function mark_password_changed()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update students
  set password_is_default = false
  where profile_id = auth.uid();
end;
$$;

grant execute on function mark_password_changed() to authenticated;

-- L'étudiant scanne un QR code de présence : vérifie l'expiration et l'unicité
create or replace function mark_attendance(p_token text)
returns table(status text, message text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session attendance_sessions%rowtype;
  v_student_id uuid := current_student_id();
begin
  if v_student_id is null then
    return query select 'error', 'Aucun étudiant associé à cet utilisateur';
    return;
  end if;

  select * into v_session from attendance_sessions where token = p_token;

  if v_session.id is null then
    return query select 'error', 'QR code invalide ou inconnu';
    return;
  end if;

  if v_session.expires_at < now() then
    return query select 'error', 'Ce QR code a expiré';
    return;
  end if;

  if exists (
    select 1 from attendance_records
    where session_id = v_session.id and student_id = v_student_id
  ) then
    return query select 'error', 'Présence déjà enregistrée pour cette session';
    return;
  end if;

  insert into attendance_records (session_id, student_id)
  values (v_session.id, v_student_id);

  return query select 'ok', 'Présence enregistrée avec succès';
end;
$$;

grant execute on function mark_attendance(text) to authenticated;

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table profiles enable row level security;
alter table students enable row level security;
alter table id_history enable row level security;
alter table tasks enable row level security;
alter table attendance_sessions enable row level security;
alter table attendance_records enable row level security;

-- PROFILES ------------------------------------------------------------------
drop policy if exists "profiles_select" on profiles;
create policy "profiles_select" on profiles
  for select using (id = auth.uid() or is_admin());

drop policy if exists "profiles_admin_all" on profiles;
create policy "profiles_admin_all" on profiles
  for all using (is_admin()) with check (is_admin());

-- STUDENTS --------------------------------------------------------------------
drop policy if exists "students_select" on students;
create policy "students_select" on students
  for select using (profile_id = auth.uid() or is_admin());

drop policy if exists "students_admin_write" on students;
create policy "students_admin_write" on students
  for all using (is_admin()) with check (is_admin());
-- Remarque : la création/suppression de comptes (auth.users) et la
-- réinitialisation de mot de passe nécessitent la clé service_role et sont
-- réalisées via les Netlify Functions (voir /netlify/functions), qui
-- contournent RLS. Les mises à jour "simples" (nom, email) peuvent être
-- faites par l'admin directement depuis le client grâce à la policy ci-dessus.

-- ID_HISTORY --------------------------------------------------------------------
drop policy if exists "id_history_select" on id_history;
create policy "id_history_select" on id_history
  for select using (
    is_admin() or student_id = current_student_id()
  );

drop policy if exists "id_history_admin_write" on id_history;
create policy "id_history_admin_write" on id_history
  for all using (is_admin()) with check (is_admin());

-- TASKS ------------------------------------------------------------------------
drop policy if exists "tasks_select" on tasks;
create policy "tasks_select" on tasks
  for select using (
    is_admin() or student_id = current_student_id()
  );

drop policy if exists "tasks_admin_write" on tasks;
create policy "tasks_admin_write" on tasks
  for all using (is_admin()) with check (is_admin());
-- Les étudiants ne modifient jamais tasks directement : ils passent par la
-- fonction update_own_task_status() (SECURITY DEFINER) ci-dessus.

-- ATTENDANCE_SESSIONS -----------------------------------------------------------
drop policy if exists "attendance_sessions_select" on attendance_sessions;
create policy "attendance_sessions_select" on attendance_sessions
  for select using (auth.uid() is not null);
-- Un étudiant authentifié peut lire les sessions (nécessaire pour valider un
-- QR scanné) ; aucune donnée sensible n'y figure. Écriture réservée à l'admin.

drop policy if exists "attendance_sessions_admin_write" on attendance_sessions;
create policy "attendance_sessions_admin_write" on attendance_sessions
  for all using (is_admin()) with check (is_admin());

-- ATTENDANCE_RECORDS --------------------------------------------------------------
drop policy if exists "attendance_records_select" on attendance_records;
create policy "attendance_records_select" on attendance_records
  for select using (
    is_admin() or student_id = current_student_id()
  );

drop policy if exists "attendance_records_admin_write" on attendance_records;
create policy "attendance_records_admin_write" on attendance_records
  for all using (is_admin()) with check (is_admin());
-- Les étudiants n'insèrent jamais attendance_records directement : ils
-- passent par la fonction mark_attendance() (SECURITY DEFINER) ci-dessus,
-- qui garantit l'unicité et vérifie l'expiration du token.

-- ============================================================================
-- Fin du schéma
-- ============================================================================
