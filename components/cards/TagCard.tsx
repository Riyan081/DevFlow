import React from 'react'
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { getDeviconsClassName } from '@/lib/utils';
interface Props{
    _id:string;
    name:string;
    questions:number;
    showCount:boolean;
    compact:boolean;
}



const TagCard = ({_id, name,questions,showCount,compact}:Props) => {
  const iconClass = getDeviconsClassName(name);
  return (

   <Link href={`/tags/${_id}`} className="flex justify-between">
    <Badge className="px-4 py-1 text-[15px] my-1 bg-[#0A0E12] text-white/60">
    <div className="flex space-x-2">
        <i className={`${iconClass}`}></i>
        <span>{name.toUpperCase()}</span>
    </div>
    </Badge>
    {showCount && (
      <p>{questions}</p>
    )}
   
   </Link>
  )
}

export default TagCard