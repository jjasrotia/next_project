import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user";
import { User } from "next-auth";
import mongoose from "mongoose";
export async function GET(request: Request) {
   await dbConnect()
   const session = await getServerSession(authOptions)
   const user = session?.user as User
   if (!session || !session.user) {
      return Response.json({
         success: false,
         message: "not authenticated"
      }, { status: 401 })
   }
   const userId = new mongoose.Types.ObjectId(user._id);
   try {
      const user = await UserModel.aggregate([
         { $match: { id: userId } },
         //unwind is used to extract the arrays , can say multiple objects
         { $unwind: '$messages' },
         { $sort: { 'messages.createdAt': -1 } },
         { $group: { _id: '$_id', messages: { $push: '$messages' } } }  //pushing messages by using group after sorting
      ])

      if (!user || user.length === 0) {
         return Response.json({
            success: false,
            message: "user not found"
         }, { status: 401 })
      }
      return Response.json({
         success: true,
         messages: user[0].messages
      }, { status: 201 })
   } catch (error) {
      console.log("An unexpected error occured");
      return Response.json({

         success: false,
         message: "internal server error"
      }, { status: 500 })
   }


}