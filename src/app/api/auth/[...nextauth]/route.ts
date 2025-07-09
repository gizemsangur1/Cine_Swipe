import { authOptions } from "@/lib/authoptions";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
