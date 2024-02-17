import { StateCreator } from "zustand"
import { Store } from "./createStore"


export interface MessageList {
    messageList: MessageData,
    messageListActions: MessageListActions,
}
type MessageData = {
    [key: Message['channel']]: {
        [key: Message['to']]: Message[],
    }
}
export type Message = {
    id: string,
    type: number,
    from: string,
    avatar: string,
    username: string,
    to: string,
    content: string,
    channel: string,
    file: string,
    time: string,
    state?: 'sending' | 'fail' | 'sent',
}
type MessageListActions = {
    insertMessage: (message: Message | Message[], isnew: boolean) => string,
    clearList: () => void,
    setMessageState: (id: Message['id'], channel: Message['channel'], room: string, msgState: Message['state'], newId?: Message['id']) => void,
}

const initMessageList: MessageList['messageList'] = {}

export const createMessageList: StateCreator<Store, [], [], MessageList> = (set, get) => ({
    messageList: initMessageList,
    messageListActions: {
        insertMessage: (message, isnew) => {
            let room: string
            let channel: string
            let isMember: boolean
            if (message instanceof Array) {
                isMember = (message[0].type == 0)
                channel = message[0].channel
                if (isMember && message[0].from != get().id) {
                    room = message[0].from
                } else room = message[0].to
            } else {
                isMember = (message.type == 0)
                channel = message.channel
                if (isMember && message.from != get().id) {
                    room = message.from
                } else room = message.to
            }
            set((state) => {
                let newMessage = [];
                if (state.messageList[channel] && state.messageList[channel][room]) {
                    newMessage = state.messageList[channel][room].concat()
                }

                if (isnew) {
                    if (message instanceof Array) {
                        message.forEach(msg => newMessage.push(msg))
                    } else newMessage.push(message)
                } else {
                    if (message instanceof Array) {
                        message.forEach(msg => newMessage.unshift(msg))
                    } else newMessage.unshift(message)
                }

                return ({
                    messageList: {
                        ...state.messageList,
                        [channel]: {
                            ...state.messageList[channel],
                            [room]: newMessage,
                        }
                    }
                })
            })

            return room
        },
        clearList: () => set({ messageList: initMessageList }),
        setMessageState: (id, channel, room, msgState, newId) => set((state) => {
            const newList = state.messageList[channel][room].map(message => {
                if (message.id == id) {
                    return {
                        ...message,
                        id: newId || id,
                        state: msgState,
                    }
                } else return message
            })

            return {
                messageList: {
                    ...state.messageList,
                    [channel]: {
                        ...state.messageList[channel],
                        [room]: newList,
                    }
                }
            }
        })
    },
})