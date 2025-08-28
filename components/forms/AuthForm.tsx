"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 import { FieldValues } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { DefaultValues } from "react-hook-form"
import { SubmitHandler } from "react-hook-form"
import { ZodType } from "zod"
import { Control } from "react-hook-form"
import { Resolver } from "react-hook-form"
import Link from "next/link"
import ROUTES from "@/constants/routes" 


import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ActionResponse } from "@/lib/handlers/fetch"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Path } from "react-hook-form"



interface AuthFormProps<T extends FieldValues>{
    schema:ZodType<T>;
    defaultValues:T;
    onSubmit:(data:T)=>Promise<ActionResponse>;
    formType:'SIGN_IN' | "SIGN_UP";
}
const AuthForm = <T extends FieldValues>({
    schema,
    defaultValues,
    formType,
    onSubmit,
}:AuthFormProps<T>) =>{
  // 1. Define your form.
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>
  })
 
  const handleSubmit: SubmitHandler<T> = async(data)=>{ 
    const result = (await onSubmit(data)) as ActionResponse<T>;

    if(result?.success){
      toast(
        formType === "SIGN_IN"
          ? "You have successfully signed in."
          : "Your account has been created successfully."
      );
      router.push(ROUTES.HOME);
    } else{
      toast.error(result?.message || "An error occurred. Please try again.");
    }
  };

  const buttonText = formType ==="SIGN_IN"? 'Sign In': "Sign Up";


   return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {Object.keys(defaultValues).map((field)=>(
 <FormField 
 key={field}
          control={form.control}
          name={field as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{field.name==='email'? "Email Address ": field.name.charAt(0).toUpperCase()+field.name.slice(1)}</FormLabel>
              <FormControl>
                <Input required type={field.name==="password" ? "password" : "text"} {...field}
                className="mt-1"/>
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
        
       
        <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-200" type="submit">
          {form.formState.isSubmitting
            ? (buttonText === 'Sign In' ? 'Signing In...' : 'Signing Up...')
            : buttonText}
        </Button>

        {formType === "SIGN_IN" ? (
        <p>
            Dont't have an account?{" "}
            <Link href={ROUTES.SIGN_UP}
            className="bg-gradient-to-r from-orange-500 to-orange-200 bg-clip-text text-transparent font-semibold hover:from-orange-200 hover:to-orange-500">
              Sign Up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link href={ROUTES.SIGN_IN}
            className="bg-gradient-to-r from-orange-500 to-orange-200 bg-clip-text text-transparent font-semibold hover:from-orange-200 hover:to-orange-500">
              Sign In
            </Link>
          </p>
        )}
      </form>
    </Form>
  )

}

export default AuthForm