"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import { httpNormalActions } from "@/lib/networkActions"

import ChannelList from "./ChannelList"
import UserBar from "./UserBar"
import AddChannel from "./AddChannel"

export default function ChannelSideBar({ channelList }) {

    const searchChannel = (id) => {
        return new Promise((resolve, reject) => {
            httpNormalActions(
                {
                    url: "/channel/search",
                    params: {
                        id:id
                    }
                }
            )
                .then(res => {
                    if (res.success) {
                        resolve(res.data)
                    } else return Promise.reject(res.message)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    return (
        <div className=" pt-3 w-[76px] bg-gray-200 flex flex-col dark:bg-zinc-900">
            <AddChannel searchChannel={searchChannel} />
            <Separator className=" bg-gray-300 w-12 mx-auto" />
            <ScrollArea className="flex-1">
                <ChannelList channelList={channelList} />
            </ScrollArea>
            <Separator className=" bg-gray-300 w-12 mx-auto" />
            <UserBar />
        </div>
    )
}
