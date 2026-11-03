import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/auth/login', '/auth/signup', '/'];
const authRoutes = ['/auth/login', '/auth/signup'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session — auth() only works in certain contexts
  // For now, check if we have auth cookies (simple check)
  const session = request.cookies.get('next-auth.session-token')?.value || 
                  request.cookies.get('__Secure-next-auth.session-token')?.value;

  // Redirect auth routes to dashboard if already logged in
  if (authRoutes.includes(pathname) && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protect app routes — require session
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/kelas') ||
      pathname.startsWith('/diskusi') ||
      pathname.startsWith('/moderator') ||
      pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
