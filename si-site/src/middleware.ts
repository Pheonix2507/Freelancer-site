import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const { pathname } = req.nextUrl;

    // Allow internal assets & APIs
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico') {
        return NextResponse.next();
    }

    // If user is logged in and tries to access login/signup → redirect home
    if (token && (pathname === '/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // If user is NOT logged in and tries to access home → allow
    if (!token && pathname === '/') {
        return NextResponse.next();
    }

    // If user is NOT logged in and tries to access protected routes → redirect login
    if (!token && pathname !== '/login' && pathname !== '/signup') {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Otherwise allow
    return NextResponse.next();
}
