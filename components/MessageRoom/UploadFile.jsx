"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { PlusCircle, Image, Folder } from "lucide-react";
import { useRef, useState } from "react";



export default function UploadFile({ addFile }) {
    const uploadRef = useRef()

    const handleSelectFile = (e) => {
        if (e.target.value === "") {
            return
        }
        const file = e.target.files[0]
        addFile(file)
        
        uploadRef.current.value = ""
    }
    const handleUpload = (type) => {
        uploadRef.current.accept = type
        uploadRef.current.click()
    }


    return (
        <>
            <input ref={uploadRef} type="file" onChange={handleSelectFile} className="hidden" />
            <DropdownMenu>
                <DropdownMenuTrigger className="w-10 h-10 absolute top-0 left-0 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none py-2 px-2 ">
                    <PlusCircle />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleUpload('image/png,image/jpeg')}>
                        <Image className='mr-2 h-4 w-4' />
                        <span>图片</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpload('*')}>
                        <Folder className='mr-2 h-4 w-4' />
                        <span>文件</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>

    )
}