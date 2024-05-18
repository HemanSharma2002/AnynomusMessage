import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            sucess: false,
            message: "Not Authenticated"
        },
            { status: 401 })
    }
    const userId = user._id
    const { acceptMessages } = await request.json()
    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )
        if (!updateUser) {
            return Response.json({
                sucess: false,
                message: "Failed to update user status to accept message"
            },
                { status: 500 })
        } else {
            return Response.json({
                sucess: false,
                message: "Message acceptance statue updated sucessfuly", updateUser
            },
                { status: 200 })
        }
    } catch (error) {
        console.error("Failed to update user status to accept message", error);
        return Response.json({
            sucess: false,
            message: "Failed to update user status to accept message"
        },
            { status: 500 })
    }
}

export async function GET(request: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    if (!session || !session.user) {
        return Response.json({
            sucess: false,
            message: "Not Authenticated"
        },
            { status: 401 })
    }
    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                sucess: false,
                message: "User not found"
            },
                { status: 500 })
        }
        else {
            return Response.json({
                sucess: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            },
                { status: 200 })
        }
    } catch (error) {
        console.error("Error in getting message acceptance",error);
        return Response.json({
            sucess: false,
            message: "Error in getting message acceptance"
        },
            { status: 500 })
    }
}