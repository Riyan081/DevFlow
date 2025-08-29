import React from 'react'

const QuestionDetails = async ({ params: paramsPromise }: { params: Promise<{ id: string }> }) => {
    const params = await paramsPromise;
    const { id } = params;
    
  return (
    <div>QuestionDetails{id}</div>
  )
}

export default QuestionDetails;