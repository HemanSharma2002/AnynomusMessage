import { Message } from "@/model/Users";

export interface ApiResponse{
    sucess:boolean;
    message:string;
    isAcceptingMessages?:boolean
    messages?:Array<Message>
}