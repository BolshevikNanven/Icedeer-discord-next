"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Loader2 } from 'lucide-react'

import { cn } from "@/lib/utils"
import dayjs from "dayjs"

export default function MessageBubble(
    { self = false, content = "", userName = "", dateTime = "", avatar, sending }
) {

    dateTime = dayjs(dateTime).isBefore(dayjs(), 'day') ? dayjs(dateTime).format("M月D日 HH:mm:ss") : dayjs(dateTime).format("HH:mm:ss");

    return (
        <div className=" relative px-[52px] mt-4">
            <Avatar
                className={cn(" absolute top-0 w-[42px] h-[42px] select-none cursor-pointer",
                    self ? "right-0" : "left-0"
                )}
            >
                <AvatarImage src={"http://" + process.env.NEXT_PUBLIC_SERVER_URL + '/file/img?name=' + avatar} />
                <AvatarFallback className=" bg-primary text-white font-normal">
                    {userName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar >
            <div
                className={cn(" text-zinc-500 text-sm pb-1 select-none flex items-center",
                    self ? " flex-row-reverse" : " flex-row"
                )}
            >
                <p>{userName}</p>
                <span className=" text-zinc-400 mx-1 text-xs">{dateTime}</span>
            </div>
            <pre
                className={cn(" bg-zinc-100 w-max rounded-b-[14px] py-2 px-3 max-w-[80%] font-sans relative",
                    self ? " bg-primary/30 rounded-tl-[14px] ml-auto" : "bg-zinc-100 dark:bg-zinc-600 rounded-tr-[14px]"
                )}
            >
                {sending && <Loader2 className=" animate-spin w-4 h-4 absolute left-[-26px] top-3" />}
                {content}
            </pre>
        </div>
    )
}