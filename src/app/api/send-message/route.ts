import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user";
import { User } from "next-auth";
import mongoose from "mongoose";
import { success } from "zod";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { Message } from "@/model/user";

export async function POST(request: Request) {
    await dbConnect()
    const { username, content } = await request.json()
    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 404 })
        }
        //is user accepting messages 
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "user is not accepting messages"
            }, { status: 403 })  //forbidden
        }
        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)  //type is a must from interface
        await user.save()
        return Response.json({
            success: true,
            message: "message sent successfully"
        }, { status: 404 })
    } catch (error) {
        console.log(" error adding messages occured", error);
        return Response.json({

            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }
}
