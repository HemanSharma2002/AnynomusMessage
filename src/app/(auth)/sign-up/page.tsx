"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
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

type Props = {}

export default function page({ }: Props) {
  const [username, setUsername] = useState("")
  const [message, setmessage] = useState("")
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setisSubmitting] = useState(false)
  const debounce = useDebounceCallback(setUsername, 1000)
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setisCheckingUsername(true)
        setUsername("")
        try {
          const resp = await axios.get(`/api/check-username-unique?username=${username}`)
          console.log(resp.data.message);
          
          let message=resp.data.message
          setmessage(message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setmessage(
            axiosError.response?.data.message ?? "Error checking username"
          )
        }
        finally {
          setisCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username])
  async function onSubmitt(data: z.infer<typeof signUpSchema>) {
    setisSubmitting(true)
    try {
      const resp = await axios.post(`/api/sign-up`,data)
      toast(
        {
          title: "Sucess",
          description: resp.data.message
        }
      )
      router.push(`/verify/${data.email}`)
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

    } finally {
      setisSubmitting(false)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to Anynomus Message
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitt)} className=" space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} onChange={(e) => {
                      field.onChange(e)
                      debounce(e.target.value)
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isCheckingUsername&&<Loader2 className=" animate-spin"/>}
            <p className={`text-sm ${message==="Username is avilable"?" text-green-500":"text-red-500"}`}>
              {message}
            </p>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} onChange={(e) => {
                      field.onChange(e)
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} onChange={(e) => {
                      field.onChange(e)
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>  Sign Up</Button>
            {
              isSubmitting?(
                <>
                <Loader2 className=" mr-2 h-4 w-4 animate-spin"/>
                </>
              ):('Signup')
            }
          </form>

        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


