import React from 'react';
import { Answer } from '@/types/global';
import UserAvtar from '../avtar/UserAvtar';
import Link from 'next/link';
import { getTimeStamp } from '@/lib/utils';
import Preview from '../editor/Preview';

const AnswerCard = ({ _id, author, content, createdAt }: Answer) => {
  return (
    <article className="py-10">
      <span id={JSON.stringify(_id)} className="mt-[-140px] block pb-[140px]" />
      <div>
        <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex items-center gap-2">
            <UserAvtar
              id={author._id}
              name={author.name}
              imageUrl={author.image ?? ""}
              className="size-8 rounded-full object-cover max-sm:mt-2"
            />
            <Link
              href={`/profile/${author._id}`}
              className="flex flex-col sm:flex-row sm:items-center ml-1"
            >
              <p className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent font-semibold">
                {author.name ?? "Anonymous"}
              </p>
            </Link>
          </div>
          <p className="line-clamp-1 ml-0.5 mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            <span className="max-sm:hidden"> • </span>
            answered {getTimeStamp(createdAt)}
          </p>
        </div>
        <div className="flex justify-end text-xs text-gray-400 mb-2">Votes</div>
        <div className="w-full max-w-full break-all">
  <Preview content={content} />
</div>
      </div>
    </article>
  );
};

export default AnswerCard;