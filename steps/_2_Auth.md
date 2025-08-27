// create component socialAuth

- npm install next-auth@beta
- npx auth secret 



create auth.ts file there are instruction in nextauth
and follow all instructions in guide when necessary i will type 


complete setup till provider github 
npx shadcn@latest add sonner --- little notification 

 create folder constants
 int his create file routes.ts   int this define routes 

add <Toaster/> below theme provider in layout 

---

# NextAuth v5 Setup Process - Complete Guide

## 🔧 Step 1: Installation & Dependencies
```bash
npm install next-auth@5.0.0-beta.29
npm install sonner  # for toasts
```

## 🔑 Step 2: Environment Variables (.env.local)
```env
AUTH_SECRET="your-secret-here"
AUTH_GITHUB_ID="your-github-id"
AUTH_GITHUB_SECRET="your-github-secret"
```

## ⚙️ Step 3: Core Auth Configuration (auth.ts)
```typescript
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    })
  ],
  trustHost: true,
})
```

## 🛡️ Step 4: Middleware (middleware.ts)
```typescript
export { auth as middleware } from "@/auth"
```

## 🌐 Step 5: API Route (app/api/auth/[...nextauth]/route.ts)
```typescript
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

## 🏗️ Step 6: Layout with SessionProvider (app/layout.tsx)
```typescript
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { ReactNode } from "react";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SessionProvider session={session}>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
};
```

## 🔐 Step 7: Client Auth Component
```typescript
"use client"
import { signIn } from 'next-auth/react'

const SocialAuthForm = () => {
  const handleSignin = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <Button onClick={() => handleSignin("github")}>
      Sign in with GitHub
    </Button>
  );
};
```

## 📋 Step 8: Constants (constants/routes.ts)
```typescript
const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up"
}
export default ROUTES;
```

## 🚨 Key Points to Remember

### ✅ DO:
- Use `async` layout with `await auth()`
- Pass `session` prop to `SessionProvider`
- Import `signIn` from `'next-auth/react'` in client components
- Import `auth`, `signOut` from `@/auth` in server components
- Add `suppressHydrationWarning` for browser extensions
- Use `trustHost: true` in auth config

### ❌ DON'T:
- Import `signIn` from `@/auth` in client components
- Forget to make layout `async`
- Skip passing session to SessionProvider
- Use NextAuth v4 syntax with v5 setup

## 🎯 Working Pattern
- **Client components**: Use `next-auth/react` imports
- **Server components**: Use `@/auth` imports
- **Layout**: Always async with session
- **Middleware**: Simple export from auth

## 🔧 Common Issues & Solutions

### Headers Error Fix:
- Ensure layout is `async` and gets session
- Use correct import patterns (client vs server)
- Add `suppressHydrationWarning` for hydration issues

### GitHub OAuth Setup:
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env.local`

**This process creates a fully working NextAuth v5 setup!** 🚀




-- if user uses github oauth well create an account containing github oauth info and then create a user with github name username and image
-- if users uses googles 0auth we will create account containing google oauth info and then create a user with google name, username, and image.
-- if useruses github oauth first then google o auth or vise versa we will create that o auth account and and update user info to show the oauth name and image the username will stay as it has been created it wont fluctuate 