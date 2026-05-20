import {z} from "zod"


export const usernameValidation = z
.string()
.min(2,"Username must be atleast 2 charaters")
.max(20, "Username must be no more than 0 chars")
.regex(/[a-zA-Z][a-zA-Z0-9-_]{3,32}/gi,"Username must not contain special char")


export const signUpSchema = z.object({
    username :usernameValidation,
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(6,"password must be atleast 6 chars")
})