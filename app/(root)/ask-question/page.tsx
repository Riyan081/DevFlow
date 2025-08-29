import QuestionForm from '@/components/forms/QuestionForm'
import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation';

const AskQuestion = async () => {
  const session = await auth();
  if(!session) {
    redirect('/sign-in');
  }

  return (
   
    <>
    <h1 className="text-xl font-bold">Ask a Question</h1>
    <QuestionForm/>
    </>
  )
}

export default AskQuestion