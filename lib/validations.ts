
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


export const AccountSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Image must be a valid URL").optional(),
  password: z.string().min(1, "Password is required").optional(),
  provider: z.string().min(1, "Provider is required"),
  providerAccountId: z.string().min(1, "Provider Account ID is required"),
});


export const SignInWithOAuthSchema = z.object({
   provider:z.enum(['google','github']),
   providerAccountId:z.string().min(1,{message:"Provider account Id required"}),
   user:z.object({
    name:z.string().min(1,{message:"Name is required"}),
    username:z.string().min(3,{message:"Username must contain atleast 3 characters"}),
    email:z.string().email({message:"please provide valid email address"}),
    image:z.string().url("Invalid image URL").optional(),
   })



   

})

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .min(10, { message: "Title must be at least 10 characters" })
    .max(150, { message: "Title cannot be more than 150 characters" }),
  content: z
    .string()
    .min(1, { message: "Content is required" })
    .min(20, { message: "Content must be at least 20 characters" })
    .max(5000, { message: "Content cannot be more than 5000 characters" }),
  tags: z
    .array(z.string().min(1, { message: "Tag cannot be empty" }))
    .min(1, { message: "At least one tag is required" })
    .max(5, { message: "You can add up to 5 tags" }),
});



export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});

export const GetQuestionSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required" }),
});


export const PaginationSearchSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
})


export const getTagQuestionsSchema = PaginationSearchSchema.extend({
  tagId: z.string().min(1,{message:"Tag ID is required  "})
})


export const IncrementViewSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required" }),
})



export const AnswerSchema = z.object({
   content:z.string().min(50,{message:"Answer must be at least 50 characters"}).max(5000,{message:"Answer cannot be more than 5000 characters"}),
})


export const AnswerServerSchema = AnswerSchema.extend({
  questionId:z.string().min(1,{message:"Question ID is required"})
})



export const GetAnswersSchema = PaginationSearchSchema.extend({
  questionId:z.string().min(1,{message:"Question ID is required"})
})