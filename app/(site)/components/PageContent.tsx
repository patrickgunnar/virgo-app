'use client'

import useStep from "@/hooks/useStep";
import { useEffect, useState } from "react";


enum STEPS {
    CHATS = 0,
    GROUPS = 1,
    SETTINGS = 2,
    ABOUT = 3
}

// page content
const PageContent = () => {
    // step setter hook
    const { setStep, step } = useStep()

    // holds the current content
    const [currentContent, setCurrentContent] = useState<React.ReactNode | null>(null)

    useEffect(() => {
        if(step === STEPS.CHATS) setCurrentContent(
            <div>Chats</div>
        )

        if(step === STEPS.GROUPS) setCurrentContent(
            <div>Groups</div>
        )
    
        if(step === STEPS.SETTINGS) setCurrentContent(
            <div>Settings</div>
        )
    
        if(step === STEPS.ABOUT) setCurrentContent(
            <div>About</div>
        )
    }, [step])

    // render elements
    return (
        <div>{currentContent}</div>
    );
}
 
export default PageContent;
