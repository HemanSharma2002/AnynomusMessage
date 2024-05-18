import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";
import { User } from "next-auth";
import mongoose from "mongoose";
import { Message } from "@/model/Users";
export async function POST(request: Request) {
    await dbConnect()
    const{username,content}=await request.json()
    try {
        const user=await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                    sucess:false,
                    message:"User not found"
                },
                {status:404}
            )
        }
        //is User accepting messages
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    sucess:false,
                    message:"User is not accepting messages"
                },
                {status:403}
            )
        }
        const newMessage={
            content,
            createdAt:new Date()
        }
        user.message.push(newMessage as Message)
        await user.save()
        return Response.json(
            {
                sucess:true,
                message:"Message send sucessfully"
            },
            {status:200}
        )
    } catch (error) {
        console.error("Error sending messages",error);
        
        return Response.json(
            {
                sucess:false,
                message:"Error sending messages"
            },
            {status:500}
        )
    }
}