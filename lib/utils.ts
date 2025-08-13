import { clsx, type ClassValue } from "clsx"
import next from "next";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getDeviconsClassName = (techName:string)=>{
   const normalizedTechName = techName.replace(/[ .]/g,"").toLowerCase();

   const techMap:{[Key:string]:string}={
      javascript :"devicon-javascript-plain",
      js:"devicon-javascript-plain",
      typescript:"devicon-typescript-plain",
      ts:"devicon-typescript-plain",
      python:"devicon-python-plain",
      java:"devicon-java-plain",
      
      
      nextjs:"devicon-nextjs-plain",
      next:"devicon-nextjs-plain",

      html:"devicon-html5-plain",
      css:"devicon-css3-plain",
       
      react:"devicon-react-original",
   }

   return `${techMap[normalizedTechName]} colored`||
   "devicon-devicon-plain";
}

