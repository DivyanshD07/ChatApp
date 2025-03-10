import React, { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore.js'
import { Users } from "lucide-react"
import { useAuthStore } from '../store/useAuthStore.js';
import { useFriendStore } from '../store/useFriendStore.js';

const Sidebar = () => {

    const { getUsers, users, selectedUser, isUsersLoading, setSelectedUser } = useChatStore();
    const { isFriendsLoading, friends, fetchFriends } = useFriendStore();
    const { onlineUsers } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    useEffect(() => {
        getUsers();
        fetchFriends();
    }, [getUsers, fetchFriends]);

    const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users;
    const friendsUsers = showOnlineOnly ? friends.filter(friend => onlineUsers.includes(friend._id)) : friends;

    if (isUsersLoading) return <div>Loading...</div>
    // if (isFriendsLoading) return <div>Loading...</div>

    return (
        <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
            <div className='border-b border-base-300 w-full p-5'>
                <div className='flex items-center gap-2'>
                    <Users className="size-8" />
                    <span className='font-medium hidden lg:block'>Contacts</span>
                </div>
                {/* online filter toggle */}
                <div className='mt-3 hidden lg:flex items-center gap-2'>
                    <label className='cursor-pointer flex items-center gap-2'>
                        <input 
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className='checkbox checkbox-sm'
                        />
                        <span className='text-sm'>Show online only</span>
                    </label>
                    <span className='text-xs text-zinc-500'>({onlineUsers.length - 1} online)</span>
                </div>
            </div>

            <div className='overflow-y-auto w-full py-3'>
                {filteredUsers.length > 0 ? (users.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
                            ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}
                    >
                        <div className='relative mx-auto lg:mx-0'>
                            <img
                                src={user.profilePic || "/avatar.avif"}
                                alt={user.username}
                                className='size-12 object-cover rounded-full'
                            />
                            {onlineUsers.includes(user._id) && (
                                <span className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900' />
                            )}
                        </div>

                        {/* User info - online visible on larger screen */}
                        <div className='hidden lg:block text-left min-w-0'>
                            <div className='font-medium truncate'>{user.fullName}</div>
                            <div className='text-sm text-zinc-400'>
                                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                            </div>
                        </div>
                    </button>
                ))) : (
                    <div>No online users</div>
                )}
            </div>
        </aside>
    )
}

export default Sidebar