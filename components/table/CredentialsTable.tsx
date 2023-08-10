'use client'

import { useState } from "react";
import Button from "../button/Button";


enum STEPS {
    main = 0,
    login = 1,
    register = 2
}

const CredentialsTable = () => {
    // step state
    const [step, setStep] = useState<number>(0)

    // current layout
    let currentLayout = (
        <>
            <div className="flex flex-col justify-center items-center h-16 w-[50%]">
                <Button className="flex justify-center items-center p-2 rounded-md font-bold text-base
                from-[#f1e499] via-[#b1ba27] to-[#888c08] bg-gradient-to-b drop-shadow-[0_1.4px_0.05rem] 
                shadow-[#00000092] border-[#b1ba27] border-[1px] hover:opacity-75" onClick={() => setStep(1)}>
                    Sign in
                </Button>
            </div>
            <div className="flex flex-col justify-center items-center h-16 w-[50%]">
                <Button className="flex justify-center items-center p-2 rounded-md font-bold text-base
                from-[#f1e499] via-[#b1ba27] to-[#888c08] bg-gradient-to-b drop-shadow-[0_1.4px_0.05rem] 
                shadow-[#00000092] border-[#b1ba27] border-[1px] hover:opacity-75" onClick={() => setStep(2)}>
                    Sign up
                </Button>
            </div>
        </>
    )

    if(step === STEPS.login) currentLayout = (
        <div>
            <Button onClick={() => setStep(0)}>
                Back
            </Button>
            Login 
        </div>
    )

    if(step === STEPS.register) currentLayout = (
        <div>
            <Button onClick={() => setStep(0)}>
                Back
            </Button>
            Register
        </div>
    )

    return (
        <main className="flex flex-col justify-center items-center gap-4 h-[70%] w-[90%] lg:h-[50%] lg:w-[40%] 
        rounded-md from-[#c77d29] via-[#c66f22] to-[#ae5817] bg-gradient-to-b border-[#c66f22]
        border-[1px] drop-shadow-[0_0_0.5rem] shadow-[rgba(0,0,0,0.57)] overflow-hidden">
            {currentLayout}
        </main>
    );
}
 
export default CredentialsTable;
