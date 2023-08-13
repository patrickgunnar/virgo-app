'use client'

import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Modal from "@/components/modal/Modal";
import useModal from "@/hooks/useModal";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsPlusCircleFill, BsFillSendFill } from "react-icons/bs";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSession } from "@/providers/SessionProvider";
import { useRouter } from "next/navigation";


interface ButtonType {
    eventFn: () => void
    children: React.ReactNode
    type: "reset" | "submit" | "button" | undefined
}

enum STEPS {
    MAIN = 0,
    CHATBOX = 1
}

const MainContent = () => {
    // get session data and logout handler
    const { session, messages } = useSession()
    // get router
    const router = useRouter()
    // modal hook
    const { open, onClose, onOpen } = useModal()

    // step state
    const [step, setStep] = useState<number>(0)
    // loading state
    const [loading, setLoading] = useState<boolean>(false)
    // username stae
    const [isUsername, setIsUsername] = useState<boolean>(false)

    // interval ref
    const timeoutRef = useRef<NodeJS.Timer>()

    // use form hook
    const {
        register, handleSubmit, reset, watch,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            addingNewUser: '',
            addingNewMessage: ''
        }
    })

    const addingNewUser = watch('addingNewUser')
    const addingNewMessage = watch('addingNewMessage')

    // submit handler
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            setLoading(true)

            // check data
            if(data.addingNewUser) {
                if(data.addingNewMessage) {
                    if(session) {
                        const currentData = {
                            token: session.tokenVirgo, 
                            message: data.addingNewMessage, 
                            username: data.addingNewUser
                        }
        
                        // send data to the api
                        axios.post('/api/create-message/', currentData).then((data) => {
                            if(data.status === 200 && data.data.data !== null) {
                                // refresh page
                                router.refresh()
                                // display success msg
                                toast.success('Message sent successfully!')
                            }
                        }).catch((error) => {
                            // display error msg
                            toast.error("Sorry, your message wasn't sent. Please, try sending it again!")
                        }).finally(() => setLoading(false))
                    } else {
                        setLoading(false)
                        // display error msg
                        toast.error('To continue, please sign in to your account!')
                    }
                } else {
                    setLoading(false)
                    // display error msg
                    toast.error("You haven't entered a message to send!")
                }
            } else {
                setLoading(false)
                // display error msg
                toast.error('Please, select a username!')
            }
        } catch (error) {
            setLoading(false)
            // display error msg
            toast.error('Something went wrong, try again!')
        }
    }

    // close modal
    const handleModalClose = () => {
        onClose()
        // reset form
        reset()
    }

    const handleUsernameTimeout = useCallback(() => {
        // if there's an interval, clears it
        if(timeoutRef.current) clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(() => {
            // check if username exists
            axios.post('/api/get-username', { usernameData: addingNewUser }).then((response) => {
                // get the available username label
                const usernameLabel = document.getElementById('existingUsernameLabel')

                // if label, set msg
                if(usernameLabel) {
                    usernameLabel.innerText = response.data.exists ? (
                        `Chat with ${addingNewUser}!`
                    ) : (
                        "Username does not exist!"
                    )

                    setIsUsername(response.data.exists ? true : false)
                }
            })
        }, 1000)
    }, [addingNewUser])

    // new message handler
    const handleNewMessage = async () => {
        if(addingNewUser && isUsername) {
            // set step to chat box
            setStep(1)
            // close modal
            onClose()
        } else {
            toast.error('Enter a valid username!')
        }
    }

    useEffect(() => {
        // set interval
        if(addingNewUser.length > 0) handleUsernameTimeout()
    }, [addingNewUser, handleUsernameTimeout])

    // button handler
    const CurrentButton = ({eventFn, children, type}: ButtonType) => (
        <Button className="flex justify-center items-center rounded-md font-bold text-base py-2 px-8
        from-[#f1e499] via-[#b1ba27] to-[#888c08] bg-gradient-to-b drop-shadow-[0_1.4px_0.05rem] 
        shadow-[#00000092] border-[#b1ba27] border-[1px] hover:opacity-75" onClick={eventFn} type={type}>
            {children}
        </Button>
    )

    // current layout 
    let currentLayout = (
        <>
            <div className="flex justify-center items-center my-2 h-fit w-[20%]">
                <CurrentButton type="button" eventFn={() => onOpen()}>
                    <BsPlusCircleFill size={25} />
                </CurrentButton>
            </div>
        </>
    )

    // back btn
    const backButton = (
        <div className="flex flex-col justify-start items-center p-4 h-fit w-fit self-start">
            <CurrentButton type="button" eventFn={() => setStep(0)}>
                Back
            </CurrentButton>
        </div>
    )

    // if current step is chatbox
    if(step === STEPS.CHATBOX) currentLayout = (
        <>
            {backButton}
            <div className="flex flex-col justify-between items-center h-[87%] w-[80%] overflow-hidden">
                <div className="flex flex-col-reverse h-[82%] w-full">
                    {
                        messages?.map(item => (
                            <div key={item.id}>
                                {item.message}
                            </div>
                        ))
                    }
                </div>
                <div className="flex justify-between items-center h-[15%] w-[50%]">
                    <div className="flex justify-center items-center h-full w-[85%]">
                        <Input id="addingNewMessage"
                            placeholder="Send message..."
                            type="text"
                            isLabel={false}
                            isTextArea={true}
                            register={register}
                            errors={errors}
                            disabled={loading}
                            value={addingNewMessage}
                            required
                        />
                    </div>
                    <div className="flex justify-center items-center h-[95%] aspect-square">
                        <Button className="flex justify-center items-center from-[#d76752] rounded-full
                        via-[#a94e41] to-[#882314] bg-gradient-to-t drop-shadow-[0_1.4px_0.05rem] 
                        shadow-[#00000092] border-[#d76752] border-[1px] hover:opacity-75" type="submit"
                        onClick={handleSubmit(onSubmit)}>
                            <BsFillSendFill size={20} className="mt-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )

    // render content
    return (
        <div className="relative flex flex-col justify-start items-center h-[98%] w-[98%] overflow-hidden overflow-y-auto">
            {currentLayout}
            <Modal open={open} onChange={handleModalClose}>
                <div className="flex flex-col gap-6 justify-start items-center py-8 h-fit w-[40%] rounded-md
                from-[#c77d29] via-[#c66f22] to-[#ae5817] bg-gradient-to-b border-[#c66f22]
                border-[1px] drop-shadow-[0_0_0.5rem] shadow-[rgba(0,0,0,0.57)] overflow-hidden my-2">
                    <label className="relative truncate text-center text-base font-bold h-fit w-full">
                        Contact
                    </label>
                    <div className="flex h-fit w-[90%]">
                        <Input id="addingNewUser"
                            label="Please, provide the username you wish to contact:"
                            placeholder="Add new user to your contact"
                            labelId="existingUsernameLabel"
                            type="text"
                            register={register}
                            errors={errors}
                            disabled={loading}
                            value={addingNewUser}
                            required
                        />
                    </div>
                    <div className="flex justify-between items-center h-fit w-[80%]">
                        <div className="flex justify-center items-center h-fit w-[40%]">
                            <CurrentButton type="submit" eventFn={() => handleModalClose()}>
                                Cancel
                            </CurrentButton>
                        </div>
                        <div className="flex justify-center items-center h-fit w-[40%]">
                            <CurrentButton type="submit" eventFn={handleNewMessage}>
                                Add
                            </CurrentButton>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
 
export default MainContent;
