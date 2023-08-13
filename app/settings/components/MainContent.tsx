'use client'

import Button from "@/components/button/Button"
import Input from "@/components/input/Input"
import { useSession } from "@/providers/SessionProvider"
import { UserType } from "@/types"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { BsCircleFill } from "react-icons/bs"
import { IoPersonCircleSharp } from "react-icons/io5"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import axios from "axios"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"


enum STEP {
    MAIN = 0,
    IMAGE = 1,
    BIO = 2,
    PASSWORD = 3,
    NAME = 4,
    USERNAME = 5,
    EMAIL = 6
}

const settingsOpt = [
    'Change Profile Image', 'Change Bio', 'Change Password', 'Change Name', 'Change Username', 'Change E-mail'
]

const MainContent = () => {
    // get session data and logout handler
    const { session, handleSession } = useSession()
    // get router
    const router = useRouter()

    // settings step
    const [step, setStep] = useState<number>(0)
    // loading state
    const [isLoading, setIsLoading] = useState<boolean>(false)
    // password state
    const [passwordType, setPasswordType] = useState<string>('password')
    // image base64
    const [imageBase64, setImageBase64] = useState<string | null>(null)

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
            profileImage: '',
            profileBio: '',
            profilePassword: '',
            profileName: '',
            profileUsername: '',
            profileEmail: ''
        }
    })

    const profileImage = watch('profileImage')
    const profileBio = watch('profileBio')
    const profilePassword = watch('profilePassword')
    const profileName = watch('profileName')
    const profileUsername = watch('profileUsername')
    const profileEmail = watch('profileEmail')

    // current user
    const user = { ...session as UserType }

    // submit handler
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            setIsLoading(true)

            // if current step is image
            if (step === 1) {
                // if data
                if (data.profileImage && imageBase64) {
                    // send data to the api
                    axios.post('/api/image-update/', { data: imageBase64, token: user.tokenVirgo }).then((data) => {
                    if(data.status === 200 && data.data.data !== null) {
                        handleSession()
                        // refresh page
                        router.refresh()
                        // display success msg
                        toast.success('Updated!')
                    }
                    }).catch((error) => {
                        // display error msg
                        toast.error('Something went wrong, try again!')
                    }).finally(() => {
                        setIsLoading(false)
                    })

                } else {
                    setIsLoading(false)
                    // display error msg
                    toast.error('Required filed, try again!')
                }
            }

            // if current step is bio
            if (step === 2) {
                // if data
                if (data.profileBio) {
                    // send data to the api
                    axios.post('/api/bio-update/', { data: profileBio, token: user.tokenVirgo }).then((data) => {
                        if (data.status === 200 && data.data.data !== null) {
                            handleSession()
                            // refresh page
                            router.refresh()
                            // display success msg
                            toast.success('Updated!')
                        }
                    }).catch((error) => {
                        // display error msg
                        toast.error('Something went wrong, try again!')
                    }).finally(() => {
                        setIsLoading(false)
                    })

                } else {
                    setIsLoading(false)
                    // display error msg
                    toast.error('Required filed, try again!')
                }
            }

            // if current step is password
            if (step === 3) {
                // if data
                if (data.profilePassword) {
                    // send data to the api
                    axios.post('/api/password-update/', { data: profilePassword, token: user.tokenVirgo }).then((data) => {
                        if (data.status === 200 && data.data.data !== null) {
                            handleSession()
                            // refresh page
                            router.refresh()
                            // display success msg
                            toast.success('Updated!')
                        }
                    }).catch((error) => {
                        // display error msg
                        toast.error('Something went wrong, try again!')
                    }).finally(() => {
                        setIsLoading(false)
                    })

                } else {
                    setIsLoading(false)
                    // display error msg
                    toast.error('Required filed, try again!')
                }
            }

            // if current step is name
            if (step === 4) {
                // if data
                if (data.profileName) {
                    // send data to the api
                    axios.post('/api/name-update/', { data: profileName, token: user.tokenVirgo }).then((data) => {
                        if (data.status === 200 && data.data.data !== null) {
                            handleSession()
                            // refresh page
                            router.refresh()
                            // display success msg
                            toast.success('Updated!')
                        }
                    }).catch((error) => {
                        // display error msg
                        toast.error('Something went wrong, try again!')
                    }).finally(() => {
                        setIsLoading(false)
                    })

                } else {
                    setIsLoading(false)
                    // display error msg
                    toast.error('Required filed, try again!')
                }
            }

            // if current step is username
            if (step === 5) {
                // if data
                if (data.profileUsername) {
                    // send data to the api
                    axios.post('/api/username-update/', { data: profileUsername, token: user.tokenVirgo }).then((data) => {
                        if (data.status === 200 && data.data.data !== null) {
                            handleSession()
                            // refresh page
                            router.refresh()
                            // display success msg
                            toast.success('Updated!')
                        } else {
                            // display error msg
                            toast.error('Usernaame not available!')
                        }
                    }).catch((error) => {
                        // display error msg
                        toast.error('Something went wrong, try again!')
                    }).finally(() => {
                        setIsLoading(false)
                    })

                } else {
                    setIsLoading(false)
                    // display error msg
                    toast.error('Required filed, try again!')
                }
            }

            // if current step is e-mail
            if (step === 6) {
                // if data
                if (data.profileEmail) {
                    // send data to the api
                    axios.post('/api/email-update/', { data: profileEmail, token: user.tokenVirgo }).then((data) => {
                        if (data.status === 200 && data.data.data !== null) {
                            handleSession()
                            // refresh page
                            router.refresh()
                            // display success msg
                            toast.success('Updated!')
                        } else {
                            // display error msg
                            toast.error('E-mail not available!')
                        }
                    }).catch((error) => {
                        // display error msg
                        toast.error('Something went wrong, try again!')
                    }).finally(() => {
                        setIsLoading(false)
                    })

                } else {
                    setIsLoading(false)
                    // display error msg
                    toast.error('Required filed, try again!')
                }
            }

            // reset form
            reset()
        } catch (error) {
            setIsLoading(false)
            // display error msg
            toast.error('Something went wrong, try again!')
        }
    }

    // show/hide password handler
    const handleShowPassword = () => {
        if (passwordType === 'password') setPasswordType('text')
        else setPasswordType('password')
    }

    const handleUsernameTimeout = useCallback(() => {
        // if there's an interval, clears it
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        timeoutRef.current = setTimeout(() => {
            // check if username exists
            axios.post('/api/get-username', { usernameData: profileUsername }).then((response) => {
                // get the available username label
                const usernameLabel = document.getElementById('profileUsernameLabel')

                // if label, set msg
                if (usernameLabel) usernameLabel.innerText = response.data.exists ? (
                    "Username: it's not available, try another one!"
                ) : (
                    "Username: it's available, you can use it!"
                )
            })
        }, 1000)
    }, [profileUsername])

    // convert image to base64
    const handleBase64Convertion = async (file: File, name: string) => {
        try {
            // Convert the image to base64 format
            const responseArrayBuffer: ArrayBuffer = await file.arrayBuffer()
            const fileExtension: string = name.split('.').pop()! // Get the file extension

            const base64Data: string = Buffer.from(responseArrayBuffer).toString('base64')
            const base64Image: string = `data:image/${fileExtension};base64,${base64Data}`

            setImageBase64(base64Image)
        } catch (error) {
            console.error("Error converting image to base64:", error)

            setImageBase64(null)
        }
    }

    useEffect(() => {
        // set interval
        if (profileUsername.length > 0) handleUsernameTimeout()
        if(profileImage) handleBase64Convertion(profileImage[0], profileImage[0].name)
    }, [profileUsername, profileImage, handleUsernameTimeout])

    // current layout
    let currentLayout = (
        <>
            <div className="flex flex-col justify-center items-center h-fit w-full md:w-[70%]">
                {
                    user.image ? (
                        <div className="flex h-40 aspect-square rounded-full drop-shadow-[0_0_0.05rem] 
                        shadow-[#00000080] border-[#737373] border-[1px] overflow-hidden">
                            <Image className="object-cover"
                                src={user.image}
                                alt={user.name}
                                fill
                            />
                        </div>
                    ) : (
                        <div className="flex h-40 aspect-square overflow-hidden">
                            <IoPersonCircleSharp className="h-full w-full" />
                        </div>
                    )
                }
                <div className="flex flex-col justify-center items-center text-center =x-2 h-24 w-full">
                    <div className="relative truncate text-lg/3 font-bold  py-1 h-fit w-full">
                        {user.name}
                        <span className="inline-block mx-2 my-[2px]">
                            <BsCircleFill size={5} />
                        </span>
                        <span className="text-gray-800 text-base font-normal">
                            {user.username}
                        </span>
                    </div>
                    <div className="relative truncate text-base/4 text-gray-900 font-normal  py-1 h-fit w-full">
                        {user.bio}
                    </div>
                </div>
            </div>
            {
                settingsOpt.map((item, index) => (
                    <div className="flex justify-center items-center h-fit w-[70%]" key={index}>
                        <Button className="flex justify-start items-center px-2 py-4 from-[#f1e499] 
                        via-[#b1ba27] to-[#888c08] bg-gradient-to-b drop-shadow-[0_1.4px_0.05rem] 
                        shadow-[#00000092] border-[#b1ba27] border-[1px] min-h-fit overflow-hidden 
                        rounded-md hover:opacity-75 font-bold text-base"
                            onClick={() => setStep(index + 1)}>
                            {item}
                        </Button>
                    </div>
                ))
            }
        </>
    )

    // back btn
    const backButton = (
        <div className="flex justify-center items-center self-start my-4 h-fit w-fit">
            <Button className="flex justify-start items-center px-6 py-4 from-[#f1e499] 
            via-[#b1ba27] to-[#888c08] bg-gradient-to-b drop-shadow-[0_1.4px_0.05rem] 
            shadow-[#00000092] border-[#b1ba27] border-[1px] min-h-fit overflow-hidden 
            rounded-md hover:opacity-75 font-bold text-base mx-2" onClick={() => setStep(0)}>
                Back
            </Button>
        </div>
    )

    // submit btn
    const submitBtn = (
        <div className="flex justify-center items-center my-4 h-fit w-fit">
            <Button className="flex justify-start items-center px-6 py-4 from-[#f1e499] 
            via-[#b1ba27] to-[#888c08] bg-gradient-to-b drop-shadow-[0_1.4px_0.05rem] 
            shadow-[#00000092] border-[#b1ba27] border-[1px] min-h-fit overflow-hidden 
            rounded-md hover:opacity-75 font-bold text-base" type="submit" onClick={handleSubmit(onSubmit)}>
                Submit
            </Button>
        </div>
    )

    // if step is image
    if (step === STEP.IMAGE) currentLayout = (
        <div className="flex flex-col gap-2 justify-start items-center h-full w-full">
            {backButton}
            <div className="flex flex-col justify-center items-center h-fit w-[70%]">
                {
                    imageBase64 ? (
                        <div className="flex h-40 aspect-square rounded-full drop-shadow-[0_0_0.05rem] 
                        shadow-[#00000080] border-[#737373] border-[1px] overflow-hidden">
                            <Image className="object-cover"
                                src={imageBase64}
                                alt={user.name}
                                fill
                            />
                        </div>
                    ) : (
                        <div className="flex h-40 aspect-square overflow-hidden">
                            <IoPersonCircleSharp className="h-full w-full" />
                        </div>
                    )
                }
                <Input id="profileImage"
                    label="Select an image:"
                    placeholder="Select an image"
                    type="file"
                    errors={errors}
                    register={register}
                    required
                    disabled={isLoading}
                />
                {submitBtn}
            </div>
        </div>
    )

    // if step is bio
    if (step === STEP.BIO) currentLayout = (
        <div className="flex flex-col gap-2 justify-start items-center h-full w-full">
            {backButton}
            <div className="flex flex-col justify-center items-center h-fit w-[70%]">
                <Input id="profileBio"
                    label="Bio:"
                    placeholder="Type new bio"
                    type="text"
                    errors={errors}
                    register={register}
                    required
                    value={profileBio}
                    disabled={isLoading}
                />
                {submitBtn}
            </div>
        </div>
    )

    // if step is password
    if (step === STEP.PASSWORD) currentLayout = (
        <div className="flex flex-col gap-2 justify-start items-center h-full w-full">
            {backButton}
            <div className="flex flex-col justify-center items-center h-fit w-[70%]">
                <Input id="profilePassword"
                    label="Password:"
                    placeholder="Type new password"
                    type={passwordType}
                    errors={errors}
                    register={register}
                    required
                    value={profilePassword}
                    disabled={isLoading}
                    handleShowPass={handleShowPassword}
                    isPassword
                />
                {submitBtn}
            </div>
        </div>
    )

    // if step is name
    if (step === STEP.NAME) currentLayout = (
        <div className="flex flex-col gap-2 justify-start items-center h-full w-full">
            {backButton}
            <div className="flex flex-col justify-center items-center h-fit w-[70%]">
                <Input id="profileName"
                    label="Name:"
                    placeholder="Type new name"
                    type="text"
                    errors={errors}
                    register={register}
                    required
                    value={profileName}
                    disabled={isLoading}
                />
                {submitBtn}
            </div>
        </div>
    )

    // if step is username
    if (step === STEP.USERNAME) currentLayout = (
        <div className="flex flex-col gap-2 justify-start items-center h-full w-full">
            {backButton}
            <div className="flex flex-col justify-center items-center h-fit w-[70%]">
                <Input id="profileUsername"
                    label="Username:"
                    placeholder="Type new username"
                    type="text"
                    errors={errors}
                    register={register}
                    required
                    value={profileUsername}
                    disabled={isLoading}
                    labelId="profileUsernameLabel"
                />
                {submitBtn}
            </div>
        </div>
    )

    // if step is e-mail
    if (step === STEP.EMAIL) currentLayout = (
        <div className="flex flex-col gap-2 justify-start items-center h-full w-full">
            {backButton}
            <div className="flex flex-col justify-center items-center h-fit w-[70%]">
                <Input id="profileEmail"
                    label="E-mail:"
                    placeholder="Type new e-mail"
                    type="text"
                    errors={errors}
                    register={register}
                    required
                    value={profileEmail}
                    disabled={isLoading}
                />
                {submitBtn}
            </div>
        </div>
    )

    // render content
    return (
        <div className="flex flex-col gap-2 justify-start items-center h-[85%] w-full md:h-full md:w-[80%]
        overflow-hidden overflow-y-auto self-start mt-2">
            {currentLayout}
        </div>
    )
}

export default MainContent;
