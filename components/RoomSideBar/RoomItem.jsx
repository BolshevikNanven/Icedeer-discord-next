"use client"

import { useRouter, usePathname } from 'next/navigation'
import { cn } from "@/lib/utils";

import { Hash, MailOpen, XCircle, Lock } from "lucide-react"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
} from "@/components/ui/context-menu"


export default function RoomItem({ channelId, room, friend }) {

    const router = useRouter();
    const pathname = usePathname();

    const matchPathEnd = (str) => {
        const pathArray = pathname.split('/')
        if (pathArray.length < 3) return false
        return str === pathArray[pathArray.length - 1]
    }

    return (
        <ContextMenu key={room.id}>
            <ContextMenuTrigger asChild>
                <div className={cn(
                    "flex flex-row items-center text-gray-500 py-[10px] px-2 mb-1 rounded-md cursor-pointer transition-all hover:bg-gray-200 dark:hover:bg-zinc-700 dark:text-zinc-400",
                    matchPathEnd(room.id) && "bg-gray-200 text-zinc-800 font-bold dark:bg-zinc-700 dark:text-zinc-300")
                }
                    onClick={() => router.push(`/${channelId}/${room.id}?name=${room.name}&type=${room.type || 0}`)}
                >
                    {friend ?
                        <Avatar className="mr-2" >
                            <AvatarImage src={"http://" + process.env.NEXT_PUBLIC_SERVER_URL + '/file/img?name=' + room.avatar} />
                            <AvatarFallback className=" bg-primary text-white font-normal">{room.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar >
                        :
                        <Hash className="w-5 h-5 mr-1 text-gray-500 dark:text-zinc-400" />
                    }
                    <p className={cn("flex-1 font-semibold text-sm", friend && "font-bold")}>{room.name}</p>
                    {room.type == 1 && !room.permission && <Lock className='w-4 h-4' />}
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent className=' w-40'>
                <ContextMenuItem>
                    <MailOpen className='w-4 h-4 mr-2' />标为已读
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>
                    <XCircle className='w-4 h-4 mr-2' />退出频道
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>


    )
}