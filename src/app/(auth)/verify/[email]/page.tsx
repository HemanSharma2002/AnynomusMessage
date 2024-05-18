"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useParams, useRouter } from "next/navigation"
import { signUpSchema } from "@/schema/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { verifySchema } from "@/schema/verifySchema"


type Props = {}

export default function Verify({ }: Props) {
    const router = useRouter()
    const param = useParams<{ email: string }>()
    const { toast } = useToast()
    const form = useForm({
        resolver: zodResolver(verifySchema),
    })
    const [isSubmitting, setisSubmitting] = useState(false)
    async function onSubmit (data: z.infer<typeof verifySchema>){
        try {
            const resp = await axios.post(`/api/verify-code`, {
                email,
                code: data.code
            })
            toast({
                title: 'Verification sucessfull',
                description: resp.data.message
            })
            router.replace(`/sign-in`)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const erroMessage = axiosError.response?.data.message
            console.error("Error in sign up of user", erroMessage);
            toast(
                {
                    title: "Sign up failed",
                    description: erroMessage,
                    variant: "destructive"
                }
            )
        }
    }
    const email=param.email.replace('%40','@')
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome Back to Anynomus Message
                    </h1>
                    <p className="mb-4">Verify yourself</p>
                    <p>{email}</p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className=' text-start'>Verification Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Verification Code" {...field} onChange={e=>field.onChange(e)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting}>Verify</Button>
                            {
                                isSubmitting &&
                                <Loader2 className=' animate-spin'/>
                            }
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}