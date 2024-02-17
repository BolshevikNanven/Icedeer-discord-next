"use client"

import { useTheme } from "next-themes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"

import { User, LogOut, Sun, Moon } from 'lucide-react'


import { httpNormalActions } from "@/lib/networkActions"

import { useStore } from "@/store/createStore"
import { useMemo } from "react"

import { useRouter } from 'next/navigation'

export default function UserBar({ }) {
    const { setTheme, theme } = useTheme()

    const userAvatar = useStore.use.avatar()
    const userClear = useStore.use.userActions().clear
    const router = useRouter()

    const handleLogout = () => {
        httpNormalActions({ apiUrl: "/token/delete" }).finally(() => {
            userClear()
            router.refresh()
        })
    }

    const Avatar = useMemo(() => {
        if (userAvatar) {
            return <img className=" rounded-full w-12 h-12 transition-all cursor-pointer border-4 border-transparent hover:border-primary" src={"http://" + process.env.NEXT_PUBLIC_SERVER_URL + '/file/img?name=' + userAvatar} />
        } else return <User />
    }, [userAvatar])

    const handleSetTheme = () => {
        if (theme === 'dark') {
            setTheme('light');
        } else setTheme('dark');
    }

    return (
        <div className="flex flex-col w-full p-2 gap-2">
            <Button onClick={handleSetTheme} variant="ghost" size="icon" className="mx-auto flex justify-center items-center text-3xl font-bold w-12 h-12 rounded-[8px] transition-all hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-zinc-800 dark:active:bg-zinc-850">
                <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <DropdownMenu >
                <DropdownMenuTrigger asChild >
                    <div className="flex justify-center">
                        <button className="flex justify-center items-center text-3xl font-bold w-12 h-12 rounded-[8px] transition-all hover:bg-gray-200 active:bg-gray-300 dark:hover:bg-zinc-800 dark:active:bg-zinc-850">
                            {Avatar}
                        </button>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right">
                    <DropdownMenuItem>
                        <User className="h-4 w-4 mr-2" />个人信息
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />退出登录
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}