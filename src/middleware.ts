import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabaseMiddleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest file)
     * Feel free to modify this pattern to include more paths.
     */
    '/',
    '/auth/login',
    '/tenant/dashboard',
    '/tenant/request',
  ],
};