import { StateCreator } from "zustand";
import { Message } from "./messageList";
import { Store } from "./createStore";

export interface MessageQueue {
    messageQueue: MessageQueueData[],
    messageQueueActions: messageQueueActions,
}
type MessageQueueData = {
    type: 0 | 1,
    body: Message,
}
type messageQueueActions = {
    putMessage: (msg: MessageQueueData) => void,
    removeMessage: (ids: Message['id'][]) => void,
}

const initMessageQueue = []

export const createMessageQueue: StateCreator<Store, [], [], MessageQueue> = (set) => ({
    messageQueue: initMessageQueue,
    messageQueueActions: {
        putMessage: (msg) => set(
            (state) => ({ messageQueue: [...state.messageQueue, msg] })
        ),
        removeMessage: (ids) => set((state) => ({
            messageQueue: state.messageQueue.filter(msg => !ids.some(id => (id === msg.body.id)))
        }))
    }
})