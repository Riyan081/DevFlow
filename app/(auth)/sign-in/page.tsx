"use client"

import React from 'react'
import AuthForm from '@/components/forms/AuthForm'
import { SigninSchema } from '@/lib/validations'
import { signInWithCredentials } from '@/lib/actions/auth.action'

const page = () => {
  return (
    <div><AuthForm
    formType="SIGN_IN"
    schema = {SigninSchema}
    defaultValues = {{email:"", password:""}}
    onSubmit={signInWithCredentials}
    
    
    /></div>
  )
}

export default page