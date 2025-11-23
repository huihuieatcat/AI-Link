import React, { useState } from 'react';
import { Activity } from '../types';
import { Calendar, Users, MapPin, Coffee } from 'lucide-react';

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'Coffee Chat',
    title: 'AI for Science 方向 Coffee Chat',
    time: '今天 15:00-16:00',
    hostName: '张晨',
    hostRole: 'Investor',
    enrolledCount: 8,
    maxCount: 10,
    description: '想找 AI for Science 方向的同学聊模型泛化，欢迎相关背景的同学报名。'
  },
  {
    id: '2',
    type: '圆桌',
    title: 'SaaS 出海：从 0 到 1 的踩坑实录',
    time: '周六 14:00',
    hostName: 'TechHub',
    hostRole: 'Organizer',
    enrolledCount: 42,
    description: '邀请了三位成功出海的 Founder 分享实战经验。'
  }
];

export const TabDiscover: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'activity' | 'meetup'>('meetup');

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header & Tabs */}
      <div className="bg-white px-4 pt-10 pb-0 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold mb-4">发现</h1>
        <div className="flex gap-6 border-b border-gray-100">
          <button 
            onClick={() => setActiveSubTab('meetup')}
            className={`pb-3 font-medium transition-colors relative ${activeSubTab === 'meetup' ? 'text-gray-900' : 'text-gray-400'}`}
          >
            约见 Meetup
            {activeSubTab === 'meetup' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveSubTab('activity')}
            className={`pb-3 font-medium transition-colors relative ${activeSubTab === 'activity' ? 'text-gray-900' : 'text-gray-400'}`}
          >
            活动 Activity
            {activeSubTab === 'activity' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-24">
        {activeSubTab === 'meetup' && (
           <div className="space-y-4">
             {MOCK_ACTIVITIES.filter(a => a.type === 'Coffee Chat').map(act => (
               <div key={act.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                 <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{act.type}</span>
                    <span className="text-xs text-gray-400">{act.time}</span>
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">{act.title}</h3>
                 <p className="text-sm text-gray-600 mb-4 line-clamp-2">{act.description}</p>
                 
                 <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                   <div className="flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-600">
                       {act.hostName[0]}
                     </div>
                     <span className="text-xs text-gray-500">{act.hostName} · {act.hostRole}</span>
                   </div>
                   <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Users size={12} />
                      {act.enrolledCount} {act.maxCount ? `/ ${act.maxCount}` : '人已报名'}
                   </div>
                 </div>
                 <button className="w-full mt-3 bg-gray-900 text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-800">
                   一键报名
                 </button>
               </div>
             ))}
           </div>
        )}

        {activeSubTab === 'activity' && (
          <div className="space-y-4">
             {MOCK_ACTIVITIES.filter(a => a.type !== 'Coffee Chat').map(act => (
               <div key={act.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                 <div className="h-24 bg-gray-200 relative">
                    <img src={`https://picsum.photos/seed/${act.id}/400/200`} className="w-full h-full object-cover" alt="activity" />
                    <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-bold shadow-sm">
                      {act.type}
                    </div>
                 </div>
                 <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{act.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Calendar size={12} /> {act.time}
                      <MapPin size={12} /> 深圳·南山
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs text-orange-500 font-medium">🔥 {act.enrolledCount} 人感兴趣</span>
                       <button className="px-4 py-1.5 border border-blue-600 text-blue-600 rounded-full text-xs font-bold">
                         查看详情
                       </button>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};