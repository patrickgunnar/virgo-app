'use client'

import { MessageType } from "@/types"


interface MessageLayoutProps {
    name: string
    username: string
    image: string
    message: MessageType
}

const MessageLayout: React.FC<MessageLayoutProps> = ({ 
    name, username, image, message
 }) => {
    return (
        <div>
            {message.message}
            aq
        </div>
    );
}
 
export default MessageLayout;
