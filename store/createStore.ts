import { create } from "zustand";
import { User, createUser } from "./user";
import { ChannelList, createChannel } from "./channelList";
import { MessageList, createMessageList } from "./messageList";
import { RoomList, createRoomList } from "./roomList";

import { createSelectors } from "./createSelector";
import { subscribeWithSelector } from "zustand/middleware"
import { MessageQueue, createMessageQueue } from "./messageQueue";


export type Store = User & ChannelList & MessageList & MessageQueue & RoomList

const store = create<Store>()(subscribeWithSelector((...a) => ({
    ...createUser(...a),
    ...createChannel(...a),
    ...createMessageList(...a),
    ...createMessageQueue(...a),
    ...createRoomList(...a),
})))

export const useStore = createSelectors(store)