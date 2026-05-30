'use client'
import { useParams, useRouter } from 'next/navigation'
import { toast } from "sonner"
import { zodResolver } from '@hookform/resolvers/zod'
import { verfiySchema } from '@/schemas/verifySchema'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"

const VerifyAccount = () => {

    const router = useRouter()
    const params = useParams<{ username: string }>()
    const form = useForm<z.infer<typeof verfiySchema>>({
        resolver: zodResolver(verfiySchema),

    })
    const onSubmit = async (data: z.infer<typeof verfiySchema>) => {
        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            })
            toast.success("Success", {
                description: response.data.message
            })

            router.replace(`/sign-in`)

        } catch (error) {
            console.error("Error in sign up of user", error)
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message
            toast.error("Sign up failed", {
                description: errorMessage,

            })

        }
    }

    return (
        <div className='flex justify-center items-center min-h--screen bg-gray-100'>
            <div className="w-full max-w-md p-8 space-y-8 bg-white-rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className='text-4xl font-extrabold tracking-tight lg-text-5xl mb-6'>
                        Verify your account
                    </h1>
                    <p className='mb-4'>  Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> VerificationCode</FormLabel>
                                    <Input {...field}

                                    />


                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">
                            Verify
                        </Button>
                    </form>
                </Form>

            </div>
        </div>
    )
}

export default VerifyAccount