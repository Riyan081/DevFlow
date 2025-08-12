import React from "react";
import Image from "next/image";
import { ReactNode } from "react";
import SocialAuthForm from "@/components/forms/SocialAuthForm";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex items-center justify-center bg-auth-light dark:bg-auth-dark min-h-screen bg-center bg-no-repeat px-4 py-6 sm:py-10">
      <section className="w-full max-w-md sm:max-w-lg lg:max-w-l bg-white dark:bg-[#0A0E12] border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-none rounded-2xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Join DevFlow</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">To get your questions answered</p>
          </div>
          <Image 
            src="/images/site-logo.svg" 
            alt="DevFlow Logo" 
            height={40} 
            width={40}
            className="sm:h-12 sm:w-12 lg:h-14 lg:w-14  text-orange-400"
          />
        </div>
        
        <div className="space-y-4">
          {children}
        </div>
        
        <SocialAuthForm />
      </section>
    </main>
  );
};

export default AuthLayout;