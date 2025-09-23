import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Props{
 imgUrl: string;
 title: string;
 href?: string;
}

const ProfileLink = ({ imgUrl, title, href }: Props) => {
  return (
    <div className="flex items-center gap-3 group">
      {/* Icon with enhanced styling */}
      <div className="flex items-center justify-center w-5 h-5 rounded-sm bg-muted/30 p-1 group-hover:bg-muted/50 transition-colors duration-200">
        <Image
          src={imgUrl}
          alt={title}
          width={14}
          height={14}
          className="opacity-70 dark:opacity-80 group-hover:opacity-90 transition-opacity duration-200 dark:invert-0 filter"        
        />
      </div>

      {/* Text content with improved styling */}
      {href ? (
        <Link 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-all duration-200 underline-offset-2"
        >
          {title}
        </Link>
      ) : (
        <p className="text-sm font-medium text-muted-foreground dark:text-gray-300 group-hover:text-foreground dark:group-hover:text-gray-200 transition-colors duration-200">
          {title}
        </p> 
      )}
    </div>
  )
}

export default ProfileLink

