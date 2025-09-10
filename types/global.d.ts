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


interface Answer{
  _id:string;
  content:string;
  author:Author;
  createdAt:Date;
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

