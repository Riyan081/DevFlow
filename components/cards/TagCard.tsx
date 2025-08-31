import React from 'react'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import { getDeviconsClassName, getTechDescription } from '@/lib/utils'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface Props {
  _id: string
  name: string
  questions?: number
  showCount?: boolean
  compact?: boolean
  isQuestionTag?: boolean
  isPage?: boolean
  removeTag?: (tag: string) => void
}

const TagCard = ({
  _id,
  name,
  questions,
  showCount,
  compact,
  isQuestionTag,
  removeTag,
  isPage,
}: Props) => {
  const iconClass = getDeviconsClassName(name)
  const iconDescription = getTechDescription(name)

  // If used as a removable tag (e.g. in a question form)
  if (isQuestionTag) {
    return (
      <Badge className="px-4 py-1 text-[15px] my-1 bg-[#0A0E12] text-white/60 flex items-center border border-gray-700">
        <div className="flex items-center space-x-2">
          <i className={iconClass} title={iconDescription}></i>
          <span>{name ? name.toUpperCase() : "UNKNOWN"}</span>
          <button
            type="button"
            aria-label="Remove tag"
            onClick={() => removeTag?.(name)}
            className="ml-1"
          >
            <Image
              src="/icons/close.svg"
              height={12}
              width={12}
              alt="Remove tag"
              className="cursor-pointer invert-0 dark:invert"
            />
          </button>
        </div>
      </Badge>
    )
  }
if (isPage) {
  return (
    <Link href={`/tags/${_id}`} >
      <article
        className="
          flex flex-col justify-between h-full
          bg-white dark:bg-[#18181b]
          border border-gray-200 dark:border-gray-700
          rounded-xl shadow-md
          p-5
          transition
          hover:shadow-lg hover:border-orange-400
         
          min-h-[180px]
          w-[18vw]
        "
      >
        <div className="flex items-center gap-3 mb-3">
          <i className={cn(iconClass, "text-3xl text-gray-500 dark:text-gray-300 group-hover:text-orange-400")} />
          <span className="font-semibold text-lg text-gray-800 dark:text-amber-50 tracking-wide capitalize">{name}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 mb-4 line-clamp-2">{iconDescription}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            <span className="font-bold text-orange-500 dark:text-orange-400">{questions ?? 0}</span> Questions
          </span>
          <span className="text-xs text-blue-500 group-hover:underline">Questions</span>
        </div>
      </article>
    </Link>
  )
}

  // Default: tag as a link (e.g. on tags page)
  return (
    <Link href={`/tags/${_id}`} className="flex justify-between items-center group">
      <Badge className="px-4 py-1 text-[15px] my-1 bg-[#0A0E12] text-white/60 flex items-center group-hover:bg-orange-400 transition">
        <div className="flex items-center space-x-2">
          <i className={iconClass} title={iconDescription}></i>
          <span>{name ? name.toUpperCase() : "UNKNOWN"}</span>
        </div>
      </Badge>
      {showCount && (
        <span className="ml-2 text-xs text-gray-400">{questions}</span>
      )}
    </Link>
  )
}

export default TagCard