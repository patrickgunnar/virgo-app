'use client'

import Button from "@/components/button/Button";
import Loading from "@/components/button/loading/Loading";
import Input from "@/components/input/Input";
import Modal from "@/components/modal/Modal";
import useModal from "@/hooks/useModal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { useSession } from "@/providers/SessionProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsFillSendFill, BsPlusCircleFill } from "react-icons/bs";
import { MdGroupWork } from "react-icons/md";
import axios from "axios";
import { toast } from "react-hot-toast";
import MessageLayout from "./MessageLayout";


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
    const { session, groups } = useSession()
    // get router
    const router = useRouter()
    // modal hook
    const { open, onClose, onOpen } = useModal()

    // step state
    const [step, setStep] = useState<number>(0)
    // loading state
    const [loading, setLoading] = useState<boolean>(false)
    // username state
    const [isUsername, setIsUsername] = useState<boolean>(false)

    // use form hook
    const {
        register, handleSubmit, reset, setValue, watch,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            addingNewGroup: '',
            addingNewUser: '',
            addingNewMessage: ''
        }
    })

    const addingNewUser = watch('addingNewUser')
    const addingNewMessage = watch('addingNewMessage')
    const addingNewGroup = watch('addingNewGroup')

    const handleGroupValue = (id: string) => {
        // set username
        setValue('addingNewGroup', id)
        // step to boxchat
        setStep(1)
    }

    const resetMessage = () => {
        setValue('addingNewMessage', '')
    }

    // submit handler
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            setLoading(true)

            // check data
            if (data.addingNewUser) {
                if (data.addingNewMessage) {
                    if (session) {
                        const currentData = {
                            token: session.tokenVirgo,
                            message: data.addingNewMessage,
                            username: data.addingNewUser
                        }

                        // send data to the api
                        axios.post('/api/create-message/', currentData).then((data) => {
                            if (data.status === 200 && data.data.data !== null) {
                                // refresh page
                                router.refresh()
                                // display success msg
                                toast.success('Message sent successfully!')
                                // reset message
                                resetMessage()
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

    // new group handler
    const onNewGroupSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            setLoading(true)

            // check data
            if (data.addingNewGroup && session) {
                const currentData = {
                    token: session.tokenVirgo,
                    groupName: data.addingNewGroup
                }

                // send data to the api
                axios.post('/api/create-group/', currentData).then((data) => {
                    if (data.status === 200 && data.data.data !== null) {
                        // refresh page
                        router.refresh()
                        // display success msg
                        toast.success('Group created successfully!')
                        // reset message
                        resetMessage()
                    }
                }).catch((error) => {
                    // display error msg
                    toast.error("Sorry, your group wasn't created. Please, try creating it again!")
                }).finally(() => setLoading(false))
            } else {
                setLoading(false)
                // display error msg
                toast.error('Please, enter the group name!')
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

    // back button handler
    const handleBack = () => {
        // set step
        setStep(0)
        // reset form
        reset()
    }

    // new message handler
    const handleNewMessage = () => {
        if (addingNewUser && isUsername) {
            // set step to chat box
            setStep(1)
            // close modal
            onClose()
        } else {
            toast.error('Enter a valid username!')
        }
    }

    // button handler
    const CurrentButton = ({ eventFn, children, type }: ButtonType) => (
        <Button className="flex justify-center items-center rounded-md font-bold text-base py-2 px-8
        from-[#f1e499] via-[#b1ba27] to-[#888c08] bg-gradient-to-b drop-shadow-[0_1.4px_0.05rem] 
        shadow-[#00000092] border-[#b1ba27] border-[1px] hover:opacity-75" disabled={loading}
            onClick={eventFn} type={type}>
            {
                !loading ? children : type === 'submit' ? <Loading /> : children
            }
        </Button>
    )

    // current layout 
    let currentLayout = (
        <>
            <div className="flex flex-col justify-center items-center my-2 mb-4 h-fit w-[40%] md:w-[20%]">
                <CurrentButton type="button" eventFn={() => onOpen()}>
                    <BsPlusCircleFill size={25} />
                </CurrentButton>
            </div>
            {
                groups.map((item, index) => (
                    <div className="flex gap-2 justify-center items-center h-20 w-[90%]" key={index}>
                        <Button className="flex gap-2 justify-between items-center rounded-md from-[#ff9e1b] 
                        to-[#ffcf54] bg-gradient-to-b border-[#ff9e1b] p-2 border-[1px] drop-shadow-[0_0_0.1rem] 
                        shadow-[rgba(0,0,0,0.57)] overflow-hidden hover:opacity-75 my-2" type="button" disabled={loading}
                        onClick={() => handleGroupValue(item.groupData.id)}>
                            <div className="flex h-16 aspect-square overflow-hidden ml-2">
                                <MdGroupWork className="h-full w-full" />
                            </div>
                            <div className="flex flex-col justify-center items-start text-left h-full w-[65%] md:w-[93%]">
                                <div className="relative truncate text-lg text-black font-bold h-fit w-full">
                                    {item.groupData.name}
                                </div>
                                <div className="relative truncate text-sm text-gray-800 font-normal h-fit w-full">
                                    {item.messages[0]?.message || 'No messages'}
                                </div>
                            </div>
                        </Button>
                    </div>
                ))
            }
        </>
    )

    // back btn
    const backButton = (
        <div className="flex flex-col justify-start items-center p-4 h-fit w-fit self-start">
            <CurrentButton type="button" eventFn={handleBack}>
                Back
            </CurrentButton>
        </div>
    )

    // if current step is chatbox
    if (step === STEPS.CHATBOX && addingNewGroup && session) {
        const currentGroup = groups.filter(item => item.groupData.id === addingNewGroup)[0] 

        currentLayout = (
            <>
                {backButton}
                <div className="flex flex-col justify-between items-center h-[87%] w-[80%] overflow-hidden">
                    <div className="flex justify-between items-center h-[7%] w-full">
                        <div className="hidden md:flex justify-start items-center text-left h-full w-[70%] border-[#ae5817] 
                        border-t-[1px] border-b-[1px]">
                            <div className="flex justify-between items-center h-full w-full">
                                <div className="flex justify-between items-center h-full w-[40%]">
                                    <div className="relative truncate h-fit w-[95%]">
                                        <label>{currentGroup.groupData.name} members</label>
                                    </div>
                                    <label>:</label>
                                </div>
                                <div className="relative truncate h-fit w-[60%]">
                                    <div className="animate-marquee">
                                        {
                                            currentGroup.membersData.map((user, index) => (
                                                <div key={index} className="flex justify-center items-center px-2 h-fit w-fit">
                                                    {user.name} - @{user.username}
                                                    {
                                                        index === currentGroup.membersData.length - 2 && ','
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center items-center px-6 h-full w-full md:w-fit">
                            <CurrentButton type="button" eventFn={() => {}}>
                                Add User
                            </CurrentButton>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse justify-start items-start h-[73%] w-full 
                    overflow-hidden overflow-y-auto no-scrollbar">
                        {
                            currentGroup.messages.map(item => {
                                const currentUser = currentGroup.membersData.filter(user => (item.senderId === user.userId))[0]

                                return (
                                    <MessageLayout key={item.id}
                                        name={currentUser.name}
                                        username={currentUser.username}
                                        image={currentUser.image || ''}
                                        message={item}
                                        isCurrentUser={session.id === item.senderId}
                                        bio={currentUser.bio}
                                    />
                                )
                            })
                        }
                    </div>
                    <div className="flex gap-2 justify-between items-center mb-2 md:mb-0 h-[15%] w-full lg:w-[50%]">
                        <div className="flex justify-center items-center h-full w-[70%] md:w-[85%]">
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
                                onClick={handleSubmit(onSubmit)} disabled={loading}>
                                {
                                    !loading ? (
                                        <BsFillSendFill size={20} className="mt-1" />
                                    ) : (
                                        <Loading />
                                    )
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div className="relative flex gap-2 flex-col justify-start items-center h-[87%] md:h-[98%] w-[98%] 
        self-start overflow-hidden overflow-y-auto">
            {currentLayout}
            <Modal open={open} onChange={handleModalClose}>
                <div className="flex flex-col gap-6 justify-start items-center py-8 h-fit w-[40%] rounded-md
                from-[#c77d29] via-[#c66f22] to-[#ae5817] bg-gradient-to-b border-[#c66f22]
                border-[1px] drop-shadow-[0_0_0.5rem] shadow-[rgba(0,0,0,0.57)] overflow-hidden my-2">
                    <label className="relative truncate text-center text-base font-bold h-fit w-full">
                        Group
                    </label>
                    <div className="flex h-fit w-[90%]">
                        <Input id="addingNewGroup"
                            label="Please, provide the group name:"
                            placeholder="Add the name of the group"
                            type="text"
                            register={register}
                            errors={errors}
                            disabled={false}
                            value={addingNewGroup}
                            required
                        />
                    </div>
                    <div className="flex justify-between items-center h-fit w-[80%]">
                        <div className="flex justify-center items-center h-fit w-[40%]">
                            <CurrentButton type="button" eventFn={() => handleModalClose()}>
                                Cancel
                            </CurrentButton>
                        </div>
                        <div className="flex justify-center items-center h-fit w-[40%]">
                            <Button className="flex justify-center items-center rounded-md font-bold text-base py-2 px-8
                            from-[#f1e499] via-[#b1ba27] to-[#888c08] bg-gradient-to-b drop-shadow-[0_1.4px_0.05rem] 
                            shadow-[#00000092] border-[#b1ba27] border-[1px] hover:opacity-75" disabled={loading}
                                type="submit" onClick={handleSubmit(onNewGroupSubmit)}>
                                {
                                    !loading ? 'Add' : <Loading />
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default MainContent;
