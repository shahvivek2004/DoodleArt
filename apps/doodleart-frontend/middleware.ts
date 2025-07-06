// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { JWT_SECRET, WS_URL } from './config';

async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload; // Return decoded payload if valid
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('__uIt')?.value; // Make sure to get `.value`
  // console.log(token);
  // console.log("HI");
  // console.log(JWT_SECRET);

  const { pathname } = request.nextUrl;

  let isAuthenticated = false;

  if (token) {
    const verified = await verifyToken(token);
    isAuthenticated = !!verified;
  }

  // Handle WebSocket authentication
  if (pathname === '/api/ws-auth') {
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create a response with WebSocket URL containing the token
    // This endpoint will be called from the frontend to get a valid WS URL
    const wsUrl = `${WS_URL}?token=${token}`;
    return NextResponse.json({ wsUrl });
  }

  // If authenticated and trying to access /signin or /signup, redirect to /dashboard
  if (isAuthenticated && (pathname === '/signin' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If NOT authenticated and trying to access protected routes, redirect to /signin
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

// Define which paths middleware should run on
export const config = {
  matcher: [
    '/signin',
    '/signup',
    '/dashboard/:path*', // all dashboard pages
    '/api/ws-auth', // Add WebSocket authentication endpoint
  ],
};