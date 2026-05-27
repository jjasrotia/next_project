import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user";
import { User } from "next-auth";
import { success } from "zod";


export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "not authenticated"
        }, { status: 401 })
    }
    const userId = user._id
    const { acceptMessages } = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to update user status to accept messages"
            }, { status: 401 })
        }
        return Response.json({
            success: true,
            message: "message acceptance status updated successfully",
            updatedUser
        }, { status: 200 })
    } catch (error) {
        console.log("failed to update user status to accpet messages")
        return Response.json({
            success: false,
            message: "failed to update user status to accept messages"
        }, { status: 500 })
    }

}

export async function GET(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not auth"
        }, { status: 500 })
    }
    const userId = user._id;
    try {
        const userFound = await UserModel.findById(userId)
        if (!userFound) {
            return Response.json({
                success: false,
                message: "user not found",
            }, { status: 404 })
        }
        return Response.json({
            success: true,
            isAcceptionMessages: userFound.isAcceptingMessage,
            message: ""
        }, { status: 200 })

    } catch (error) {
        console.log("failed to update user status to accpet messages")
        return Response.json({
            success: false,
            message: "Error in getting message acceptance status"
        }, { status: 500 })
    }

}


