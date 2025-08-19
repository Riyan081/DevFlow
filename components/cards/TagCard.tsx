import React from 'react'
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { getDeviconsClassName } from '@/lib/utils';
import Image from 'next/image';
interface Props{
    _id:string;
    name:string;
    questions?:number;
    showCount?:boolean;
    compact?:boolean;
    isQuestionTag? : boolean;
    removeTag?: (tag:string) => void;
}



const TagCard = ({_id, name,questions,showCount,compact,isQuestionTag,removeTag}:Props) => {
  const iconClass = getDeviconsClassName(name);
return (
  isQuestionTag ? (
    <Badge className="px-4 py-1 text-[15px] my-1 bg-[#0A0E12] text-white/60 flex items-center border border-gray-700 ">
        <div className="flex items-center space-x-2">
          <i className={`${iconClass}`}></i>
          <span>{name.toUpperCase()}</span>
          <Image 
          src="/icons/close.svg"
          height={12}
          width={12}
          alt="tag image"
          className=" cursor-pointer invert-0 dark:invert"
          onClick={()=>{removeTag?.(name)}}
          />
        </div>
      </Badge>
  ) : (
    <Link href={`/tags/${_id}`} className="flex justify-between">
      <Badge className="px-4 py-1 text-[15px] my-1 bg-[#0A0E12] text-white/60 flex items-center">
        <div className="flex items-center space-x-2">
          <i className={`${iconClass}`}></i>
          <span>{name.toUpperCase()}</span>
        </div>
      </Badge>
      {showCount && (
        <p>{questions}</p>
      )}
    </Link>
  )
);
}

export default TagCard