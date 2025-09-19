import { getSavedQuestion } from "@/lib/actions/collection.action";

import React from "react";
import LocalSearch from "@/components/search/LocalSearch";
import QuestionCard from "@/components/cards/QuestionCard";
import { CollectionFilters } from "@/constants/filter";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}
const Collections = async ({ searchParams }: SearchParams) => {
  const { query, filter, page, pageSize } = await searchParams;

  const { success, data, error } = await getSavedQuestion({
    query: query || "",
    filter: filter || "",
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const { questions,isNext } = data || {};

  return(
   <>
   <h1 className="mb-5">Saved Questions</h1>

   <LocalSearch
   route="/collection"
   imgsrc="/icons/search.svg"
   placeholder="Search Questions"
   otherClasses = "flex-1 "   
   />
   <CommonFilter
    filters={CollectionFilters}
    otherClasses = "min-h-[56px] sm:min-w-[170px] mt-5"
   />
   

  {success ? (
        <div>
          {questions && questions.length > 0 ? (
            questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))
          ) : (
            <div className="mt-10 flex w-full items-center justify-center">
              <p className="text-black  dark:text-amber-50">
                No Questions Found
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-10 flex w-full items-center justify-center">
          <p className="text-black  dark:text-amber-50">
            { "Failed to fetch "}
          </p>
        </div>
      )}
   <Pagination page={page} isNext={!!isNext}/>
   </>


  )
};

export default Collections;
