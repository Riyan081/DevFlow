import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { api } from "@/lib/api"; // ✅ Make sure this exists
import { ActionResponse } from "@/lib/handlers/fetch"; // ✅ Fixed import path

// ✅ Main NextAuth configuration
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!, // ✅ add in .env.local
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    // ✅ Adds user.id to session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },

    // ✅ Runs when creating JWT token
    async jwt({ token, account }) {
      if (account) {
        try {
          // ✅ Look up existing account from your API
          const { data: existingAccount, success } =
            await api.accounts.getByProvider(
              account.type === "credentials"
                ? token.email!
                : account.providerAccountId
            );

          if (success && existingAccount) {
            const userId = (existingAccount as { userId?: string | number }).userId;
            if (userId) {
              token.sub = userId.toString();
            }
          }
        } catch (err) {
          console.error("JWT callback error:", err);
        }
      }

      return token;
    },

    // ✅ Runs when user signs in
    async signIn({ user, account, profile }) {
      if (account?.type === "credentials") return true;
      if (!account || !user) return false;

      try {
        const userInfo = {
          name: user.name ?? "Unknown",
          email: user.email ?? "",
          image: user.image ?? "",
          username:
            account.provider === "github"
              ? (profile?.login as string)
              : user.name?.toLowerCase() ?? "",
        };

        const { success } = (await api.auth.oAuthSignIn({
          user: userInfo,
          provider: account.provider as "github" | "google",
          providerAccountId: account.providerAccountId,
        })) as ActionResponse<any>;

        return success;
      } catch (err) {
        console.error("SignIn callback error:", err);
        return false;
      }
    },
  },
});
