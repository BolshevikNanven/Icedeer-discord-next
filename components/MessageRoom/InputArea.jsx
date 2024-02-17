"use client"

import TextareaAutosize from 'react-textarea-autosize';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator";

import { SendHorizonal, ChevronUp } from "lucide-react";
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

import UploadFile from './UploadFile';
import PreviewFile from './PreviewFile'


export default function InputArea({ sendMessage }) {

    const [inputValue, setInputValue] = useState("")
    const [bigInputMode, setBigInputMode] = useState(false)

    const [fileList, setFileList] = useState([])
    const inputRef = useRef()

    const handleSendMessage = () => {
        if (inputValue !== '') {
            sendMessage({ msg: inputValue })
            setInputValue("")
        }
    }
    const handleChangeInputValue = (e) => {
        setInputValue(e.target.value)
    }
    const handleInputKeydown = (e) => {
        if (e.key === 'Enter' && e.altKey) {
            e.preventDefault()
            setInputValue(prev => prev + '\n')
            setBigInputMode(true)
            return
        }
        if (e.key === 'Enter' && !bigInputMode) {
            e.preventDefault()
            handleSendMessage()
            return
        }
        if (e.key === 'Enter' && !bigInputMode) {
            e.preventDefault()
            setInputValue(prev => prev + '\n')
            return
        }
    }
    const addFile = (file) => {
        setFileList(prev => [...prev, file])
    }
    const deleteFile = (index) => {
        setFileList(prev => prev.filter((f, i) => i !== index))
    }

    return (
        <div className={cn('flex relative', bigInputMode || fileList.length > 0 ? 'flex-col' : 'flex-row')}>
            <UploadFile addFile={addFile} />
            <Separator className={cn(
                bigInputMode || fileList.length > 0 ? "mt-10 mb-1" : "h-6 ml-9 mr-1 my-2")}
                orientation={bigInputMode || fileList.length > 0 ? "horizontal" : "vertical"}
            />
            <main className={cn(
                "flex flex-col",
                bigInputMode || fileList.length > 0 ? "px-2 pb-2" : "pr-10 flex-1",
            )}>
                <TextareaAutosize
                    ref={inputRef}
                    value={inputValue}
                    onKeyDown={handleInputKeydown}
                    onChange={handleChangeInputValue}
                    autoFocus
                    minRows={1}
                    maxRows={bigInputMode || fileList.length > 0 ? 10 : 2}
                    className={cn(
                        "min-h-[40px] py-2 resize-none bg-transparent outline-none overflow-auto",

                    )}
                    placeholder='在这里输入信息'
                />
                <div className='flex flex-wrap gap-[1px]'>
                    {fileList.map((file, index) => (
                        <PreviewFile key={index} handleDelete={() => deleteFile(index)} file={file} />
                    ))}
                </div>
            </main>

            <div className='h-10 absolute top-0 right-0'>
                <TooltipProvider>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger
                            className='w-10 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none py-2 px-2 active:bg-zinc-300 dark:active:bg-zinc-500'
                            onClick={handleSendMessage}
                        >
                            <SendHorizonal />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className=" text-xs">Alt+Enter换行</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {bigInputMode && !fileList.length > 0 &&
                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger
                                className='w-10 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none py-2 px-2 active:bg-zinc-300 dark:active:bg-zinc-500'
                                onClick={() => setBigInputMode(false)}
                            >
                                <ChevronUp />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className=" text-xs">收起</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                }
            </div>
        </div>
    )
}