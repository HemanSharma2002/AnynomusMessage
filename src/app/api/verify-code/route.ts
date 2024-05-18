import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";
import { verifySchema } from "@/schema/verifySchema";

export async function POST(request: Request) {
    const { email, code } = await request.json()
    try {
        const checkVerifyCode = verifySchema.safeParse({ code })
        if (!checkVerifyCode.success) {
            const verificationCodeErrors = checkVerifyCode.error.format()._errors || []
            return Response.json({
                sucess: false,
                message: verificationCodeErrors?.length > 0 ? verificationCodeErrors.join(',') : "Invalid query parameters"
            }, { status: 400 })
        }
        console.log(checkVerifyCode.data,email);
        const verifiedCode = checkVerifyCode.data?.code
        const existingUser = await UserModel.findOne({
            email, isVerified: false
        })
        if (!existingUser) {
            return Response.json({
                sucess: false,
                message: "Email does not exist"
            },
                { status: 500 })
        } else {
            if (existingUser.verifyCodeExpiry.getTime() < new Date().getTime()) {
                const verifyCode = Math.floor(10000 + Math.random() * 90000).toString()
                const emailResponce = await sendVerificationEmail(email, existingUser.username, verifyCode)
                existingUser.verifyCode=verifyCode;
                existingUser.verifyCodeExpiry=new Date(new Date().getTime()+(2*60*60*1000))
                existingUser.save()
                if (!emailResponce.sucess) {
                    return Response.json(
                        {
                            sucess: false,
                            message: emailResponce.message
                        },
                        { status: 500 }
                    )
                }
                return Response.json({
                    sucess: false,
                    message: "Code is expired , new code is send to the email"
                },
                    { status: 400 })
            } else {
                if (existingUser.verifyCode === code) {
                    existingUser.isVerified = true
                    await existingUser.save()
                    return Response.json({
                        sucess: true,
                        message: "User is verified , now you can login "
                    },
                        { status: 200 })
                }
                else {
                    return Response.json({
                        sucess: false,
                        message: "Code  does't match"
                    },
                        { status: 500 })
                }
            }
        }
    } catch (error) {
        console.error("Error during verify code", error);
        return Response.json({
            sucess: false,
            message: "Error during verify code"
        },
            { status: 500 })
    }
}