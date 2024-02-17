import { StateCreator } from "zustand"
import { Store } from "./createStore"

export interface ChannelList {
    channelList: ChannelData[],
    channelListActions: ChannelListActions,
}

type ChannelData = {
    id: string,
    name: string,
    admin: string,
    owner: string,
    avatar: string,
    members: MemberData[],
}
type MemberData = {
    id: string,
    name: string,
    avatar: string,
}
type ChannelListActions = {
    setChannelList: ([]: ChannelData[]) => void,
    getChannel: (channelId: string) => ChannelData,
    setMembers: (channelId: string, members: MemberData[]) => void,
}

const initChannelData: ChannelList['channelList'] = []

export const createChannel: StateCreator<Store, [], [], ChannelList> = (set, get) => ({
    channelList: initChannelData,
    channelListActions: {
        setChannelList: (channels) => set(() => ({ channelList: channels })),
        getChannel: (channelId) => {
            const res = get().channelList.filter(channel => channel.id === channelId)
            if (res.length > 0) {
                return res[0];
            } else return null;
        },
        setMembers: (channelId, members) => {
            const channels = get().channelList.map(channel => {
                if (channel.id == channelId) {
                    return ({
                        ...channel,
                        members: members,
                    })
                } else return channel
            })

            set(() => ({ channelList: channels }))
        }
    },
})
