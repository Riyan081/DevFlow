import Image from "next/image";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/cards/QuestionCard";
import { api } from "@/lib/api";
import { getQuestions } from "@/lib/actions/question.action";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_QUESTION } from "@/constants/states";
import CommonFilter from "@/components/filters/CommonFilter";
import { HomepageFilters } from "@/constants/filter";
import Pagination from "@/components/Pagination";

// const questions = [
//   {
//     _id: "1",
//     title: "How to learn react",
//     description: "I want to learn react, what are the best resources?",
//     tags:[
//       {_id: "1", name:"React"},
//       {_id:"2", name:"JavaScript"},
//      ],
//     author:{
//       _id: "1",
//       name: "John Doe",
//       image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTefdAYZ6uy2rn4ODl9zSL1KwCAhiEPo9Xm-g&s"
//     },
//     upvotes:10,
//     answers:5,
//     views:100,
//     createdAt: new Date(),
//   },
//   {
//     _id: "2",
//     title: "What is the best way to learn Next.js?",
//     description: "I am new to Next.js, any tips?",
//     tags:[
//       {_id: "3", name:"javascript"},
//       {_id:"4", name:"React"},
//      ],
//      author:{
//       _id: "2",
//       name: "Doe",
//         image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTefdAYZ6uy2rn4ODl9zSL1KwCAhiEPo9Xm-g&s"
//     },
//     upvotes:20,
//     answers:10,
//     views:200,
//     createdAt: new Date(),
//   }
// ];

const test = async () => {
  try {
    return await api.users.getAll();
  } catch (err) {
    console.error("Error in test function:", err);
  }
};

//this is for symultanous result with search
interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function Home({ searchParams }: SearchParams) {
  const session = await auth();
  console.log(session);
  console.log("Before test");
  // const {query = "",filter=""} = await searchParams;

  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 2,
    query: query || "",
    filter: filter || "",
  });

  const { questions, isNext } = data || {};

  //  const filteredQuestions = questions.filter((question)=>{
  //    const matchQuery = question.title.toLowerCase().includes(query.toLowerCase());
  //    const matchFilter = filter? question.tags[0].name.toLowerCase() === filter.toLowerCase() : true;
  //    return matchQuery && matchFilter;
  // })

  return (
    <>
      <section className="flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center ">
        <h1 className="font-bold text-xl">All Questions</h1>
        <Button className="bg-gradient-to-r from-orange-400 to-orange-300">
          <Link href={ROUTES.ASK_QUESTION}> Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          imgsrc="/icons/search.svg"
          placeholder="Search Question..."
          otherClasses="flex-1"
        />

        <CommonFilter
        filters={HomepageFilters}
        otherClasses = "min-h-[56px] sm:min-w-[170px]"
        containerClasses = "hidden max-md:flex"
        
        />
      </section>
      <HomeFilter />
      
      

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
            {error?.message || "Failed to fetch "}
          </p>
        </div>
      )}
      <Pagination page={Number(page) || 1} isNext={!!isNext}/>
    </>
  );
}
