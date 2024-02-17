"use client"

import { ChevronDown, LogOut, MessageSquarePlus,Menu } from 'lucide-react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function SideBarHeader({ channel }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className=" flex justify-between items-center px-3 py-4 h-[64px] cursor-pointer">
                    <p className=" text-lg font-bold text-zinc-700 dark:text-zinc-400">{channel.name}</p>
                    <ChevronDown />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-[276px]'>
                <DropdownMenuItem className='flex justify-between'>
                    查看详细信息
                    <Menu className='w-4 h-4 mr-2' />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='flex justify-between'>
                    创建新房间
                    <MessageSquarePlus className='w-4 h-4 mr-2' />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className=' text-red-600 flex justify-between'>
                    退出该频道
                    <LogOut className='w-4 h-4 mr-2' />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}