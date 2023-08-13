'use client'

interface ModalProps {
    children: React.ReactNode
    open: boolean
    onChange: () => void
}

const Modal: React.FC<ModalProps> = ({ children, open, onChange }) => {
    // return null if not open
    if(!open) return null

    return (
        <div className="fixed flex justify-start items-center bottom-0 top-0 left-0 right-0 m-auto z-50
        h-full w-full">
            <div className="absolute bottom-0 top-0 bg-[#38383880] h-full w-full" onClick={onChange} />
            <div className="flex flex-col justify-start items-center h-full w-full">
                {children}
            </div>
        </div>
    );
}
 
export default Modal;
