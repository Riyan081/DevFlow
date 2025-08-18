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

export const getTimeStamp = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}