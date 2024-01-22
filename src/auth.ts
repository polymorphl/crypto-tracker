import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';

import authConfig from '@/auth.config';
import { login } from './data/users';
import { db } from './db';
// import { users } from './db/schema';
// import { eq } from 'drizzle-orm';
// import { getAccountByUserId } from './data/accounts';
import Credentials from 'next-auth/providers/credentials';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db),
  events: {
    async linkAccount({ user }) {
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id));
    },
  },
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      async authorize({ email, password }: any) {
        return await login(email, password);
      },
    }),
  ],
});

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
//   update,
// } = NextAuth({
//   pages: {
//     signIn: '/login',
//     error: '/auth/error',
//   },
//   callbacks: {
//     async signIn({ user, account }) {
//       // Allow OAuth without email verification
//       if (account?.provider !== 'credentials') return true;

//       const existingUser = await getUserById(user.id);

//       // Prevent sign in without email verification
//       if (!existingUser?.emailVerified) return false;

//       // TODO: Add two factor authentication
//       // if (existingUser.isTwoFactorEnabled) {
//       //   const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
//       //     existingUser.id
//       //   );

//       //   if (!twoFactorConfirmation) return false;

//       //   // Delete two factor confirmation for next sign in
//       //   await db.twoFactorConfirmation.delete({
//       //     where: { id: twoFactorConfirmation.id },
//       //   });
//       // }

//       return true;
//     },
//     async session({ token, session }) {
//       if (token.sub && session.user) {
//         session.user.id = token.sub;
//       }

//       // if (token.role && session.user) {
//       //   session.user.role = token.role as UserRole;
//       // }

//       // if (session.user) {
//       //   session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
//       // }

//       if (session.user) {
//         session.user.name = token.name;
//         session.user.email = token.email;
//         // session.user.isOAuth = token.isOAuth as boolean;
//       }

//       return session;
//     },
//     async jwt({ token }) {
//       if (!token.sub) return token;

//       const existingUser = await getUserById(token.sub);

//       if (!existingUser) return token;

//       const existingAccount = await getAccountByUserId(existingUser.id);

//       token.isOAuth = !!existingAccount;
//       // token.name = existingUser.name;
//       token.email = existingUser.email;
//       // token.role = existingUser.role;
//       // token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

//       return token;
//     },
//   },
//   adapter: DrizzleAdapter(db),
//   session: { strategy: 'jwt' },
//   ...authConfig,
// });
