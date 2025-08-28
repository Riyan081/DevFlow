
"use server"

import {ZodSchema} from "zod"
import { Session } from 'next-auth';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongoose';


type ActionOptions<T> = {
  params?:T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

 async function action<T>({
    params,
    schema,
    authorize = false,
}: ActionOptions<T>){
    if(schema && params){
        try{
          schema.parse(params);

        }catch(e){
            throw new Error("Invalid parameters");
        }
    }

    let session : Session | null = null;
    if(authorize){
       session = await auth();
       if(!session){
        throw new Error("Unauthorized");
       }
    }

    await dbConnect();
    return {params, session};

}

export default action;