import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabaseMiddleware';

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  // Add security headers to the new response
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
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
    '/((?!.*api/|_next/static|_next/image|favicon.ico|manifest.webmanifest|icon.png).*)',

  ],
};
