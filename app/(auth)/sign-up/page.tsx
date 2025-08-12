"use client"

import React from "react";
import AuthForm from "@/components/forms/AuthForm";
import { SignupSchema } from "@/lib/validations";
const signup = () => {
  return (
    <div>
      <AuthForm
        formType="SIGN_UP"
        schema={SignupSchema}
        defaultValues={{ email: "", password: "", name: "", username: "" }}
        onSubmit={(data) => Promise.resolve({ success: true, data })}
      />
    </div>
  );
};

export default signup;
