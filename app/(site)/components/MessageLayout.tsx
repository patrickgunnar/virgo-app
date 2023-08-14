'use client'

import { MessageType } from "@/types"
import clsx from "clsx"
import Image from "next/image"
import { BsCircleFill } from "react-icons/bs"
import { IoPersonCircleSharp } from "react-icons/io5"


interface MessageLayoutProps {
    name: string
    username: string
    image: string
    message: MessageType
    isCurrentUser: boolean
}

const MessageLayout: React.FC<MessageLayoutProps> = ({
    name, username, image, message, isCurrentUser
}) => {
    return (
        <div className={clsx(`flex gap-4 justify-start items-center py-2 px-4 my-2 h-fit w-fit max-w-[70%] rounded-md 
        from-[#ff9e1b] to-[#ffcf54] bg-gradient-to-b border-[#ff9e1b] border-[1px] drop-shadow-[0_0_0.1rem] 
        shadow-[rgba(0,0,0,0.57)]`, isCurrentUser ? 'self-end' : 'self-start')}>
            {
                image ? (
                    <div className="relative flex h-16 aspect-square rounded-full drop-shadow-[0_0_0.05rem] 
                        shadow-[#00000080] border-[#481811] border-[1px] overflow-hidden ml-2">
                        <Image className="object-cover"
                            src={image}
                            alt={name}
                            fill
                        />
                    </div>
                ) : (
                    <div className="relative flex h-16 aspect-square overflow-hidden ml-2">
                        <IoPersonCircleSharp className="h-full w-full" />
                    </div>
                )
            }
            <div className="flex flex-col flex-wrap justify-center items-start text-left h-fit w-fit  max-w-[85%]">
                <div className="relative truncate text-lg text-black font-bold h-fit w-fit">
                    {name}
                    <span className="inline-block mx-2 my-[2px]">
                        <BsCircleFill size={5} />
                    </span>
                    <span className="text-gray-800 text-base font-normal">
                        {username}
                    </span>
                </div>
                <div className="relative break-words text-base text-gray-800 font-normal 
                h-fit w-fit overflow-x-hidden">
                    {message.message}
                </div>
            </div>
        </div>
    );
}

export default MessageLayout;
