import React from 'react';
import { Message } from '../types';

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    senderName: 'FounderLink 助手',
    avatarUrl: 'https://ui-avatars.com/api/?name=FL&background=0D8ABC&color=fff',
    lastMessage: '欢迎加入！完善名片后可解锁更多功能。',
    time: '刚刚',
    unread: 1
  },
  {
    id: '2',
    senderName: '李想 · Investor',
    avatarUrl: 'https://picsum.photos/seed/investor/200/200',
    lastMessage: '我对你的项目很感兴趣，约个时间聊聊？',
    time: '14:30',
    unread: 0
  }
];

export const TabMessage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 pt-10 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h1 className="text-2xl font-bold">消息</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
         {MOCK_MESSAGES.map(msg => (
           <div key={msg.id} className="flex items-center gap-3 p-4 border-b border-gray-50 active:bg-gray-50 transition">
             <div className="relative">
               <img src={msg.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
               {msg.unread > 0 && (
                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
               )}
             </div>
             <div className="flex-1 min-w-0">
               <div className="flex justify-between items-baseline mb-1">
                 <h3 className="font-bold text-gray-900 truncate">{msg.senderName}</h3>
                 <span className="text-xs text-gray-400">{msg.time}</span>
               </div>
               <p className={`text-sm truncate ${msg.unread > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                 {msg.lastMessage}
               </p>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
};