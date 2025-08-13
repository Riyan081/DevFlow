import React from "react";
import Navlinks from "./navbar/Navlinks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ROUTES from "@/constants/routes";


const LeftSidebar = () => {
  return (
    <div className="bg-[#121212] left-0 top-0 p-2 gap-4 max-sm:hidden lg:w-[210px] md:w-[64px] flex flex-col justify-between" style={{ height: "calc(100vh - 78px)" }}>
      <div>
        <Navlinks />
      </div>
      <div className="flex flex-col gap-2 items-center">
       
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors">
          <Link href={ROUTES.SIGN_IN}>Log in</Link>
        </Button>
        <Button
          variant="outline"
          className="w-full border-gray-600 bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white py-3 rounded-lg transition-colors"
        >
          <Link href={ROUTES.SIGN_UP}>Sign up</Link>
        </Button>
      </div>
    </div>
  );
};

export default LeftSidebar;
