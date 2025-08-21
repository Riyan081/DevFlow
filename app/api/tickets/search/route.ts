import tickets from '@/database/database';

import { NextRequest, NextResponse } from "next/server";

//api/tickets/search?query=hi there
//{query="hi there"}
export async function GET(request:NextRequest){
  const useSearchParams = request.nextUrl.searchParams;
  const query = useSearchParams.get("query");

  if(!query){
    return NextResponse.json({message:"Query parameter is required"}, {status:400});
  }
  
  const tickitfilter = tickets.filter((ticket)=> ticket.name.toLowerCase().includes(query.toLowerCase()));
  return NextResponse.json(tickitfilter);
}
