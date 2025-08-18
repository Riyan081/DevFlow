import { z } from "zod";

export const SigninSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Please provide a valid email"),

  password: z
    .string()
    .min(6, { message: "Password must be of 8 characters" })
    .max(100, "password cannot be more than 10"),
});


export const SignupSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name cannot be more than 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" }),

  username: z
    .string()
    .min(1, { message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username cannot be more than 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Please provide a valid email"),

  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password cannot be more than 100 characters" })
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: "Password must contain at least one uppercase letter, one lowercase letter, and one number" 
    }),
});

