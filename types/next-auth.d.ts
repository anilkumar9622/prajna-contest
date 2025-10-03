import NextAuth, { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    isNewUser?: boolean; // add your custom property
  }

  interface User {
    isNewUser?: boolean;
  }

  interface JWT extends DefaultJWT {
    isNewUser?: boolean;
  }
}
