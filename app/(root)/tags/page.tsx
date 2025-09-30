import React from "react";
import { getTags } from "@/lib/actions/tag.action";
import LocalSearch from "@/components/search/LocalSearch";
import QuestionCard from "@/components/cards/QuestionCard";
import TagCard from "@/components/cards/TagCard";
import CommonFilter from "@/components/filters/CommonFilter";
import { TagFilters } from "@/constants/filter";
interface RouteParam{
  page:string;
  pageSize:string;
  query:string;
  filter:string;

}

interface RouteParams{
  searchParams: Promise<RouteParam>;
}
const Tags = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { tags } = data || {};
  console.log(tags);


  return(
    <>
    <h1 className="font-bold text-xl text-amber-50 mb-4">Tags</h1>

    <section >
      <div className="flex justify-between items-center" >
      <LocalSearch
      route="/tags"
      imgsrc="/icons/search.svg"
      placeholder="Search Tags..."
      otherClasses="flex-1"
      />

      <CommonFilter filters={TagFilters}
       otherClasses="min-h-[40px] w-3 sm:min-w-[170px]"
      />
      </div>


<div className="flex flex-wrap gap-4 mt-8"> 
     {success ? (
  <div className="flex flex-wrap gap-4">
    {tags && tags.length > 0 ? (
      tags.map((tag) => (
        <TagCard key={tag._id}{...tag} isPage={true}/>
      ))
    ) : (
      <div className="mt-10 flex w-full items-center justify-center">
        <p className="text-black  dark:text-amber-50">
          No Tags Found
        </p>
      </div>
    )}
  </div>
) : (
  <div className="mt-10 flex w-full items-center justify-center">
    <p className="text-black  dark:text-amber-50">
      {typeof error === "object" && error !== null && "message" in error
        ? (error as { message: string }).message
        : error || "Failed to fetch "}
    </p>
  </div>
)}
</div>
    </section>
    
    </>
  )
};

export default Tags;
