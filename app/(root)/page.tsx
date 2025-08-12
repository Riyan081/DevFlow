import Image from "next/image";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";


export default async function Home() {
  const session = await auth();
  console.log(session);
  return (
   <div suppressHydrationWarning>

   </div>
  );
}
 