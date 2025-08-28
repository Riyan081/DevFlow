"use client"

import React from "react";
import AuthForm from "@/components/forms/AuthForm";
import { SignupSchema } from "@/lib/validations";
import { sign } from "crypto";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
const signup = () => {
  return (
   
      <AuthForm
        formType="SIGN_UP"
        schema={SignupSchema}
        defaultValues={{ email: "", password: "", name: "", username: "" }}
        onSubmit={signUpWithCredentials}
      />
    
  );
};

export default signup;
