import React from 'react';
import { useChatStore } from '../Store/useChatStore';
import WelcomeChatMessage from '../Components/WelcomeChatMessage';
import ChatContainer from '../Components/ChatContainer';
import Sidebar from '../Components/Sidebar';

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className=" px-4 lg:-mt-20 pt-16 bg-base-100">
      <div className="flex items-center justify-center h-full">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl flex h-[calc(100vh-8rem)]">
          <Sidebar />
          {selectedUser ? <ChatContainer /> : <WelcomeChatMessage />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
