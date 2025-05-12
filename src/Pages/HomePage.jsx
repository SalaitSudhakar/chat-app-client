import React from 'react';
import { useChatStore } from '../Store/useChatStore';
import WelcomeChatMessage from '../Components/WelcomeChatMessage';
import ChatContainer from '../Components/ChatContainer';
import Sidebar from '../Components/Sidebar';

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="px-1 lg:px-4 bg-base-100">
      <div className="flex items-center justify-center h-full">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-7xl flex h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)]">
          <Sidebar />
          {selectedUser ? <ChatContainer /> : <WelcomeChatMessage />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
