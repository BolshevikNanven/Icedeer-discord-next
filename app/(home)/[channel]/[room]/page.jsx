"use client"

import { useStore } from "../../../../store/createStore"

import MessageRoom from "@/components/MessageRoom/MessageRoom";

import { Hash, Lock } from "lucide-react"

import { nanoid } from "nanoid";
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react";

import { httpNormalActions } from '@/lib/networkActions'

export default function MessagerRoom({ params }) {

    const searchParams = useSearchParams()
    const [messageData, setMessageData] = useState(null)
    const [historyEmpty, setHistoryEmpty] = useState(false)

    const token = useStore.use.token()
    const username = useStore.use.username()
    const avatar = useStore.use.avatar()
    const userId = useStore.use.id()

    const roomList = useStore.use.roomList()
    const channelList = useStore.use.channelList()
    const { insertMessage } = useStore.use.messageListActions()
    const { putMessage } = useStore.use.messageQueueActions()


    const sendMessage = ({ msg, file }) => {
        putMessage({
            type: 0,
            body: {
                id: nanoid(),
                type: searchParams.get('type'),
                from: userId,
                to: params.room,
                content: msg,
                file: file ? file : null,
                channel: params.channel,
                time: new Date(),
                username: username,
                avatar: avatar,
            }
        })
    }

    const findRoom = (roomId) => {
        const room = roomList.find(room => room.id == roomId)
        if (room) {
            return room
        }

        const channel = channelList.find(channel => channel.id == params.channel)
        const member = channel?.members?.find(member => member.id == roomId)
        if (member) {
            return member
        }

        return false
    }

    const checkPermission = (roomId) => {
        if (findRoom(roomId).permission == false) {
            return false
        }

        return true
    }

    const getHistoryMessage = (lastMsgId) => {
        return new Promise((resolve, reject) => {
            if (!findRoom(params.room) || historyEmpty) {
                resolve()
                return
            }
            httpNormalActions({
                url: '/message/history',
                token: token,
                params: {
                    lastMsg: lastMsgId,
                    roomType: searchParams.get('type'),
                    channel: params.channel,
                    room: params.room,
                }
            })
                .then(res => {
                    if (res.success) {
                        if (res.data.length > 0) {
                            insertMessage(res.data, false)
                        } else setHistoryEmpty(true)
                        resolve()
                    } else return Promise.reject(res.message)
                })
                .catch(err => reject(err))
        })

    }

    useEffect(() => {
        const unsub = useStore.subscribe(
            (state) => state.messageList,
            (messageList, prevMessageList) => {
                const channelMessageList = messageList[params.channel]
                const prevChannelMessageList = prevMessageList[params.channel]

                const roomMessageList = channelMessageList ? channelMessageList[params.room] : undefined
                const prevRoomMessageList = prevChannelMessageList ? prevChannelMessageList[params.room] : undefined

                //进入频道且本地无历史消息
                if (messageData === null && roomMessageList === undefined) {
                    setMessageData([])
                    return
                }

                //进入当前频道且本地有历史消息
                if (messageData === null && roomMessageList !== undefined) {
                    setMessageData(roomMessageList)
                    return
                }

                //消息更新
                if (roomMessageList && (roomMessageList.length !== prevRoomMessageList?.length)) {
                    setMessageData(roomMessageList)
                    return
                }
            },
            {
                fireImmediately: true,
            }
        )

        return unsub;
    }, [params.channel])

    if (findRoom(params.room) && checkPermission(params.room))
        return (
            <MessageRoom
                roomId={params.room}
                roomName={searchParams.get('name')}
                roomType={searchParams.get('type')}
                sendMessage={sendMessage}
                getHistoryMessage={getHistoryMessage}
                messageData={messageData}
            />
        )
    else if (!checkPermission(params.room))
        return (
            <div className="w-full h-full flex flex-col">
                <div className="flex-1 flex justify-center items-center p-7 text-zinc-400 select-none">
                    <Lock className=" w-6 h-6 mr-2" />
                    <p className=" text-xl">此房间不对你开放</p>
                </div>
            </div>
        )
    else return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 flex justify-center items-center p-7 text-zinc-400 select-none">
                <Hash className=" w-6 h-6 mr-2" />
                <p className=" text-xl">你好</p>
            </div>
        </div>
    )
}