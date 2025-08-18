import Image from "next/image";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter"
import QuestionCard from "@/components/cards/QuestionCard";


  const questions = [
    {
      _id: "1",
      title: "How to learn react",
      description: "I want to learn react, what are the best resources?",
      tags:[
        {_id: "1", name:"React"},
        {_id:"2", name:"JavaScript"},
       ],
      author:{
        _id: "1",
        name: "John Doe",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTefdAYZ6uy2rn4ODl9zSL1KwCAhiEPo9Xm-g&s"
      },
      upvotes:10,
      answers:5,
      views:100,
      createdAt: new Date(),
    },
    {
      _id: "2",
      title: "What is the best way to learn Next.js?",
      description: "I am new to Next.js, any tips?",
      tags:[
        {_id: "3", name:"javascript"},
        {_id:"4", name:"React"},
       ],
       author:{
        _id: "2",
        name: "Doe",
          image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTefdAYZ6uy2rn4ODl9zSL1KwCAhiEPo9Xm-g&s"
      },
      upvotes:20,
      answers:10,
      views:200,
      createdAt: new Date(),
    }
  ];
 
  //this is for symultanous result with search 
  interface SearchParams{
    searchParams: Promise<{[key:string]: string}>
  }


export default async function Home({searchParams}: SearchParams) {
  //  const session = await auth();
  //  console.log(session);

  const {query = "",filter=""} = await searchParams;
   
   const filteredQuestions = questions.filter((question)=>{
     const matchQuery = question.title.toLowerCase().includes(query.toLowerCase());
     const matchFilter = filter? question.tags[0].name.toLowerCase() === filter.toLowerCase() : true;
     return matchQuery && matchFilter;
  })
  // const filterQuestions = questions.filter((question)=>(
  //   question.title.toLowerCase().includes(query?.toLowerCase())
  // ))

  return (
    <>
      <section className="flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center ">
        <h1 className="font-bold text-xl">All Questions</h1>
        <Button className="bg-gradient-to-r from-orange-400 to-orange-300">
          <Link href={ROUTES.ASK_QUESTION}> Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgsrc="/icons/search.svg"
          placeholder="Search Question..."
          otherClasses="flex-1"
        />
      </section>
     <HomeFilter/>
     <div>
      {filteredQuestions.map((question)=>(
     <QuestionCard key={question._id} question={question}/>
      ))}
     </div>
    </>
  );
}
