"use client"

import ChannelSideBar from "@/components/ChannelSideBar/ChannelSideBar"
import { httpNormalActions, useWebSocket } from "@/lib/networkActions"
import { useStore } from "@/store/createStore"

import { useToast } from "@/components/ui/use-toast"
import { useEffect } from "react"


var getingToken = false
export default function ChannelLayout({ children }) {
    const { toast } = useToast()

    const token = useStore.use.token()
    const channelList = useStore.use.channelList()

    const { setAll, setToken } = useStore.use.userActions()
    const { setChannelList } = useStore.use.channelListActions()
    const { insertMessage,setMessageState } = useStore.use.messageListActions()

    const { removeMessage } = useStore.use.messageQueueActions()

    //获取token至客户端内存
    if (!getingToken && !token) {
        getingToken = true
        httpNormalActions({ apiUrl: "/token/get" })
            .then(res => setToken(res.token))
            .finally(() => getingToken = false)
    }
    //建立聊天Websocket
    const [webSocket, sendMessage, lastMessage, isConnected] = useWebSocket({
        token: token,
        url: "/chat",
        onMessage: (msg) => {
            try {
                const newMessage = JSON.parse(msg);
                switch (newMessage.type) {
                    case 0: {
                        insertMessage(newMessage.body, true)
                        break;
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        onError: (event) => {
            console.log(event);
        }
    })


    useEffect(() => {
        const unsub = useStore.subscribe(
            (state) => state.messageQueue,
            (messageQueue, prev) => {
                if (messageQueue.length === 0) {
                    return
                }

                let sentMsgIds = []
                messageQueue.forEach(msg => {
                    if (msg.type === 0) {
                        const {id,channel} = msg.body
                        const room = insertMessage({
                            ...msg.body,
                            state: 'sending',
                        }, true)
                        httpNormalActions({ url: '/message/send', token: token, body: msg.body })
                            .then(res => {
                                if (res.success) {
                                    setMessageState(id,channel,room,'sent',res.data)
                                } else return Promise.reject(res.message)
                            })
                            .catch(err => {
                                console.log(err);
                                setMessageState(id,channel,room,'fail')
                            })
                        sentMsgIds.push(msg.body.id)
                    } else if (sendMessage(JSON.stringify(msg))) {
                        sentMsgIds.push(msg.body.id)
                    }
                })
                if (sentMsgIds.length !== 0) {
                    removeMessage(sentMsgIds)
                }
            }
        )

        return unsub
    }, [token])

    useEffect(() => {
        if (token) {
            httpNormalActions({ url: "/user/info", token: token })
                .then(res => {
                    if (res.success) {
                        const { id, username, miniAvatar } = res.data
                        setAll({
                            id: id,
                            username: username,
                            avatar: miniAvatar,
                        })
                    } else return Promise.reject(res.message)
                })
                .catch(err => {
                    toast({
                        variant: 'destructive',
                        title: err,
                    })
                })
            httpNormalActions({ url: "/channel/list", token: token })
                .then(res => {
                    if (res.success) {
                        setChannelList(res.data)
                    } else return Promise.reject(res.message)
                })
                .catch(err => {
                    toast({
                        variant: 'destructive',
                        title: err,
                    })
                })
        }
    }, [token])

    return (
        <main className=" w-screen h-screen flex flex-row ">
            <ChannelSideBar channelList={channelList} />
            {token && children}
        </main>
    )

}