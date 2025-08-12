"use client"

import React from 'react'
import AuthForm from '@/components/forms/AuthForm'
import { SigninSchema } from '@/lib/validations'

const page = () => {
  return (
    <div><AuthForm
    formType="SIGN_IN"
    schema = {SigninSchema}
    defaultValues = {{email:"", password:""}}
    onSubmit={(data)=> Promise.resolve({success: true,data})}
    
    
    /></div>
  )
}

export default page