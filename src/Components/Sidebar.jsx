import React, { useEffect } from 'react'
import { useChatStore } from '../Store/useChatStore'

const Sidebar = () => {
    const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } = useChatStore();

    const onlineUsers = [];

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    
  return (
    <div>Sidebar</div>
  )
}

export default Sidebar