'use client'

import Button from "@/components/button/Button";
import Loading from "@/components/button/loading/Loading";
import Input from "@/components/input/Input";
import Modal from "@/components/modal/Modal";
import useModal from "@/hooks/useModal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { useSession } from "@/providers/SessionProvider";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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

enum MODAL {
    NEWUSER = 1,
    NEWGROUP = 2
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
    // model content
    const [modalStep, setModalStep] = useState<number>(0)
    // current group id
    const [currentDisplayGroupId, setCurrentDisplayGroupId] = useState<string | null>(null)

    // interval ref
    const timeoutRef = useRef<NodeJS.Timer>()

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
        // set group's id
        setCurrentDisplayGroupId(id)
        // step to boxchat
        setStep(1)
    }

    const resetMessage = () => {
        setValue('addingNewMessage', '')
    }

    // close modal
    const handleModalClose = () => {
        onClose()
        // reset form
        reset()
    }

    // submit handler
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            setLoading(true)

            // check data
            if (currentDisplayGroupId) {
                if (data.addingNewMessage) {
                    if (session) {
                        const currentData = {
                            token: session.tokenVirgo,
                            message: data.addingNewMessage,
                            username: session.username,
                            groupId: currentDisplayGroupId
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
        // add new group handler
        if (MODAL.NEWGROUP === modalStep) {
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
                            // close modal
                            handleModalClose()
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
        
        // add new user to group handler
        if(MODAL.NEWUSER === modalStep) {
            try {
                setLoading(true)

                // check data
                if (data.addingNewUser && session && currentDisplayGroupId && isUsername) {
                    const currentData = {
                        token: session.tokenVirgo,
                        username: data.addingNewUser,
                        groupId: currentDisplayGroupId
                    }

                    // send data to the api
                    axios.post('/api/add-user-group/', currentData).then((data) => {
                        if (data.status === 200 && data.data.data !== null) {
                            // refresh page
                            router.refresh()
                            // display success msg
                            toast.success('User added successfully!')
                            // reset message
                            resetMessage()
                            // close modal
                            handleModalClose()
                        }
                    }).catch((error) => {
                        // display error msg
                        toast.error("Sorry, the user wasn't added to the group. Please, try adding it again!")
                    }).finally(() => setLoading(false))
                } else {
                    setLoading(false)
                    // display error msg
                    toast.error('Please, enter a valid username!')
                }
            } catch (error) {
                setLoading(false)
                // display error msg
                toast.error('Something went wrong, try again!')
            }
        }
    }

    // send message trigger
    const triggerSendMessage = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()

        // trigger submit handler
        handleSubmit(onSubmit)()
    }

    // add new user trigger
    const triggerNewUserGroup = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()

        // trigger submit handler
        handleSubmit(onNewGroupSubmit)()
    }

    // back button handler
    const handleBack = () => {
        // set step
        setStep(0)
        // reset form
        reset()
    }

    // new group modal layout handler
    const handleNewGroupModalLayout = () => {
        // set modal content
        setModalStep(2)
        // open modal
        onOpen()
    }

    // new user to group modal layout handler
    const handleNewUserGroupModalLayout = () => {
        // set modal content
        setModalStep(1)

        // open modal
        onOpen()
    }

    const handleUsernameTimeout = useCallback(() => {
        setLoading(true)

        // if there's an interval, clears it
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(() => {
            // check if username exists
            axios.post('/api/get-username', { usernameData: addingNewUser }).then((response) => {
                // get the available username label
                const usernameLabel = document.getElementById('existingUsernameLabel')

                // if label, set msg
                if (usernameLabel) {
                    usernameLabel.innerText = response.data.exists ? (
                        `Add @${addingNewUser}! to group`
                    ) : (
                        "Username does not exist!"
                    )

                    setIsUsername(response.data.exists ? true : false)
                }

                if (usernameLabel && session?.username === addingNewUser) {
                    usernameLabel.innerText = "Please, choose a unique username that is different from your own!"
                    setIsUsername(false)
                }
            }).finally(() => setLoading(false))
        }, 1000)
    }, [addingNewUser])

    useEffect(() => {
        // set interval
        if (addingNewUser.length > 0) handleUsernameTimeout()
    }, [addingNewUser, handleUsernameTimeout])

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
                <CurrentButton type="button" eventFn={handleNewGroupModalLayout}>
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

    // submit button
    const submitButton = (
        <div className="flex justify-center items-center h-fit w-[40%]">
            <Button className="flex justify-center items-center rounded-md font-bold text-base py-2 px-8
            from-[#f1e499] via-[#b1ba27] to-[#888c08] bg-gradient-to-b drop-shadow-[0_1.4px_0.05rem] 
            shadow-[#00000092] border-[#b1ba27] border-[1px] hover:opacity-75" disabled={loading}
                type="submit" onClick={triggerNewUserGroup}>
                {
                    !loading ? 'Add' : <Loading />
                }
            </Button>
        </div>
    )

    // modal layout
    let currentModalLayout = <></>

    // if modal step is to add new user to group
    if(modalStep === MODAL.NEWUSER) currentModalLayout = (
        <>
            <label className="relative truncate text-center text-base font-bold h-fit w-full">
                Contact
            </label>
            <div className="flex h-fit w-[90%]">
                <Input id="addingNewUser"
                    label="Please, provide the username you wish to add:"
                    placeholder="Add new user to your group"
                    labelId="existingUsernameLabel"
                    type="text"
                    register={register}
                    errors={errors}
                    disabled={false}
                    value={addingNewUser}
                    required
                />
            </div>
            <div className="flex justify-between items-center h-fit w-[80%]">
                <div className="flex justify-center items-center h-fit w-[40%]">
                    <CurrentButton type="button" eventFn={() => handleModalClose()}>
                        Cancel
                    </CurrentButton>
                </div>
                {submitButton}
            </div>
        </>
    )

    // if modal step is to create new group
    if(modalStep === MODAL.NEWGROUP) currentModalLayout = (
        <>
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
                {submitButton}
            </div>
        </>
    )

    // if current step is chatbox
    if (step === STEPS.CHATBOX && currentDisplayGroupId && session) {
        const currentGroup = groups.filter(item => item.groupData.id === currentDisplayGroupId)[0]

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
                                    <div className="flex animate-marquee">
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
                            <CurrentButton type="button" eventFn={handleNewUserGroupModalLayout}>
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
                            />
                        </div>
                        <div className="flex justify-center items-center h-[95%] aspect-square">
                            <Button className="flex justify-center items-center from-[#d76752] rounded-full
                            via-[#a94e41] to-[#882314] bg-gradient-to-t drop-shadow-[0_1.4px_0.05rem] 
                            shadow-[#00000092] border-[#d76752] border-[1px] hover:opacity-75" type="submit"
                                onClick={triggerSendMessage} disabled={loading}>
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
                <div className="flex flex-col gap-6 justify-start items-center py-8 h-fit w-[98%] md:w-[40%] rounded-md
                from-[#c77d29] via-[#c66f22] to-[#ae5817] bg-gradient-to-b border-[#c66f22]
                border-[1px] drop-shadow-[0_0_0.5rem] shadow-[rgba(0,0,0,0.57)] overflow-hidden my-2">
                    {currentModalLayout}
                </div>
            </Modal>
        </div>
    );
}

export default MainContent;
