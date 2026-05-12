import { roleSchema } from '@/lib/validation';
import { getSupabaseAdmin } from '@/lib/supabase';

export async function listUsers() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, email, role, active, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createUser(input: { fullName: string; email: string; role: string; password: string; active?: boolean }) {
  const supabase = getSupabaseAdmin();
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  const role = roleSchema.parse(input.role);
  const password = input.password;
  const active = input.active ?? true;

  const existing = await supabase.auth.admin.listUsers();
  if (existing.error) throw existing.error;
  const existingUser = existing.data.users.find((user) => user.email?.toLowerCase() === email);

  let authUserId = existingUser?.id;
  if (!authUserId) {
    const created = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (created.error || !created.data.user) throw created.error ?? new Error('Failed to create auth user');
    authUserId = created.data.user.id;
  } else {
    const updated = await supabase.auth.admin.updateUserById(authUserId, {
      password,
      email_confirm: true,
      user_metadata: { ...(existingUser?.user_metadata || {}), full_name: fullName },
    });
    if (updated.error) throw updated.error;
  }

  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: authUserId,
      full_name: fullName,
      email,
      role,
      active,
    })
    .select('id, full_name, email, role, active, created_at')
    .single();

  if (error) throw error;
  return data;
}

export async function updateUser(input: { id: string; fullName?: string; role?: string; active?: boolean; password?: string }) {
  const supabase = getSupabaseAdmin();
  const patch: Record<string, unknown> = {};

  if (input.fullName !== undefined) patch.full_name = input.fullName.trim();
  if (input.role !== undefined) patch.role = roleSchema.parse(input.role);
  if (input.active !== undefined) patch.active = input.active;

  if (input.fullName !== undefined || input.password !== undefined) {
    const authPatch: Record<string, unknown> = {};
    if (input.password) authPatch.password = input.password;
    if (input.fullName) authPatch.user_metadata = { full_name: input.fullName.trim() };
    const updatedAuth = await supabase.auth.admin.updateUserById(input.id, authPatch);
    if (updatedAuth.error) throw updatedAuth.error;
  }

  const { data, error } = await supabase
    .from('users')
    .update(patch)
    .eq('id', input.id)
    .select('id, full_name, email, role, active, created_at')
    .single();

  if (error) throw error;
  return data;
}
