'use client'

import Image from "next/image";
import Button from "../button/Button";
import { IoLogOut, IoPersonCircleSharp } from "react-icons/io5";
import { BsCircleFill } from "react-icons/bs";
import { useSession } from "@/providers/SessionProvider";
import { UserType } from "@/types";
import { useRouter } from "next/navigation";


// top bar
const TopBar = () => {
    // get router
    const router = useRouter()
    // get session data and logout handler
    const { session, handleLogout } = useSession()

    // use state to deal with the user data
    const user = { ...session as UserType }

    // render components
    return (
        <div className="flex justify-between items-center h-[10%] w-full from-[#d76752] 
        via-[#a94e41] to-[#882314] bg-gradient-to-b px-2 min-h-fit">
            <div className="flex justify-start items-center h-full w-[80%] md:w-[30%]">
                <Button className="justify-start hover:opacity-75"
                onClick={() => router.push('/settings')}>
                    {
                        user.image ? (
                            <div className="flex h-[80%] aspect-square rounded-full drop-shadow-[0_0_0.05rem] 
                            shadow-[#00000080] border-[#481811] border-[1px] overflow-hidden ml-2">
                                <Image className="object-cover"
                                    src={user.image}
                                    alt={user.name}
                                    fill
                                />
                            </div>
                        ) : (
                            <div className="flex h-[80%] aspect-square overflow-hidden ml-2">
                                <IoPersonCircleSharp className="h-full w-full" />
                            </div>
                        )
                    }
                    <div className="flex flex-col justify-center items-center text-left h-fit w-[70%]">
                        <div className="relative truncate text-lg/3 font-bold h-fit w-full">
                            {user.name}
                            <span className="inline-block mx-2 my-[2px]">
                                <BsCircleFill size={5} />
                            </span>
                            <span className="text-gray-800 text-base font-normal">
                                {user.username}
                            </span>
                        </div>
                        <div className="relative truncate text-base/4 text-gray-900 font-normal h-fit w-full">
                            <div className="animate-marquee">
                                {user.bio}
                            </div>
                        </div>
                    </div>
                </Button>
            </div>
            <div className="flex justify-center items-center h-full mx-2 w-fit max-w-[15%]">
                <Button className="hidden md:flex justify-center gap-2 hover:opacity-75" onClick={handleLogout}>
                    <IoLogOut size={20} />
                    Sign out
                </Button>
                <Button className="flex md:hidden focus:opacity-75" onClick={handleLogout}>
                    <IoLogOut size={20} />
                </Button>
            </div>
        </div>
    );
}
 
export default TopBar;
