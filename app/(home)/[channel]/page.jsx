import { Hash } from "lucide-react"


export default function MessagerRoomBlank() {

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-1 flex justify-center items-center p-7 text-zinc-400 select-none">
                <Hash className=" w-6 h-6 mr-2" />
                <p className=" text-xl">你好</p>
            </div>
        </div>
    )
}