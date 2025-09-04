import { RequestError } from './../http-errors';
import logger from '../logger';
import handleError from './error';

// Define ActionResponse type
export interface ActionResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
    };
}



interface FetchOptions extends RequestInit{
    timeout?:number;
}

function isError(error:unknown): error is Error{
    return error instanceof Error;
}

export async function fetchHandler<T>(url:string, options: FetchOptions={}):Promise<ActionResponse<T>>{
 const {timeout =500000000,headers:custmHeaders={},...restOptions} = options;

    const controller = new AbortController();
    const id = setTimeout(()=>{
        controller.abort();
    },timeout);


    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
};
 
 const headers: HeadersInit ={...defaultHeaders,...custmHeaders};
 const config:RequestInit = {
    ...restOptions,
    headers,
    signal:controller.signal
 };
 


 try{

    const response = await fetch(url,config);
    clearTimeout(id);
    if(!response.ok){
       throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();

 }catch(err){
   const error = isError(err) ? err : new Error('An unknown error occurred');
   if(error.name === 'AbortError'){
    logger.warn(`Fetch request to ${url} timed out after ${timeout}ms`);
   }
   else{
    logger.error(`Fetch request to ${url} failed: ${error.message}`);
   }
   return handleError(error) as ActionResponse<T>;
 }

}