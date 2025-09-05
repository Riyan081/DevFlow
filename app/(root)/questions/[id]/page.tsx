import UserAvtar from "@/components/avtar/UserAvtar";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import { getQuestion, incrementView } from "@/lib/actions/question.action";
import { after } from "next/server";
import AnswerForm from "@/components/forms/AnswerForm";
import { GetAnswers } from "@/lib/actions/answer.action";
import Allanswers from "@/components/answers/Allanswers";
import Votes from "@/components/votes/votes";

//npm install next-mdx-remote
//npm install bright

// const questions = [
//   {
//     _id: "1",
//     title: "How to learn React?",
//     description: `
// I want to learn React. What are the best resources?

// Here is a simple example of a React component:

// \`\`\`jsx
// import React from "react";

// function HelloWorld() {
//   return <h1>Hello, world!</h1>;
// }

// export default HelloWorld;
// \`\`\`

// Any tips for learning React more efficiently?
//     `,
//     tags: [
//       { _id: "1", name: "React" },
//       { _id: "2", name: "JavaScript" },
//     ],
//     author: {
//       _id: "1",
//       name: "John Doe",
//       image:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTefdAYZ6uy2rn4ODl9zSL1KwCAhiEPo9Xm-g&s",
//     },
//     upvotes: 10,
//     answers: 5,
//     views: 10000000,
//     createdAt: new Date(),
//   },
// ];

const QuestionDetails = async ({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) => {
  const params = await paramsPromise;
  const { id } = params;
  // const [_, { success, data: question }] = await Promise.all([
  //   await incrementView({ questionId: id }),
  //   await getQuestion({
  //     questionId: id,
  //   }),
  // ]);
  //this is called parallel request saves time and good for performance
  //we can only perform this when both request are independent of each other
  //if one request is dependent on other then we have to call them sequentially


  //after
  // its runs async after the response is sent to the client
  //dosent affect response time experienced by the client 
  // its useful for tasks that dont need to block the response such as logging analytics or cleanup operation.


  const { success, data: question } = await getQuestion({
    questionId: id,
  });

  after(async()=>{
    await incrementView({ questionId: id })
  })
//so the swquence is first getquestion will be called then response will send to user like question show hoga uske bad after call hoga for view increment then view increment hoga



  if (!success || !question) {
    return <div>Question not found</div>;
  }
  

  //changing names coz of duplicate names
  const {success:aanswers,data:answerResult,error:answerError} = await GetAnswers({questionId:id,page:1,pageSize:10,filter:'latest'});
  console.log("answerResult",answerResult);
  const { author, createdAt, answers, views, tags, content, title } = question;

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvtar
              id={author._id}
              name={author.name}
              imageUrl={author.image}
              className="size-22"
              fallbackClassName="text-[10px]"
            />
            <Link
              href={`/profile/${author._id}`}
              className="text-sm font-medium text-amber-50"
            >
              <p>{author.name}</p>
            </Link>
          </div>
          <div className="flex justify-end">
         <Votes upvotes={question.upvotes} hasupVoted={true}  downvotes={question.downvotes} hasdownVoted={false} questionId={question._id} />
          </div>
        </div>

        <h2 className="font-semibold text-amber-50 mt-3 w-full">{title}</h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <div>
          <Image
            src="/icons/clock.svg"
            alt="Clock Icon"
            width={16}
            height={16}
            className="inline-block mr-1"
          />
          <span className="text-sm text-amber-50">
            {getTimeStamp(new Date(createdAt))}
          </span>
        </div>
        <div>
          <Image
            src="/icons/message.svg"
            alt="Clock Icon"
            width={16}
            height={16}
            className="inline-block mr-1"
          />
          <span className="text-sm text-amber-50">{answers}</span>
        </div>
        <div>
          <Image
            src="/icons/eye.svg"
            alt="Clock Icon"
            width={16}
            height={16}
            className="inline-block mr-1"
          />
          <span className="text-sm text-amber-50">{formatNumber(views)}</span>
        </div>
      </div>

      <Preview content={content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagCard key={tag._id} {...tag} isPage={false} />
        ))}
      </div>

      <section>
        <Allanswers
        data={answerResult?.answers}
        success={aanswers}
        error={answerError}
        totalAnswers = {answerResult?.totalAnswers || 0}
        />
      </section>
      <section className="my-5">
        <AnswerForm questionId={question._id} questionTitle={question.title} questionContent={question.content}/>


      </section>
    </>
  );
};

export default QuestionDetails;




