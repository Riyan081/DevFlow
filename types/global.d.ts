import { SignInWithOAuthSchema } from './../lib/validations';

interface Tag{
    _id:string;
    name:string;
}

interface Author{
  name: string;
  _id:string;
  
  image:string;
}
interface Question{
    _id:string;
    title:string;
    tags: Tag[];
    author:Author;
    createdAt: Date;
    upvotes:number;
    answers:number;
    views:number;
}

 interface SignInWithOAuthParams{
   provider: 'github' | 'google',
   providerAccountId: string,
    user:{
      name:string;
      username:string;
      email:string;
      image?:string;
    }
 }