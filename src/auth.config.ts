import { NextAuthConfig } from 'next-auth';

export default {
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
  providers: [],
  callbacks: {
    jwt({ token, user, account }) {
      console.log('jwt', { token, user, account });
      return token;
    },
    authorized({ auth, request: { nextUrl } }) {
      let isLoggedIn = !!auth?.user;
      let isOnDashboard = nextUrl.pathname.startsWith('/protected');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      // else if (isLoggedIn) {
      //   return Response.redirect(new URL('/protected', nextUrl));
      // }

      return true;
    },
  },
} satisfies NextAuthConfig;
