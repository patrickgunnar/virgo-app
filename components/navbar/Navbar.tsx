'use client'

import { PiChatTeardropFill, PiChatsTeardropFill } from "react-icons/pi";
import { RiSettings2Fill } from "react-icons/ri";
import { TbInfoSquareRoundedFilled } from "react-icons/tb";
import { CgMenu } from "react-icons/cg";
import { GrClose } from "react-icons/gr";
import { AiTwotoneCloseCircle } from "react-icons/ai";
import Button from "../button/Button";
import { useState } from "react";
import { clsx } from "clsx";
import { usePathname, useRouter } from "next/navigation";


// bootom bar
const Navbar = () => {
    // get router
    const router = useRouter()
    // get pathname 
    const pathname = usePathname()
    // deal with mobile menu show/hide menu options
    const [isMobileOpened, setIsMobileOpened] = useState<boolean>(false)

    // render components
    return (
        <>
            <div className="hidden md:grid grid-cols-4 gap-4 h-[10%] w-[90%] rounded-md my-[1%]
            from-[#f1e499] via-[#b1ba27] to-[#888c08] bg-gradient-to-b drop-shadow-[0_1.4px_0.05rem] 
            shadow-[#00000092] border-[#b1ba27] border-[1px] min-h-fit overflow-hidden">
                <Button className="relative justify-center hover:bg-[#00000024]" onClick={() => router.push('/')}>
                    <PiChatTeardropFill size={20} />
                    Chats
                    {
                        pathname === '/' && <AiTwotoneCloseCircle size={8} className="absolute top-auto bottom-auto right-2" />
                    }
                </Button>
                <Button className="relative justify-center hover:bg-[#00000024]" onClick={() => router.push('/groups')}>
                    <PiChatsTeardropFill size={20} />
                    Groups
                    {
                        pathname === '/groups' && <AiTwotoneCloseCircle size={8} className="absolute top-auto bottom-auto right-2" />
                    }
                </Button>
                <Button className="relative justify-center hover:bg-[#00000024]" onClick={() => router.push('/settings')}>
                    <RiSettings2Fill size={20} />
                    Settings
                    {
                        pathname === '/settings' && <AiTwotoneCloseCircle size={8} className="absolute top-auto bottom-auto right-2" />
                    }
                </Button>
                <Button className="relative justify-center hover:bg-[#00000024]" onClick={() => router.push('/about')}>
                    <TbInfoSquareRoundedFilled size={20} />
                    About
                    {
                        pathname === '/about' && <AiTwotoneCloseCircle size={8} className="absolute top-auto bottom-auto right-2" />
                    }
                </Button>
            </div>
            <div className={clsx(`md:hidden absolute grid gap-3 h-fit bottom-2 rounded-md from-[#f1e499] 
            via-[#b1ba27] to-[#888c08] bg-gradient-to-b drop-shadow-[0_1.4px_0.05rem] shadow-[#00000092] 
            border-[#b1ba27] border-[1px] min-h-fit overflow-hidden`,
            isMobileOpened ? 'grid-cols-5 left-auto right-auto w-[95%]' : 'grid-cols-1 left-2 w-fit')}>
                <Button className="p-3  justify-center aspect-square hover:bg-[#00000024] focus:bg-[#00000024]" 
                onClick={() => setIsMobileOpened(!isMobileOpened)}>
                    {
                        isMobileOpened ? (
                            <GrClose size={30} />
                        ) : (
                            <CgMenu size={30} />
                        )
                    }
                </Button>
                {
                    isMobileOpened && (
                        <>
                            <Button className="relative justify-center focus:bg-[#00000024]" onClick={() => router.push('/')}>
                                <PiChatTeardropFill size={30} />
                                {
                                    pathname === '/' && <AiTwotoneCloseCircle size={8} className="absolute top-1 right-1" />
                                }
                            </Button>
                            <Button className="relative justify-center focus:bg-[#00000024]" onClick={() => router.push('/groups')}>
                                <PiChatsTeardropFill size={30} />
                                {
                                    pathname === '/groups' && <AiTwotoneCloseCircle size={8} className="absolute top-1 right-1" />
                                }
                            </Button>
                            <Button className="relative justify-center focus:bg-[#00000024]" onClick={() => router.push('/settings')}>
                                <RiSettings2Fill size={30} />
                                {
                                    pathname === '/settings' && <AiTwotoneCloseCircle size={8} className="absolute top-1 right-1" />
                                }
                            </Button>
                            <Button className="relative justify-center focus:bg-[#00000024]" onClick={() => router.push('/about')}>
                                <TbInfoSquareRoundedFilled size={30} />
                                {
                                    pathname === '/about' && <AiTwotoneCloseCircle size={8} className="absolute top-1 right-1" />
                                }
                            </Button>
                        </>
                    )
                }
            </div>
        </>
    );
}
 
export default Navbar;
