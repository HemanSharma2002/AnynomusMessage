import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/Users";
import { usernameValidation } from "@/schema/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema=z.object({
    username:usernameValidation
})
export async function GET(request:Request){
    await dbConnect()
    try{
        const{searchParams}=new URL(request.url)
        const queryParam={
            username:searchParams.get('username')
        }
        const result= await UsernameQuerySchema.safeParse(queryParam)
        console.log(result);
        if(!result.success){
            const usernameErrors=result.error.format().username?._errors||[]
            return Response.json({
                sucess:false,
                message:usernameErrors?.length>0?usernameErrors.join(','):"Invalid query parameters"
            },{status:400})
        }
        const {username}=result.data
        const existingVerifiedUser=await UserModel.findOne({
            username,isVerified:true
        })
        if(existingVerifiedUser){
            return Response.json({
                sucess:false,
                message:"Username is already taken"
            },{status:400})
        }
        else{
            return Response.json({
                sucess:true,
                message:"Username is avilable"
            },{status:200})
        }
    }catch(error){
        console.error("Error checking username",error);
        return Response.json({
            sucess:false,
            message:"Error checking username"
        },
    {status:500}
)
        
    }
}