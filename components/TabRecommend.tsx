import React from 'react';
import { UserProfile, UserRole } from '../types';
import { ProfileCard } from './ProfileCard';
import { Sparkles, ArrowRight, Calendar, MapPin } from 'lucide-react';

interface TabRecommendProps {
  userProfile: UserProfile | null;
}

const MOCK_RECOMMENDATIONS: UserProfile[] = [
  {
    name: 'Sarah Chen',
    role: UserRole.INVESTOR,
    tagline: '关注 AIGC 应用层的早期投资',
    tags: ['Seed', 'AIGC', 'ToC'],
    description: 'Looking for transformative AI apps.',
    needs: 'Good teams',
    offers: 'Capital, Mentorship'
  },
  {
    name: 'Mike Wang',
    role: UserRole.FOUNDER,
    tagline: '正在做医疗大模型垂直应用',
    tags: ['MedTech', 'LLM'],
    description: 'Building AI doctor.',
    needs: 'Co-founder',
    offers: 'Tech stack'
  }
];

const MOCK_RECOMMENDED_ACTIVITIES = [
  {
    id: 'rec_1',
    type: 'Coffee Chat',
    title: 'AI 落地场景探讨',
    time: '明天 10:00',
    location: '线上',
    host: '王大伟',
    role: 'Founder',
    description: '寻找技术合伙人，一起聊聊 LLM 在法律领域的应用。'
  },
  {
    id: 'rec_2',
    type: '分享会',
    title: '早期融资避坑指南',
    time: '周五 19:00',
    location: '深圳湾',
    host: '红杉资本',
    role: 'Investor',
    description: '闭门分享会，限额 20 人。'
  }
];

export const TabRecommend: React.FC<TabRecommendProps> = ({ userProfile }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            推荐 <Sparkles className="text-yellow-400 fill-current" size={20} />
          </h1>
          {!userProfile && (
            <span className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded">
              完善名片以获得精准推荐
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-24">
        
        {/* Section 1: People */}
        <div>
          <div className="flex justify-between items-center mb-3">
             <h2 className="font-bold text-gray-800">可能感兴趣的人</h2>
             <button className="text-xs text-gray-400 flex items-center">查看更多 <ArrowRight size={12}/></button>
          </div>
          <div className="space-y-3">
            {MOCK_RECOMMENDATIONS.map((profile, i) => (
              <ProfileCard key={i} profile={profile} compact />
            ))}
          </div>
        </div>

        {/* Section 2: Activities (New) */}
        <div>
           <div className="flex justify-between items-center mb-3">
             <h2 className="font-bold text-gray-800">推荐活动</h2>
             <button className="text-xs text-gray-400 flex items-center">查看更多 <ArrowRight size={12}/></button>
           </div>
           <div className="space-y-3">
              {MOCK_RECOMMENDED_ACTIVITIES.map((act) => (
                <div key={act.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden group">
                   <div className="flex justify-between items-start mb-2">
                      <div>
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-1 inline-block">{act.type}</span>
                          <h3 className="font-bold text-gray-900 text-sm leading-tight">{act.title}</h3>
                      </div>
                      <button className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-gray-700 transition-colors shadow-sm whitespace-nowrap">
                          报名
                      </button>
                   </div>
                   <p className="text-xs text-gray-500 mb-3 line-clamp-1">{act.description}</p>
                   <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-2">
                      <div className="flex items-center gap-2">
                         <span className="flex items-center gap-1"><Calendar size={10} /> {act.time}</span>
                         <span className="flex items-center gap-1"><MapPin size={10} /> {act.location}</span>
                      </div>
                      <span>{act.host} · {act.role}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Section 3: Tools/Resources */}
        <div>
           <h2 className="font-bold text-gray-800 mb-3">创业工具箱</h2>
           <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white shadow-md">
                 <div className="font-bold text-lg mb-1">BP 优化器</div>
                 <div className="text-xs text-blue-100 opacity-80">AI 辅助梳理逻辑</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white shadow-md">
                 <div className="font-bold text-lg mb-1">融资计算器</div>
                 <div className="text-xs text-purple-100 opacity-80">股权稀释模拟</div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
