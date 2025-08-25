import type { NextAuthOptions, DefaultSession, DefaultUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Client, Account, Models } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
    sessionSecret?: string;
  }

  interface User extends DefaultUser {
    id: string;
    sessionSecret?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    sessionSecret?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        try {
          const session = await account.createEmailPasswordSession(
            credentials.email,
            credentials.password
          );

          const user: Models.User<Models.Preferences> = await account.get();

          return {
            id: user.$id,
            name: user.name,
            email: user.email,
            sessionSecret: session.secret,
          };
        } catch (err) {
          console.error("Appwrite login error:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.sessionSecret = user.sessionSecret;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      if (token.sessionSecret) {
        session.sessionSecret = token.sessionSecret;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
