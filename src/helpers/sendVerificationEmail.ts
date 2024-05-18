import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { error } from "console";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: '',
            to: [email],
            subject: 'Anynomus Message Verification code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { sucess: true, message: "Email send sucessfully" }
    }
    catch (emailError) {
        console.error("Error sending verification email", emailError);
        return { sucess: false, message: "Failed to send verification email" }
    }
}