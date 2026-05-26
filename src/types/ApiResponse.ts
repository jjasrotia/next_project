import { Message } from "@/model/user";

export interface ApiResponse{
    success:boolean;
    message:string;
    isAcceptingMsg?:boolean;   //optional
    messages?:Array<Message>    //optional 
}

