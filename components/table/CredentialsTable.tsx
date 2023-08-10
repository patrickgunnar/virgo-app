'use client'

import { useState } from "react";
import Button from "../button/Button";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import Input from "../input/Input";


interface ButtonType {
    eventFn: () => void
    label: string
}

enum STEPS {
    MAIN = 0,
    LOGIN = 1,
    REGISTER = 2

}

enum STEPS_REGISTER {
    EMAIL = 0,
    USERNAME = 1
}

const CredentialsTable = () => {
    // step state
    const [step, setStep] = useState<number>(0)
    // step state
    const [stepRegister, setStepRegister] = useState<number>(0)
    // loading state
    const [isLoading, setIsLoading] = useState<boolean>(false) 
    // password state
    const [passwordType, setPasswordType] = useState<string>('password')

    // use form hook
    const {
        register, handleSubmit, reset, watch,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            emailData: '',
            passwordData: '',
            nameData: '',
            usernameData: ''
        }
    })

    const emailData = watch('emailData')
    const passwordData = watch('passwordData')
    const nameData = watch('nameData')
    const usernameData = watch('usernameData')

    // submit handler
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {}

    // show/hide password handler
    const handleShowPassword = () => {
        if(passwordType === 'password') setPasswordType('text')
        else setPasswordType('password')
    }

    // back button handler
    const handleBackBtn = () => {
        // reset form
        reset()
        // go back
        setStep(0)
    }

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
            <label className="relative truncate text-center text-3xl uppercase font-font-title font-normal mb-20 h-fit w-full">
                Virgo Chat
            </label>
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
            <CurrentButton label="Back" eventFn={handleBackBtn} />
        </div>
    )

    // if current step is login
    if(step === STEPS.LOGIN) currentLayout = (
        <div className="flex flex-col justify-between items-center h-full w-full">
            {backButton}
            <div className="flex flex-col justify-center items-center h-fit w-[60%]">
                <label className="relative truncate text-center text-base font-bold h-fit w-full">
                    Sign in
                </label>
                <Input id="emailData" label="E-mail"
                    placeholder="Enter your e-mail"
                    register={register}
                    errors={errors}
                    type="text"
                    disabled={isLoading}
                    value={emailData}
                    required
                />
                <Input id="passwordData" label="Password"
                    placeholder="Enter your password"
                    register={register}
                    errors={errors}
                    type={passwordType}
                    disabled={isLoading}
                    value={passwordData}
                    handleShowPass={handleShowPassword}
                    isPassword
                    required
                />
                <div className="flex justify-center items-center my-4 h-16 w-[40%]">
                    <CurrentButton label="Login" eventFn={() => {}} />
                </div>
            </div>
        </div>
    )

    // if current step is register
    if(step === STEPS.REGISTER) {
        // current register form step
        let currentRegisterForm = (
            <>
                <Input id="emailData" label="E-mail"
                    placeholder="Enter your e-mail"
                    register={register}
                    errors={errors}
                    type="email"
                    disabled={isLoading}
                    value={emailData}
                    required
                />
                <Input id="passwordData" label="Password"
                    placeholder="Enter your password"
                    register={register}
                    errors={errors}
                    type={passwordType}
                    disabled={isLoading}
                    value={passwordData}
                    handleShowPass={handleShowPassword}
                    isPassword
                    required
                />
            </>
        )

        // if current step is username
        if(stepRegister === STEPS_REGISTER.USERNAME) currentRegisterForm = (
            <>
                <Input id="nameData" label="Name"
                    placeholder="Enter your name"
                    register={register}
                    errors={errors}
                    type="text"
                    disabled={isLoading}
                    value={nameData}
                    required
                />
                <Input id="usernameData" label="Username"
                    placeholder="Enter your username"
                    register={register}
                    errors={errors}
                    type="text"
                    disabled={isLoading}
                    value={usernameData}
                    required
                />
            </>
        )

        // current back button handler
        const currentBackBtn = stepRegister === STEPS_REGISTER.USERNAME ? () => setStepRegister(0) : handleBackBtn
        // current button label
        const currentLabelBtn = stepRegister === STEPS_REGISTER.USERNAME ? 'Register' : 'Continue'
        // current handler
        const currentBtnHandler = stepRegister === STEPS_REGISTER.USERNAME ? handleSubmit(onSubmit) : () => setStepRegister(1)

        currentLayout = (
            <div className="flex flex-col justify-between items-center h-full w-full">
                <div className="flex flex-col justify-start items-center p-4 h-fit w-fit self-start">
                    <CurrentButton label="Back" eventFn={currentBackBtn} />
                </div>
                <div className="flex flex-col justify-center items-center h-fit w-[60%]">
                    <label className="relative truncate text-center text-base font-bold h-fit w-full">
                        Sign up
                    </label>
                    {currentRegisterForm}
                    <div className="flex justify-center items-center my-4 h-16 w-[40%]">
                        <CurrentButton label={currentLabelBtn} eventFn={currentBtnHandler} />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <main className="flex flex-col justify-center items-center gap-4 h-[70%] w-[90%] lg:h-[50%] lg:w-[40%] 
        rounded-md from-[#c77d29] via-[#c66f22] to-[#ae5817] bg-gradient-to-b border-[#c66f22]
        border-[1px] drop-shadow-[0_0_0.5rem] shadow-[rgba(0,0,0,0.57)] overflow-hidden">
            {currentLayout}
        </main>
    );
}
 
export default CredentialsTable;
