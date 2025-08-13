"use client";

import React, { useEffect, useState } from "react";
import { sidebarlinks } from "@/constants/sidebarlinks";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";

const Navlinks = ({ isMobileNav = false }: { isMobileNav?: boolean }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const userId = 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn("space-y-2", isMobileNav ? "w-full" : "")}>
        {sidebarlinks.map((item) => (
          <div
            key={item.label}
            className={cn(
             
              isMobileNav ? "w-full" : ""
            )}
          >
            <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 bg-gray-300 rounded animate-pulse flex-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("space-y-4", isMobileNav ? "w-full" : "")}
      suppressHydrationWarning
    >
      {sidebarlinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        let finalRoute = item.route;
        if (item.route === "/profile") {
          if (userId) {
            finalRoute = `${item.route}/${userId}`;
          } else {
            return null;
          }
        }

        const linkComponent = (
          <Link
            href={finalRoute}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              isActive
                ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg"
                : isMobileNav
                ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                : "text-gray-900  hover:bg-gray-50 dark:text-gray-300  dark:hover:bg-gray-800  ",
              isMobileNav ? "w-full" : ""
            )}
            suppressHydrationWarning
          >
            <Image
              src={item.imgURL}
              height={20}
              width={20}
              alt={item.label}
              className={cn(
                "transition-all duration-200",
                isActive
                  ? "brightness-0 invert"
                  : isMobileNav
                  ? "brightness-0 invert opacity-70 group-hover:opacity-100"
                  : "opacity-80 group-hover:opacity-100 dark:brightness-0 dark:invert dark:opacity-70 dark:group-hover:opacity-100"
              )}
              suppressHydrationWarning
            />
            <p
              className={cn(
                "font-medium transition-all duration-200",
                isActive
                  ? "text-white font-semibold"
                  : isMobileNav
                  ? "text-gray-300 group-hover:text-white"
                  : "text-gray-900 group-hover:text-black dark:text-gray-300 dark:group-hover:text-white",
                isMobileNav ? "text-base" : "text-sm",
                "hidden lg:block" // Hide text below lg (tab width)
              )}
              suppressHydrationWarning
            >
              {item.label}
            </p>
          </Link>
        );

        // Wrap with SheetClose for mobile navigation
        return isMobileNav ? (
          <SheetClose asChild key={item.label}>
            {linkComponent}
          </SheetClose>
        ) : (
          <div key={item.label}>{linkComponent}</div>
        );
      })}
    </div>
  );
};

export default Navlinks;
