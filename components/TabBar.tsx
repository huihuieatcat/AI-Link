import React from 'react';
import { Home, Compass, MessageSquare, User } from 'lucide-react';
import { TabKey } from '../types';

interface TabBarProps {
  currentTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ currentTab, onTabChange }) => {
  const getTabClass = (tab: TabKey) => 
    `flex flex-col items-center justify-center w-full h-full space-y-1 ${currentTab === tab ? 'text-blue-600' : 'text-gray-400'}`;

  return (
    <div className="flex items-center justify-around h-16 bg-white border-t border-gray-200 px-2 sticky bottom-0 z-50 pb-safe">
      <button onClick={() => onTabChange('recommend')} className={getTabClass('recommend')}>
        <Home size={24} />
        <span className="text-[10px] font-medium">推荐</span>
      </button>
      <button onClick={() => onTabChange('discover')} className={getTabClass('discover')}>
        <Compass size={24} />
        <span className="text-[10px] font-medium">发现</span>
      </button>
      <button onClick={() => onTabChange('message')} className={getTabClass('message')}>
        <MessageSquare size={24} />
        <span className="text-[10px] font-medium">消息</span>
      </button>
      <button onClick={() => onTabChange('mine')} className={getTabClass('mine')}>
        <User size={24} />
        <span className="text-[10px] font-medium">我的</span>
      </button>
    </div>
  );
};