import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { log } from "console";

export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, email, password } = await request.json()
        const existingUserVerificationByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (existingUserVerificationByUsername) {
            return Response.json(
                {
                    sucess: false,
                    message: "Username is already taken"
                },
                { status: 400 }
            )
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const date=new Date()
        const expiryDate = new Date(date.getTime()+2*60*60*1000)
        console.log(expiryDate,new Date());
        
        const verifyCode = Math.floor(10000 + Math.random() * 90000).toString()
        const existingUserbyEmail = await UserModel.findOne({ email })
        if (existingUserbyEmail) {
            if (existingUserbyEmail.isVerified) {
                return Response.json(
                    {
                        sucess: false,
                        message: "User already exist with this email"
                    },
                    { status: 500 }
                )
            } else {
                existingUserbyEmail.password = hashPassword
                existingUserbyEmail.verifyCode = verifyCode
                existingUserbyEmail.verifyCodeExpiry = expiryDate
                existingUserbyEmail.username=username
                await existingUserbyEmail.save()
            }
        } else {
            const newUser = new UserModel(
                {
                    username,
                    email,
                    password: hashPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessage: true,
                    message: []
                }
            )
            await newUser.save()
        }
        const emailResponce = await sendVerificationEmail(email, username, verifyCode)
        if (!emailResponce.sucess) {
            return Response.json(
                {
                    sucess: false,
                    message: emailResponce.message
                },
                { status: 500 }
            )
        }
        return Response.json(
            {
                sucess: true,
                message: "User registered sucessfully . Verify yourself"
            },
            { status: 201 }
        )

    } catch (error) {
        console.error("Error registering user", error);
        return Response.json(
            {
                sucess: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}