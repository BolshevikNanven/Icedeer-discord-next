"use client"

import { useMemo } from "react";

import RoomItem from "./RoomItem";

export default function RoomList({ channel, roomList, memberList }) {


    const pubicRooms = useMemo(() => roomList.filter(
        Room => Room.type == 2
    ), [roomList])
    const groupRooms = useMemo(() => roomList.filter(
        Room => Room.type == 1
    ), [roomList])


    return (
        <>
            {pubicRooms.length > 0 &&
                <>
                    <p className=" font-semibold text-gray-400 text-sm pt-3 pb-2">公共房间</p>
                    {pubicRooms.map((room) =>
                        <RoomItem key={room.id} channelId={channel.id} room={room} />
                    )}
                </>
            }
            {groupRooms.length > 0 &&
                <>
                    <p className=" font-semibold text-gray-400 text-sm pt-3 pb-2">私有房间</p>
                    {groupRooms.map((room) =>
                        <RoomItem key={room.id} channelId={channel.id} room={room} />
                    )}
                </>
            }
            {memberList &&
                <>
                    <p className=" font-semibold text-gray-400 text-sm pt-3 pb-2">伙伴</p>
                    {memberList?.map((member, index) =>
                        <RoomItem key={member.id} channelId={channel.id} room={member} friend={true} />
                    )}
                </>
            }
        </>
    )
}
