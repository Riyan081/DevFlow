import React from "react";
import AnswerCard from "../cards/AnswerCard";
import CommonFilter from "../filters/CommonFilter";
import { AnswerFilters } from "@/constants/filter";
import Pagination from "../Pagination";

interface Props {
  data?: any[];
  success: boolean;
  error?: string | null;
  totalAnswers?: number;
  page:number;
  isNext:boolean;

}

//Example for my refrance how background with gradient and text with gradient exist
//  <div className="relative flex items-center justify-between">
//   {/* Glow background */}
//   <div
//     className="absolute left-1/2 -translate-x-1/2 w-32 h-12 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 blur-2xl opacity-40"
//     aria-hidden="true"
//   />
//   {/* Gradient text */}
//   <h3 className="relative z-10 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
//     {totalAnswers}
//   </h3>
// </div>

const Allanswers = ({page,isNext, data, success, error, totalAnswers }: Props) => {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          {totalAnswers}
          {totalAnswers === 1 ? " Answer" : " Answers"}
        </h3>
       <CommonFilter filters={AnswerFilters}
       otherClasses ="sm:min-w-32"
       containerClasses="max-xs:w-full"
       
       />
      </div>

      <div>
  {success ? (
    <div className="mt-6 space-y-6">
      {data && data.length > 0 ? (
        data.map((answer) => (
          <AnswerCard key={answer._id} {...answer} />
        ))
      ) : (
        <div className="mt-10 flex w-full items-center justify-center">
          <p className="text-black dark:text-amber-50">No Answers Found</p>
        </div>
      )}
    </div>
  ) : (
    <div className="mt-10 flex w-full items-center justify-center">
      <p className="text-red-500">Failed to load answers.</p>
    </div>
  )}
</div>
<Pagination page={page} isNext={isNext}/>
    </div>
  
  );
};

export default Allanswers;
