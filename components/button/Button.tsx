'use client'

import { forwardRef } from "react";


// interface extends html buttom
// accepts any passed props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

// render button element
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    children, className, disabled, type='button', ...props
}, ref) => {
    return (
        <button className={
            `flex items-center gap-2 text-center text-base font-normal h-full w-full ${className}`
        } disabled={disabled} ref={ref} type={type} {...props}>
            {children}
        </button>
    )
})

// display name
Button.displayName = 'Button'
 
export default Button;
