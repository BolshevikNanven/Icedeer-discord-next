"use client"

import RoomList from "./RoomList"
import SearchRoom from "./SearchRoom"
import SideBarHeader from "./SideBarHeader"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator";



export default function RoomSideBar({ channel, roomList }) {

    if (channel) {
        return (
            <div className=" w-[282px] bg-gray-50 flex flex-col select-none dark:bg-zinc-850">
                <SideBarHeader channel={channel} />
                <Separator />
                <div className="flex flex-row gap-4 mx-3 px-2 my-1 pb-4 pt-4 border-b items-center">
                    <SearchRoom roomList={roomList} memberList={channel.members} />
                </div>
                <ScrollArea className="flex-1 px-3">
                    <RoomList channel={channel} roomList={roomList} memberList={channel.members} />
                </ScrollArea>
            </div>
        )
    }

}
