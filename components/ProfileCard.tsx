import React from 'react';
import { UserProfile, UserRole } from '../types';
import { Share2, MessageCircle, CheckCircle } from 'lucide-react';

interface ProfileCardProps {
  profile: UserProfile;
  compact?: boolean; // For list view
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, compact = false }) => {
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.FOUNDER: return 'bg-blue-100 text-blue-700';
      case UserRole.INVESTOR: return 'bg-purple-100 text-purple-700';
      case UserRole.EXPLORER: return 'bg-green-100 text-green-700';
    }
  };

  if (compact) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3">
        <div className="flex items-start gap-3">
          <img src={profile.avatarUrl} alt={profile.name} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 truncate">{profile.name}</h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getRoleColor(profile.role)}`}>
                {profile.role}
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate mb-2">{profile.tagline}</p>
            <div className="flex flex-wrap gap-1">
              {profile.tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="text-[10px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-blue-600">
             <MessageCircle size={20} />
          </button>
        </div>
      </div>
    );
  }

  // Full Card View (For "Mine" tab)
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative">
      <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      <div className="px-6 pb-6">
        <div className="flex justify-between items-end -mt-10 mb-4">
          <img 
            src={profile.avatarUrl} 
            alt={profile.name} 
            className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-gray-200 object-cover" 
          />
          <div className="flex gap-2 mb-1">
             <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md shadow-blue-200">
               交换名片
             </button>
             <button className="p-1.5 bg-gray-100 rounded-full text-gray-600">
               <Share2 size={16} />
             </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${getRoleColor(profile.role)}`}>
              {profile.role}
            </span>
            {profile.isVerified && <CheckCircle size={14} className="text-blue-500" />}
          </div>
          <p className="text-sm text-gray-600">{profile.tagline}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {profile.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-200 font-medium">
              #{tag}
            </span>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">我在做什么</h4>
            <p className="text-sm text-gray-800 leading-relaxed">{profile.description}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
             <h4 className="text-xs font-bold text-orange-400 uppercase mb-1">我需要什么</h4>
             <p className="text-sm text-gray-800 leading-relaxed">{profile.needs}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
             <h4 className="text-xs font-bold text-green-400 uppercase mb-1">我能提供什么</h4>
             <p className="text-sm text-gray-800 leading-relaxed">{profile.offers}</p>
          </div>
        </div>
      </div>
    </div>
  );
};