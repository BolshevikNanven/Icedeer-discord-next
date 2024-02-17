"use client"

import { useEffect, useState } from "react"

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

import { Hash, Search } from "lucide-react"


export default function SearchRoom({ roomList, memberList }) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const down = (e) => {
            if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <>
            <div onClick={() => setOpen(true)} className=" text-sm justify-between flex-1 flex flex-row items-center cursor-pointer h-6  text-gray-500">
                <div className="flex flex-row">
                    <Search className=" h-5 w-5 mr-2" /><span className=" font-semibold">搜索</span>
                </div>
                <p className="text-sm text-muted-foreground">
                    <kbd className="pointer-events-none inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[12px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">Ctrl/⌘</span>J
                    </kbd>
                </p>
            </div>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="搜索频道..." />
                <CommandList>
                    <CommandEmpty>无搜索结果.</CommandEmpty>
                    <CommandGroup>
                        {roomList?.map(room => (
                            <CommandItem key={room.id}>
                                <Hash className="mr-2 h-4 w-4" />
                                <p>{room.name}</p>
                            </CommandItem>
                        ))}
                        {memberList?.map(member => (
                            <CommandItem key={member.name}>
                                <Avatar className="mr-2 w-9 h-9" >
                                    <AvatarImage src={"http://" + process.env.NEXT_PUBLIC_SERVER_URL + '/file/img?name=' + member.avatar} />
                                    <AvatarFallback className=" bg-primary text-white font-normal">{member.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar >
                                <p className="font-bold">{member.name}</p>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>

    )

}