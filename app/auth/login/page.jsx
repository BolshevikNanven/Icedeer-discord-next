"use client"

import { useStore } from "../../../store/createStore"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useToast } from "@/components/ui/use-toast"

import { useState } from "react"
import { httpNormalActions } from "@/lib/networkActions"
import { useRouter } from "next/navigation"


const FormSchema = z.object({
    username: z.string().min(2, {
        message: "用户名至少为2位",
    }),
    password: z.string().min(6, {
        message: "密码至少为6位"
    })
})

export default function Login() {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const { setToken } = useStore.use.userActions()

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    const onSubmit = (formData) => {
        setLoading(true)
        httpNormalActions({ url: '/sign/login', params: formData  })
            .then((res) => {
                setToken(res.data)
                toast({ variant: 'success', title: '登陆成功' })
                router.replace('/')
            })
            .catch(reason => console.log(reason)
            )
            .finally(() => setLoading(false))
    }

    return (
        <Card className="w-[380px] relative">
            {loading &&
                <div className=" absolute top-0 left-0 w-full h-full bg-white/80 dark:bg-black/80 flex flex-row justify-center items-center">
                    <Loader2 className=" w-8 h-8 animate-spin" />
                </div>
            }
            <CardHeader>
                <CardTitle className=" pt-2">登录</CardTitle>
                <CardDescription>登录账号以进行更多操作</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-4">
                        <FormField
                            className=" flex flex-col w-full gap-2"
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>用户名：</FormLabel>
                                    <FormControl>
                                        <Input placeholder="请输入用户名" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            className=" flex flex-col w-full gap-2"
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>密码：</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="请输入密码" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className=" pt-5 w-full flex flex-row justify-between">
                            <Button type="button" variant="outline">游客进入</Button>
                            <Button type="submit">登录</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}