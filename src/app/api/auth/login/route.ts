import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true, username: data.username });
  response.cookies.set('auth_user', data.username, {
    httpOnly: true,
    maxAge: 60 * 60 * 2, // 2 hours
    path: '/',
    sameSite: 'lax',
  });

  return response;
}
