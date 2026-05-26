import dbConnect from "@/lib/dbConnect";
import { success, z } from 'zod'
import UserModel from "@/model/user";
import { usernameValidation } from "@/schemas/signupSchema";
import { request } from "http";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(req: Request) {

    // if (Request.method !== 'GET') {
    //     return Response.json({
    //         success: false,
    //         message: "Method Not Allowed"
    //     },{status:405})
    // }
    await dbConnect()
    //finding query parasm from url such as userrname
    try {
        const { searchParams } = new URL(req.url)
        const queryParam = {
            username: searchParams.get("username")
        }  //import accepts object
        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "invalid query params"
            }, { status: 400 })

        }
        const { username } = result.data
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifiedUser) {
            return Response.json({
                succes: false,
                message: "username is already taken"
            })
        }
        return Response.json({
            succes: true,
            message: "username is unique"
        })
    } catch (error) {
        console.log("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        },
            { status: 500 })
    }
}