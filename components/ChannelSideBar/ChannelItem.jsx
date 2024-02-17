"use client"

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ChannelItem({ id, name, avatar, active, onClick }) {


    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    <div>
                        {active && <span className="block absolute left-0 w-1 bg-primary h-8 my-[8px] rounded-r"></span>}
                        <Avatar
                            onClick={() => onClick(id)}
                            className={cn(
                                "w-12 h-12 transition-all cursor-pointer border-4 border-transparent hover:border-primary relative",
                                active && "rounded-xl",
                            )}
                        >
                            <AvatarImage src={"http://" + process.env.NEXT_PUBLIC_SERVER_URL + '/file/img?name=' + avatar} />
                            <AvatarFallback
                                className={cn(
                                    " bg-primary text-white font-normal",
                                    active && "rounded-xl",
                                )}
                            >
                                {name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar >
                    </div>

                </TooltipTrigger>
                <TooltipContent side="right">
                    <p className=" text-xs">{name}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

    )
}