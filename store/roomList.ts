import { StateCreator } from "zustand"
import { Store } from "./createStore"

export interface RoomList {
    roomList: RoomData[],
    roomListActions: RoomListActions,
}

type RoomData = {
    id: string,
    name: string,
    type: number,
    channel: string,
    permission: Boolean,
}

type RoomListActions = {
    setRoomList: (roomData: RoomData[]) => void,
}
const initRoomList = []
export const createRoomList: StateCreator<Store, [], [], RoomList> = (set) => ({
    roomList: initRoomList,
    roomListActions: {
        setRoomList: (roomlist) => set({ roomList: roomlist })
    }
})