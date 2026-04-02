import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const authUser = request.cookies.get('auth_user');
  const path = request.nextUrl.pathname;

  // If not logged in and trying to access protected routes, redirect to login
  if (!authUser && path !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If logged in and on login page, redirect to home
  if (authUser && path === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/home', '/generate-invoice', '/update-invoice', '/reports', '/due-payments'],
};
