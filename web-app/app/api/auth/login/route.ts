import { NextResponse } from 'next/server';
import { getSupabasePublicClient } from '@/lib/public-supabase';
import { getSupabaseAdmin } from '@/lib/supabase';
import { createSessionCookie, SESSION_COOKIE } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');

    if (!email || !password) {
      return NextResponse.redirect(new URL('/login?error=Missing%20email%20or%20password', request.url));
    }

    const authClient = getSupabasePublicClient();
    const signIn = await authClient.auth.signInWithPassword({ email, password });
    if (signIn.error || !signIn.data.user) {
      return NextResponse.redirect(new URL('/login?error=Invalid%20login%20details', request.url));
    }

    const adminClient = getSupabaseAdmin();
    const { data: profile, error: profileError } = await adminClient
      .from('users')
      .select('id, full_name, email, role, active')
      .eq('id', signIn.data.user.id)
      .single();

    if (profileError || !profile || !profile.active) {
      return NextResponse.redirect(new URL('/login?error=Account%20not%20authorised', request.url));
    }

    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    response.cookies.set({
      name: SESSION_COOKIE,
      value: createSessionCookie({
        userId: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        role: profile.role,
      }),
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12,
    });
    return response;
  } catch (error) {
    return NextResponse.redirect(new URL('/login?error=Login%20failed', request.url));
  }
}
