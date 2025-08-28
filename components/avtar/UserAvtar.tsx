import React from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback } from '../ui/avatar'
import Image from 'next/image'

const UserAvtar = ({id,name,imageUrl}:{id:string,name:string,imageUrl:string}) => {
    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2);
  return (
    <div>
        <Link href={`/profile/${id}`}  >
          <Avatar className="w-8 h-8">
            {imageUrl ? (
             <Image 
               src={imageUrl}
                alt={name || "User Avatar"}
                width={30}
                height={30}
                className="rounded-full"
                 quality={100}
             
             />
            ):(
              <AvatarFallback className="text-white bg-gradient-to-r from-orange-500 to-orange-400 tracking-wider font-bold">
                {initials}
              </AvatarFallback>
            )
            
            
            }
          </Avatar>
        
        </Link>




    </div>
  )
}

export default UserAvtar