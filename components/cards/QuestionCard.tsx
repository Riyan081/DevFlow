import { getTimeStamp } from '@/lib/utils';
import React from 'react'
import ROUTES from '@/constants/routes';
import Link from 'next/link';
import TagCard from './TagCard';
import Image from 'next/image';

interface Props {
  question: Question;
}

const QuestionCard = ({
  question: { _id, title, tags, author, createdAt, upvotes, answers, views }
}: Props) => {
  return (
    <div className="bg-white dark:bg-[#181818] rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 p-6 m-8 transition hover:shadow-lg flex flex-col gap-4">
      {/* Top: Time */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{getTimeStamp(createdAt)}</span>
      </div>
      {/* Title */}
      <Link href={ROUTES.QUESTION(_id)}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors mb-1 line-clamp-2">
          {title}
        </h3>
      </Link>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-1">
        {tags.map((tag: Tag) => (
          <TagCard
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            compact
          />
        ))}
      </div>
      {/* Bottom: Author and Stats */}
      <div className="flex items-end justify-between mt-2">
        {/* Author */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">Asked by</span>
          <Image
            src={author.image}
            width={32}
            height={32}
            alt="authorimg"
            className="w-8 h-8 object-cover object-center rounded-full border border-gray-300 dark:border-gray-700"
          />
          <span className="font-medium text-gray-700 dark:text-gray-200">{author?.name || "Anonymous"}</span>
        </div>
        {/* Stats */}
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1 font-semibold text-green-600 dark:text-green-400">
            {upvotes} <span className="hidden sm:inline">↑</span>
          </span>
          <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
            {answers} <span className="hidden sm:inline">💬</span>
          </span>
          <span className="flex items-center gap-1 font-semibold text-orange-500">
            {views} <span className="hidden sm:inline">👁️</span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default QuestionCard