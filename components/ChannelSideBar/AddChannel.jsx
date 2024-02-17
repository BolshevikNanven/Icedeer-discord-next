"use client"

import { Search, Plus, Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

import { useState } from 'react'

export default function Add({ searchChannel }) {

    const [idInput, setIdInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [searchResult, setSearchResult] = useState(undefined)

    const handleInput = (e) => {
        setIdInput(e.target.value)
    }
    const handleSearch = () => {
        if (idInput !== "") {
            setLoading(true)
            searchChannel(idInput)
                .then(res => setSearchResult(res))
                .finally(() => setLoading(false))
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-600 rounded-full mx-auto mb-3 hover:rounded-xl">
                    <Plus className=" w-6 h-6 text-zinc-500" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>添加新频道</DialogTitle>
                    <DialogDescription>
                        请输入频道ID，查找并添加频道
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Input placeholder='频道ID' value={idInput} onChange={handleInput} />
                    </div>
                    <Button onClick={handleSearch} size="sm" className="px-3">
                        {loading ?
                            <Loader2 className=' h-5 w-5 animate-spin' />
                            :
                            <Search className="h-5 w-5" />
                        }
                    </Button>
                </div>
                {searchResult !== undefined && searchResult !== null &&
                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <div className='flex w-full items-center border rounded-md p-4 cursor-pointer group text-zinc-800 dark:text-zinc-300'>
                                    <Avatar className="w-10 h-10 mr-4">
                                        <AvatarImage src={"http://" + process.env.NEXT_PUBLIC_SERVER_URL + '/file/img?name=' + searchResult.avatar} />
                                        <AvatarFallback className=" bg-primary text-white font-normal">
                                            {searchResult.name?.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar >
                                    <p className='flex-1 font-semibold'>{searchResult.name}</p>
                                    <Plus className='hidden group-hover:block w-5 h-5 mr-2' />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p className=" text-xs">加入{searchResult.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                }
                {searchResult === null &&
                    <div className='flex items-center justify-center'>
                        <p>无结果</p>
                    </div>
                }
            </DialogContent>
        </Dialog>
    )
}