// import { AuthOptions } from "next-auth"
// import GoogleProvider from 'next-auth/providers/google'
// import config from "./config"

// import { getServerSession } from "next-auth"
// import dbFunc from "@/utils/dbFunc"

// export const authOptions: AuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: config.GOOGLE_CLIENT_ID || '',
//       clientSecret: config.GOOGLE_CLIENT_SECRET || '',
//     }),
//   ],
//   session: {
//     strategy: 'jwt',
//     maxAge: 1 * 24 * 60 * 60, // 1 day
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     async session({ session, user }: any) {
//       await dbFunc.findViaDocumentID("users", session.user.email)
//         .then(() => {
//           session.isNewUser = false
//         }).catch(e => {
//           session.isNewUser = true
//         })
//       return session;
//     },
//     async jwt({ token, user }: any) {
//       await dbFunc.findViaDocumentID("users", token.email)
//         .then(() => {
//           token.isNewUser = false
//         }).catch(e => {
//           token.isNewUser = true
//         })
//       return token;
//     },
//   }
// }
// export const getAuth = () => getServerSession(authOptions)

import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import config from "./config";
import dbFunc from "@/utils/dbFunc";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: config.GOOGLE_CLIENT_ID || "",
      clientSecret: config.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      // Protect against undefined email
      const email = session?.user?.email || token?.email;
      if (email) {
        try {
          await dbFunc.findViaDocumentID("users", email);
          session.isNewUser = false;
        } catch {
          session.isNewUser = true;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      const email = token?.email || user?.email;
      if (email) {
        try {
          await dbFunc.findViaDocumentID("users", email);
          token.isNewUser = false;
        } catch {
          token.isNewUser = true;
        }
      }
      return token;
    },
  },
};
