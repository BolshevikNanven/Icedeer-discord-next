import { StateCreator } from "zustand"
import { Store } from "./createStore"

export interface User extends UserData {
    userActions: UserActions,
}

type UserData = {
    id: string,
    username: string,
    avatar: string,
    token: string,
}

type UserActions = {
    setAll: ({ }: UserData) => void,
    setToken: (token: string) => void,
    clear: () => void,
}

const initUserData: UserData = {
    id: '',
    username: '',
    avatar: '',
    token: null,
}

export const createUser: StateCreator<Store, [], [], User> = (set) => ({
    ...initUserData,
    userActions: {
        setAll: (state) => set(() => ({ ...state })),
        setToken: (token) => set(() => ({ token: token })),
        clear: () => set({ ...initUserData }),
    },
})