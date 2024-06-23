import type { NextAuthConfig } from 'next-auth';

// https://authjs.dev/reference/nextjs#nextauthconfig
export const authConfig = {
  // https://authjs.dev/reference/nextjs#pages
  pages: {
    signIn: '/login',
  },
  // https://authjs.dev/reference/nextjs#callbacks
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard) {
        return isLoggedIn;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  // https://authjs.dev/reference/nextjs#providers
  providers: [],
} satisfies NextAuthConfig;
