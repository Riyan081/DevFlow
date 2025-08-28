import React from "react";
import Image from "next/image";
import Navlinks from "./Navlinks";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { signOut } from "@/auth";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileNavigation = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  return (
    <Sheet>
      <SheetTrigger suppressHydrationWarning>
        <Image
          src="/icons/hamburger.svg"
          width={36}
          height={36}
          className="brightness-0 dark:brightness-0 dark:invert"
          alt=""
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="bg-[#121212] border-r border-gray-800 w-80 p-0"
        suppressHydrationWarning
      >
        <SheetHeader className="px-6 py-4 border-b border-gray-800">
          <SheetTitle className="flex items-center" suppressHydrationWarning>
            <Image
              src="/images/site-logo.svg"
              width={28}
              height={28}
              alt="logo"
              className="rounded-lg"
            />
            <p className="font-bold ml-3 text-xl text-white">
              Dev<span className="ml-0.5 text-orange-500">Flow</span>
            </p>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Navigation menu
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 px-6 py-6 space-y-6 overflow-y-auto scrollbar-hide">
            <nav className="space-y-2">
              <SheetClose asChild>
                <div>
                  <Navlinks isMobileNav={true} />
                </div>
              </SheetClose>
            </nav>
          </div>
          {userId ? (
            <SheetClose asChild>
               <form action={async ()=>{
                      "use server"
                      await signOut();
                     }}>
                      <Button type="submit" className="w-fit px-15 py-4 mx-2 !bg-transparent text-amber-50 border-red-50 border-2">Logout</Button>
                     </form>
            </SheetClose>
          ) : (
            <div className="p-6 border-t border-gray-800 space-y-3">
              <SheetClose asChild>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors">
                  Log in
                </Button>
              </SheetClose>

              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="w-full border-gray-600 bg-gray-900 dark: text-gray-300 hover:bg-gray-800 hover:text-white py-3 rounded-lg transition-colors"
                >
                  Sign up
                </Button>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
