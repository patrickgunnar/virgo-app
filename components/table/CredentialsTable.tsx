'use client'

import { useState } from "react";
import Button from "../button/Button";


interface ButtonType {
    eventFn: () => void
    label: string
}

enum STEPS {
    main = 0,
    login = 1,
    register = 2
}

const CredentialsTable = () => {
    // step state
    const [step, setStep] = useState<number>(0)

    // button handler
    const CurrentButton = ({eventFn, label}: ButtonType) => (
        <Button className="flex justify-center items-center rounded-md font-bold text-base py-2 px-8
        from-[#f1e499] via-[#b1ba27] to-[#888c08] bg-gradient-to-b drop-shadow-[0_1.4px_0.05rem] 
        shadow-[#00000092] border-[#b1ba27] border-[1px] hover:opacity-75" onClick={eventFn}>
            {label}
        </Button>
    )

    // current layout
    let currentLayout = (
        <>
            <div className="flex flex-col justify-center items-center h-16 w-[50%]">
                <CurrentButton label="Sign in" eventFn={() => setStep(1)} />
            </div>
            <div className="flex flex-col justify-center items-center h-16 w-[50%]">
                <CurrentButton label="Sign up" eventFn={() => setStep(2)} />
            </div>
        </>
    )

    // back btn
    const backButton = (
        <div className="flex flex-col justify-start items-center p-4 h-fit w-fit self-start">
            <CurrentButton label="Back" eventFn={() => setStep(0)} />
        </div>
    )

    // if current step is login
    if(step === STEPS.login) currentLayout = (
        <div className="flex flex-col justify-between items-center h-full w-full">
            {backButton}
            Login 
        </div>
    )

    // if current step is register
    if(step === STEPS.register) currentLayout = (
        <div className="flex flex-col justify-between items-center h-full w-full">
            {backButton}
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
