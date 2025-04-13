import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

import connectToDatabase from "./lib/mongodb";

// Default avatar to use when user doesn't have a profile image
const DEFAULT_AVATAR = "/images/default-avatar.png";

// Define extended types for next-auth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
      email: string;
      profileImage?: string;
      image?: string;
    }
  }
  
  interface User {
    username?: string;
    profileImage?: string;
    image?: string;
  }
}

// Extend JWT
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    profileImage?: string;
    image?: string;
    provider?: string;
  }
}

// For TypeScript compatibility
interface CustomUser {
  id: string;
  email: string;
  username?: string;
  name?: string;
  profileImage?: string;
  image?: string;
}

export const config: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
      profile(profile) {
        // Customize the profile returned from Google
        const generatedUsername = profile.name?.replace(/\s+/g, '')?.toLowerCase() || profile.email?.split('@')[0];
       
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: generatedUsername
        };
      }
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.sub ?? '';
        session.user.username = token.username;
        session.user.image = token.image;
      }
      return session;
    },
    async jwt({ token, user, account }: { token: JWT; user: any; account: any }) {
      if (user) {
        token.username = user.username;
        token.image = user.image;
      }
      return token;
    }
  },
  pages: {
    signIn: '/account',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

// Create NextAuth handler
const handler = NextAuth(config);

// Export handlers
export const { auth, signIn, signOut } = NextAuth(config);
export const GET = handler;
export const POST = handler;