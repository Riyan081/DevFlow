import React from "react";
import Link from "next/link";
import Image from "next/image";
import Theme from "./Theme";
import MobileNavigation from "./MobileNavigation";
import { auth } from "@/auth";
import { User } from "lucide-react";
import UserAvtar from "@/components/avtar/UserAvtar";
const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="bg-white dark:bg-[#0A0E12] w-full flex justify-between items-center p-5 dark:shadow-none sm:px-12 gap-5" suppressHydrationWarning>
      <Link href="/" className="flex items-center gap-1">
        <Image
        src="/images/site-logo.svg"
        alt="DevFlow Logo"
        height={23}
        width={23}
        />
        <p className="font-bold font-space-grotesk text-white max-sm:hidden">
          Dev<span className=" ml-0.5  text-orange-400">Flow</span>
        </p>
      </Link>

      <p>Global search</p>

      <div suppressHydrationWarning className="flex gap-4"><Theme/>
     {session?.user?.id && (
  <UserAvtar
   id = {session.user.id}
    name = {session.user.name ?? ""}
    imageUrl = {session.user?.image ?? ""}
  
  />
     )} 
      <div className="block sm:hidden">
        <MobileNavigation />
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
