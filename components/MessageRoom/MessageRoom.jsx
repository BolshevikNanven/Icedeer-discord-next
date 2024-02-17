"use client"

import MessageBubble from "./MessageBubble";
import InputArea from "./InputArea"

import { Hash, Loader, ChevronsDown,MoreVertical } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store/createStore';


let msgScrollTop = -1;//-1为滚动到最底部
let prevFirstMsgDom;//历史消息加载前第一个消息Dom
export default function MessageRoom(
    { roomId, roomName, roomType, sendMessage, getHistoryMessage, messageData }
) {

    const scrollerRef = useRef();

    const [loading, setLoading] = useState(false);
    const [scrollToBottom, setScrollTobottom] = useState(false);

    const userid = useStore.use.id()

    useEffect(() => {
        const scrollerDom = scrollerRef.current;

        scrollerDom.scrollTop = scrollerDom.scrollHeight;
    }, [roomId])

    useEffect(() => {
        const scrollerDom = scrollerRef.current;

        if (msgScrollTop === -1) {
            scrollerDom.scrollTop = scrollerDom.scrollHeight;
        }
        if (msgScrollTop === 0) {
            //向上加载历史记录时滚动重定位
            scrollerDom.scrollTop = prevFirstMsgDom.offsetTop - 64;
        }

        if (loading) setLoading(false);
    }, [messageData])

    useEffect(() => {
        if (messageData?.length === 0) {
            getHistoryMessage(0)
        }
    }, [messageData])

    const handleMessageScroll = (e) => {
        //判断是否滚动到底部
        if (Math.abs(e.target.scrollHeight - e.target.clientHeight - e.target.scrollTop) < 1) {
            msgScrollTop = -1;
            return;
        }
        //滚动到最顶部
        if (e.target.scrollTop === 0) {
            msgScrollTop = 0;
            prevFirstMsgDom = e.target.childNodes[0];
            setLoading(true);
            getHistoryMessage(messageData[0].id)
                .finally(() => {
                    setLoading(false)
                })
            return;
        }
        if ((e.target.scrollTop < e.target.scrollHeight - 2 * e.target.clientHeight) && !scrollToBottom) {
            setScrollTobottom(true);
        } else if ((e.target.scrollTop >= e.target.scrollHeight - 2 * e.target.clientHeight) && scrollToBottom) {
            setScrollTobottom(false);
        }

        msgScrollTop = e.target.scrollTop;
    }

    const handleScrollToBottom = () => {
        scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
        msgScrollTop = -1;

        setScrollTobottom(false);
    }



    return (
        <div className="w-full h-full flex flex-col pb-6">
            <header className="flex items-center gap-4 px-4 h-[64px] justify-between">
                <div className=" text-sm flex-1 flex flex-row items-center select-none h-[30px]  text-gray-500">
                    <Hash className="mr-1" />
                    <p className=" text-base font-semibold">{roomName}</p>
                </div>
                <MoreVertical className=" cursor-pointer"/>
            </header>
            <Separator />
            <main ref={scrollerRef} onScroll={handleMessageScroll} className=" overflow-auto flex-1 pb-4 mb-2 px-4">
                {loading &&
                    <div className=' py-2 w-full flex flex-row justify-center items-center'>
                        <p className=' text-zinc-400 text-sm font-semibold'>加载历史记录</p>
                        <Loader className=' animate-spin w-5 h-5 ml-1' />
                    </div>
                }
                {messageData?.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        self={userid == msg.from}
                        userName={msg.username}
                        content={msg.content}
                        dateTime={msg.time}
                        avatar={msg.avatar}
                        sending={msg.sending}
                    />
                ))}
            </main>
            <footer className="  w-full px-4 ">
                <div className="w-full relative rounded-lg bg-zinc-100 dark:bg-zinc-850 dark:border p-1 min-h-[42px]">
                    {scrollToBottom &&
                        <div onClick={handleScrollToBottom} className=' absolute top-[-52px] right-[24px] rounded-full bg-white shadow-lg py-1 px-2'>
                            <ChevronsDown className=' text-primary' />
                        </div>
                    }
                    <InputArea
                        sendMessage={(msg) => {
                            sendMessage(msg)
                            msgScrollTop = -1;
                        }}
                    />
                </div>
            </footer>
        </div>
    )
}

