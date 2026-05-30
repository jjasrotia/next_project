'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signupSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

const page = () => {

  const router = useRouter()

  //zod implementation

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ''
    }
  })


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {                //submit handler  bydefault has data
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password
    })
    if (result?.error) {
      if (result.error == "CredentialsSignin") {
        toast.error("Login failed",
          { description: "Incorrect username or password" })

      }
      else {
        toast.error("Login failed",
          { description: result.error })

      }
      // toast.error("Login failed", { description: "Incorrect username or password" })
    }

    if (result?.url) {
      router.replace('/dashboard')
    }

  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Message

          </h1>
          <p className="mb-4"> Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>

                  <Input
                    {...field}

                  />

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <Input type="password" placeholder="password"
                    {...field}

                  />

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {/* {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-h-4 w-4 animate-spin" /> Please wait

                  </>

                ) : ('Signin')
              } */}

              Signin
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
            Sign in
          </Link>

        </div>

      </div>
    </div>
  )
}

export default page
