import tickets from "@/database/database";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(tickets);
}

export async function POST(request: Request) {
  const newTicket = await request.json();
  const new2 = {
    id: tickets.length + 1,
    ...newTicket,
  };
  tickets.push(new2);
  /*
    
    tickets.push({
    id: tickets.length + 1,
    ...newTicket
})
*/
  return NextResponse.json(
    { message: "Ticket created successfully", ticket: new2},
    { status: 201 }
  );
}
