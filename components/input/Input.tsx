'use client'

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import Button from "../button/Button";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";


interface InputProps {
    id: string
    label: string
    placeholder: string
    value: string
    register: UseFormRegister<FieldValues>
    errors: FieldErrors
    type: string
    required?: boolean
    disabled: boolean
    handleShowPass?: () => void
    isPassword?: boolean
    labelId?: string
}

const Input: React.FC<InputProps> = ({
    id, label, placeholder, value, register, 
    errors, type, required, disabled, handleShowPass,
    isPassword, labelId
}) => {
    return (
        <div className="flex flex-col justify-start items-center my-4 h-fit w-full">
            <label id={labelId} className="flex justify-start items-center py-2 px-4 h-fit w-full">
                {label}
            </label>
            <div className="relative flex justify-start items-center h-fit w-full bg-white
            rounded-md overflow-hidden">
                <input className={`flex justify-start items-center p-2 rounded-md h-fit w-full border-[1px]
                    ${errors[id] ? (
                        'border-red-600'
                    ) : (
                        'border-black'
                    )} ${isPassword && 'pr-10 md:pr-16'}`}
                    accept="image/png, image/jpeg"
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    type={type}
                    value={value}
                    {...register(id, { required })}
                />
                {
                    isPassword && (
                        <div className="absolute flex justify-center items-center aspect-square h-6 right-[5%]">
                            <Button className="flex justify-center items-center" onClick={handleShowPass}>
                                {
                                    type === 'text' ? (
                                        <BiSolidHide size={20} />
                                    ) : (
                                        <BiSolidShow size={20} />
                                    )
                                }
                            </Button>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
 
export default Input;
