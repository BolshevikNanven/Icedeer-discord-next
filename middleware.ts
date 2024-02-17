import { NextResponse } from "next/server"
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {

    if (request.cookies.has('Authentication') && request.cookies.get('Authentication')) {
        return NextResponse.next();
    }
    if (['/auth/login'].some(nex => nex == request.nextUrl.pathname)) {
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/auth/login", request.url))
    
}
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}