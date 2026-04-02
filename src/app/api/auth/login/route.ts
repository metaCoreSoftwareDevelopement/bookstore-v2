import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error || !data) {
    // PGRST116 means zero rows found, which meant wrong credentials.
    // Any other error means a database/connection problem (e.g., missing env variables).
    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  cookies().set('auth_user', data.username, {
    httpOnly: true,
    maxAge: 60 * 60 * 2, // 2 hours
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return NextResponse.json({ success: true, username: data.username });
}
