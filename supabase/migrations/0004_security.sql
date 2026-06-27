-- ════════════════════════════════════════════════════════════════════
-- AKR Nexus — security hardening
-- Prevents privilege escalation: a signed-in non-admin must not be able to
-- change their own `role` via the self-update policy on `profiles`.
-- Admins (is_admin()) and trusted server/SQL-editor sessions (auth.uid() IS
-- NULL, e.g. the service role) can still set roles — so the documented
-- bootstrap `update profiles set role='admin' ...` keeps working.
-- Idempotent and safe to re-run. Run AFTER 0001–0003.
-- ════════════════════════════════════════════════════════════════════

create or replace function enforce_profile_role_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role then
    -- Block role changes made by an authenticated, non-admin user.
    if auth.uid() is not null and not is_admin() then
      raise exception 'Only administrators can change a user role';
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_profiles_role_guard on profiles;
create trigger trg_profiles_role_guard
  before update on profiles
  for each row execute function enforce_profile_role_guard();
