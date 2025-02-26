import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore.js'
import ChatHeader from './ChatHeader.jsx';
import MessageInput from './MessageInput.jsx';
import { useAuthStore } from '../store/useAuthStore.js';
import { formatMessageTime } from '../lib/utils.js';

const ChatContainer = () => {

  const messageRef = useRef(null);
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unSubscribeToMessages } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => {
      unSubscribeToMessages();
    }

  }, [selectedUser._id, getMessages, subscribeToMessages, unSubscribeToMessages]);


  useEffect(() => {
    if(messageRef.current && messages) messageRef.current.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (isMessagesLoading) return <div>Loading...</div>


  return (
    <div className='flex flex-1 flex-col overflow-auto'>
      <ChatHeader />
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageRef}
          >
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img
                  src={message.senderId === authUser._id
                    ? authUser.profilePic || "./avatar.avif"
                    : selectedUser.profilePic || "./avatar.avif"}
                  alt="profile pic"
                />
              </div>
            </div>
            <div className='chat-header mb-1'>
              <time className='text-xs opacity-50 ml-1'>
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className='chat-bubble flex flex-col'>
              {message.image && (
                <img
                  src={message.image}
                  alt='Attachment'
                  className='sm:max-w-[200px] rounded-md mb-2'
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  )
}

export default ChatContainer