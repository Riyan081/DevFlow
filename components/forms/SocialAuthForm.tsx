"use client"

import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { toast } from 'sonner'
import ROUTES from '@/constants/routes'
import { signIn } from 'next-auth/react'

const SocialAuthForm = () => {
  const handleSignin = async (provider: "github" | "google") => {
    console.log("🔄 Starting signin with:", provider);
    try {
      
      
      const result = await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        redirect: true,
      });
      console.log("✅ SignIn result:", result);
    } catch (e) {
      console.log("❌ SignIn error:", e);
      toast.error("Sign-in Failed", {
        description: e instanceof Error ? e.message : "An error has occurred",
      });
    }
  };
  return (
    <div className="flex flex-wrap gap-3 mt-5 justify-center">
      <Button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 px-8 py-5 transition-colors duration-200 rounded-lg"
       onClick={()=>{
        handleSignin("github");
       }}
       >
        <Image 
          src="/icons/github.svg"
          alt="Github Logo"
          height={20}
          width={20}
          className="object-contain filter brightness-0 invert"
        /> 
        <span className="text-white dark:text-white font-medium">Log in with Github</span>
      </Button>

      <Button className="flex items-center gap-2 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 px-8 py-5 transition-colors duration-200 rounded-lg"
       onClick={()=>{handleSignin("google")}}
       >
        <Image 
          src="/icons/google.svg"
          alt="Google Logo"
          height={20}
          width={20}
          className="object-contain"
        /> 
        <span className="text-gray-900 dark:text-amber-50 font-medium">Log in with Google</span>
      </Button>
    </div>
  )
}

export default SocialAuthForm

