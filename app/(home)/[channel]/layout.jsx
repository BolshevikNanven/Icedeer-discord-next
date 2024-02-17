"use client"

import RoomSideBar from "@/components/RoomSideBar/RoomSideBar";
import { httpNormalActions, useWebSocket } from "@/lib/networkActions";
import { useStore } from "@/store/createStore";
import { useEffect, useMemo } from "react";

import { useToast } from "@/components/ui/use-toast"
import { usePathname } from "next/navigation"
import { nanoid } from "nanoid";

export default function MessagerLayout({ children }) {
  const token = useStore.use.token()
  const channelList = useStore.use.channelList()
  const roomList = useStore.use.roomList()

  const { setMembers } = useStore.use.channelListActions()
  const { setRoomList } = useStore.use.roomListActions()
  const { putMessage } = useStore.use.messageQueueActions()

  const pathname = usePathname()

  const { toast } = useToast()


  const channelId = useMemo(() => {
    const channelId = pathname.split('/')[1]
    if (channelList.find(c => c.id == channelId)) {
      return channelId
    } else return null
  }, [pathname, channelList])

  useEffect(() => {
    if (channelId) {
      //切换频道
      putMessage({
        type: 1,
        body: {
          id: nanoid(),
          channel: channelId,
        }
      })
      //获取房间列表
      httpNormalActions({ url: "/room/list", token: token, params: { channel: channelId } })
        .then(res => {
          if (res.success) {
            setRoomList(res.data)
          } else return Promise.reject(res.message)
        })
        .catch(err => {
          toast({
            variant: 'destructive',
            title: err,
          })
        })


      //获取好友列表
      httpNormalActions({ url: "/channel/member", token: token, params: { channel: channelId } })
        .then(res => {
          if (res.success) {
            const members = res.data.map(u => ({
              id: u.id, name: u.username, avatar: u.miniAvatar,
            }))
            setMembers(channelId, members)
          } else return Promise.reject(res.message)
        })
        .catch(err => {
          toast({
            variant: 'destructive',
            title: err,
          })
        })
    }
  }, [channelId])

  return (
    <div className=" flex-1 flex flex-row">
      <RoomSideBar channel={channelList.find(channel => channel.id == channelId)} roomList={roomList} />
      <div className=" flex-1  border-l dark:bg-zinc-800">
        {children}
      </div>
    </div>
  )
}

