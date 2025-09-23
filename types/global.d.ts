import { SignInWithOAuthSchema } from "./../lib/validations";

interface Tag {
  _id: string;
  name: string;
}

interface Author {
  name: string;
  _id: string;

  image: string;
}
interface Question {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  answers: number;
  views: number;
}

interface SignInWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    email: string;
    image?: string;
  };
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[]; // array of tag names
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

interface GetQuestionParams {
  questionId: string;
}

interface PaginationSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface GetTagQuestionParams extends Omit<PaginationSearchParams, "filter"> {
  tagId: string;
}

interface IncrementViewParams {
  questionId: string;
}


interface AnswerParams{
  content:string;
}


interface CreateAnsewerParams{
  questionId:string;
  content:string;
}


interface GetAnswersParams extends PaginationSearchParams{
  questionId:string;
}


export type Answer = {
  _id: string;
  author: User;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
}

interface CreateVoteParams{
  targetId:string;
  targetType:"question" | "answer";
  voteType:"upvote" | "downvote";
 


}
interface UpdateVoteCountParams extends CreateVoteParams{

 change : 1 | -1;

}

type HasVotedParams = Pick<CreateVoteParams,"targetId" | "targetType">;

interface HasVotedResponse{
  hasUpvoted:boolean;
  hasDownvoted:boolean;
}


interface CollectionBaseParams{
  questionId:string;
}


interface Collection{
  _id:string;
  author: Author | string;
  question: Question | string;
}


interface GetUserParams{
  userId:string;
}


interface User{
  _id:string;
  name:string;
  username:string;
  email:string;
  bio?:string;
  image?:string;
  location?:string;
  portfolio?:string;
  reputation?:number;
  createdAt:Date;
  }


  interface BadgeCounts{
    GOLD:number;
    SILVER:number;
    BRONZE:number;
  }