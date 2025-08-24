import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;

    const { pathname } = req.nextUrl;

    // Allow the request if the following is true...
    // 1) It's a request for next internal (/_next) or public (/_vercel) assets
    // 2) It's a request to our API routes
    if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/favicon.ico')) {
        return NextResponse.next();
    }

    // 3) The user is logged in and trying to access a non-auth page
    if (token && (pathname === '/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // 4) The user is not logged in and trying to access an auth page
    if (!token && (pathname !== '/login' && pathname !== '/signup')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // 5) The user is logged in and trying to access a non-auth page
    return NextResponse.next();
}