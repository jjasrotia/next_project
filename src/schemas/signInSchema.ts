import {z} from "zod"


export const signInSchema= z.object({
    identifierL:z.string(),
    password:z.string()
})