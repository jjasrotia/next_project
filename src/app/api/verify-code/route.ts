import dbConnect from "@/lib/dbConnect";
import { success, z } from 'zod'
import UserModel from "@/model/user";
import { usernameValidation } from "@/schemas/signupSchema";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, code } = await request.json()
        //decoding values from param query

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })
        if (!user) {
           return Response.json({
                success: false,
                message: "user not found"
            }, { status: 500 })
        }
        const iscodeValid = user.verifyCode === code

        const isCodeNotExpired = new Date(user.verifyCodeExpiry!) > new Date()
        if (iscodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
         return  Response.json({
                success: true,
                message: "Account verified"
            }, { status: 200 })
        }
        else if (!isCodeNotExpired) {
            return Response.json({
                success: true,
                message: "Verification code expired "
            }, { status: 400 })

        }
        else {
            return Response.json({
                success: true,
                message: "incorrect verification code"
            }, { status: 400 })
        }
    } catch (error) {
        console.log("Error verifying user", error)
        return Response.json({
            success: false,
            message: "Error verifying user"
        },
            { status: 500 })

    }
}