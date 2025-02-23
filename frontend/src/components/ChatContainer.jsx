import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore.js'
import ChatHeader from './ChatHeader.jsx';
import MessageInput from './MessageInput.jsx';

const ChatContainer = () => {

    const {messages, getMessages, isMessagesLoading, selectedUser} = useChatStore();

    useEffect(() => {
        getMessages(selectedUser._id);
    }, [selectedUser._id, getMessages]);


    if(isMessagesLoading) return <div>Loading...</div>

    
  return (
    <div className='flex flex-1 flex-col overflow-auto'>
            <ChatHeader />
            <p>Messages...</p>
            <MessageInput />
    </div>
  )
}

export default ChatContainer