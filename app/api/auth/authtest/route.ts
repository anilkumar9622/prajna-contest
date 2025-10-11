import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/utils/firebaseAdmin";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        // 1️⃣ Fetch user from Firebase
        const userQuery = await db
          .collection("user")
          .where("email", "==", credentials.email)
          .limit(1)
          .get();

        if (userQuery.empty) return null;

        const userDoc = userQuery.docs[0];
        const userData = userDoc.data();

        // 2️⃣ Compare password (plain text or bcrypt)
        if (credentials.password !== userData.password) {
          return null;
        }

        // 3️⃣ Return user object
        return { id: userDoc.id, ...userData };
      },
    }),
  ],

  session: {
    strategy: "jwt" as any,
  },

  pages: {
    signIn: "/auth/login", // optional custom login page
  },

  callbacks: {
    async jwt({ token, user }:any) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }:any) {
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET, // required for JWT
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
