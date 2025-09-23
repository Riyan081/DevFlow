import React from "react";
import Navlinks from "./navbar/Navlinks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { auth } from "@/auth";
import { signOut } from "@/auth";
import { api } from "@/lib/api";

const LeftSidebar = async () => {
  const session = await auth();
    const email = session?.user?.email;
  
  let userId = null;
  
  if (email) {
    try {
      // ✅ Use your API response format (message + data)
      const response = (await api.users.getByEmail(email)) as APIResponse<IUser>;
      
      // ✅ Check for data directly (since your API doesn't return success field)
      if (response.data) {
        userId = response.data._id;
      } else {
        console.error("API Error:", response.message);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  return (
    <div className="bg-[#121212] left-0 top-0 p-2 gap-4 max-sm:hidden lg:w-[210px] md:w-[64px] flex flex-col justify-between" style={{ height: "calc(100vh - 78px)" }}>
      <div>
        <Navlinks userId = {userId} />
      </div>

      {userId ? (
       <form action={async ()=>{
        "use server"
        await signOut();
       }}>
        <Button type="submit" className="w-fit px-15 py-4 mx-2 !bg-transparent text-amber-50 border-red-50 border-2">Logout</Button>
       </form>
      ):(<div className="flex flex-col gap-2 items-center">
       
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
   
    )}
     </div>
      
  );
};

export default LeftSidebar;
