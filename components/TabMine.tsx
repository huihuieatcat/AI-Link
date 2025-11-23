import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ProfileGenerator, GeneratorMode } from './ProfileGenerator';
import { ProfileCard } from './ProfileCard';
import { PlusCircle, Edit3, Sparkles } from 'lucide-react';

interface TabMineProps {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
}

export const TabMine: React.FC<TabMineProps> = ({ userProfile, setUserProfile }) => {
  const [generatorMode, setGeneratorMode] = useState<GeneratorMode | null>(null);

  if (generatorMode) {
    return (
      <div className="absolute inset-0 z-50 bg-white">
        <ProfileGenerator 
          mode={generatorMode}
          currentProfile={userProfile}
          onProfileGenerated={(profile) => {
            setUserProfile(profile);
            setGeneratorMode(null);
          }}
          onCancel={() => setGeneratorMode(null)}
        />
      </div>
    );
  }

  // State 1: No Profile (Entrance to Wizard)
  if (!userProfile) {
    return (
      <div className="flex flex-col h-full bg-white p-6">
         <h1 className="text-2xl font-bold mt-10 mb-2">名片中心</h1>
         <p className="text-gray-500 mb-12">创建你的数字身份，连接创业网络。</p>
         
         <div className="flex flex-col items-center justify-center flex-1 space-y-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
            <p className="text-center text-gray-400 text-sm max-w-xs">
              你还没有名片，无法参与约见和互动。
            </p>
            <button 
              onClick={() => setGeneratorMode('wizard')}
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-200 flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <PlusCircle size={20} />
              生成名片
            </button>
         </div>
      </div>
    );
  }

  // State 2: Has Profile (Entrance to AI Chat Refinement)
  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto no-scrollbar">
      <div className="p-4 pb-24">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">我的名片</h1>
          {/* Only show if verified or just as a general settings button? Kept simple for now */}
        </div>
        
        <ProfileCard profile={userProfile} />

        {/* Improvement Action */}
        <button 
           onClick={() => setGeneratorMode('chat')}
           className="w-full mt-4 bg-white border border-blue-200 text-blue-600 py-3 rounded-xl font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition"
        >
           <Sparkles size={18} />
           完善档案 (AI 助手)
        </button>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-white p-4 rounded-xl text-center shadow-sm">
            <div className="text-xl font-bold text-gray-900">12</div>
            <div className="text-xs text-gray-500">被查看</div>
          </div>
          <div className="bg-white p-4 rounded-xl text-center shadow-sm">
            <div className="text-xl font-bold text-gray-900">5</div>
            <div className="text-xs text-gray-500">已交换</div>
          </div>
          <div className="bg-white p-4 rounded-xl text-center shadow-sm">
            <div className="text-xl font-bold text-gray-900">2</div>
            <div className="text-xs text-gray-500">友链</div>
          </div>
        </div>

        {/* Settings List */}
        <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
           <div className="p-4 border-b border-gray-100 flex justify-between">
              <span>我参与的活动</span>
              <span className="text-gray-300">›</span>
           </div>
           <div className="p-4 border-b border-gray-100 flex justify-between">
              <span>我的约见</span>
              <span className="text-gray-300">›</span>
           </div>
           <div className="p-4 flex justify-between">
              <span>设置</span>
              <span className="text-gray-300">›</span>
           </div>
        </div>
      </div>
    </div>
  );
};