
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { ChevronLeft } from "lucide-react"


export default function Register() {
    return (
        <Card className="w-[380px]">
            <CardHeader>
                <CardTitle className=" pt-2">注册</CardTitle>
                <CardDescription>注册账号以进行更多操作</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className=" flex flex-col w-full gap-4">
                        <div className=" flex flex-col w-full gap-2">
                            <Label>用户名：</Label>
                            <Input placeholder="请输入用户名"/>
                        </div>
                        <div className=" flex flex-col w-full gap-2">
                            <Label>密码：</Label>
                            <Input type="password" placeholder="请输入密码"/>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="bg-gray-50">
                <div className=" pt-5 w-full flex flex-row justify-between">
                    <Button className=" pl-3" variant="outline">
                        <ChevronLeft className=" h-5 w-5 mr-1"/>返回登陆
                    </Button>
                    <Button>注册</Button>
                </div>
            </CardFooter>
        </Card>
    )
}