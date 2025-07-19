import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';


const API_URL = 'https://script.google.com/macros/s/AKfycbwixu_b6F0AHqr8wjldUAKMtqrXG0KLDB2todSu06y8JouFBeJOuaDCO96GcX-V77SOfQ/exec';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(API_URL);
        const users = await res.json();
        const user = users.find(
          (u) =>
            u.user === credentials?.username &&
            u.password === credentials?.password
        );

        return user
          ? {
            // id: user.user,
            name: user.user,
            email: `${user.user}@example.com`,
            image: `https://i.pravatar.cc/150?u=${user.user}`,
            brand: user.brand,
            role: user.role,
            routes: user.routes,
            // Add any other user properties you need
          }
          : null;
      },
    }),
  ],


  // ✅ ENABLE JWT STRATEGY
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days (optional)
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) Object.assign(token, user);
      return token;
    },
    async session({ session, token }) {
      Object.assign(session.user, {
        // id: token.id,
        name: token.name,
        brand: token.brand,
        role: token.role,
        routes: token.routes,
        // Add any other user properties you need
      });
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
  },

  secret: process.env.AUTH_SECRET,
});
