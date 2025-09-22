import React from "react";
import Link from "next/link";
import Image from "next/image";
import TagCard from "../cards/TagCard";

const popularTags = [
  {
    _id: "1",
    name: "react",
    questions: 100,
  },
  {
    _id: "2",
    name: "nextjs",
    questions: 80,
  },
  { _id: "3", name: "javascript", questions: 120 },
  {
    _id: "4",
    name: "css",
    questions: 90,
  },
  {
    _id: "5",
    name: "html",
    questions: 70,
  },
];
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopTags } from "@/lib/actions/tag.action";
const RightSidebar = async () => {
  // did this so then are not dependant on each other and can run in parallel
  //great optimization technique
  
  // const [hotQuestions,topTags] = await Promise.all([getHotQuestions(),getTopTags()]);
  //
  const [
    { success, data: hotQuestions, error },
    { success: tagSuccess, data: tagData, error: tagError },
  ] = await Promise.all([getHotQuestions(), getTopTags()]);

  return (
    <section className="bg-white dark:bg-[#121212] sticky right-0 top-0 w-[300px] flex flex-col gap-6 overflow-y-auto border-l max-md:hidden pt-3 pl-6 pr-5 ">
      <div>
        <h3 className="font-bold mb-5">Top Questions </h3>
        <div className="flex flex-col gap-4">
          {hotQuestions.map(({ _id, title }) => (
            <Link
              key={_id}
              href={`/question/${_id}`}
              className=" flex cursor-pointer items-center justify-between"
            >
              <p>{title}</p>
              <Image
                src="/icons/chevron-right.svg"
                height={20}
                width={20}
                alt="Chevron"
              />
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold mb-5">Popular Tags</h3>

        <div>
          {tagData.map(({ _id, name, questions }) => (
            <TagCard
              key={_id}
              _id={_id}
              name={name}
              questions={questions}
              showCount
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
