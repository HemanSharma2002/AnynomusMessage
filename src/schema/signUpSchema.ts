import { z } from "zod";

export const usernameValidation =z
.string()
.min(2,"Username must be atlest two character")
.max(20,"Must not be more then 20 character")

export const signUpSchema=z.object({
    username:usernameValidation,
    email:z.string()
    .email({message:"Email not valid"}),
    password:z.string().min(6,{message:"password must be more then 6 character"})
})