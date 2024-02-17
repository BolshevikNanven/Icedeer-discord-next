"use client"

import ChannelItem from "./ChannelItem"
import { useRouter, usePathname } from "next/navigation"

export default function ChannelList({ channelList }) {
    const router = useRouter()
    const pathname = usePathname()


    const matchChannel = (channelId) => {
        return channelId == pathname.split('/')[1]
    }
    const handleSelectChannel = (channelId) => {
        router.replace("/" + channelId)
    }

    return (
        <div className="flex flex-1 flex-col items-center w-full p-2 gap-2">
            {channelList.map(channel => (
                <ChannelItem
                    key={channel.id}
                    id={channel.id}
                    name={channel.name}
                    avatar={channel.avatar}
                    onClick={handleSelectChannel}
                    active={matchChannel(channel.id)}
                />
            ))}
        </div>
    )
}