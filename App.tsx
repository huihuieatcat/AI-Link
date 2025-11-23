import React, { useState } from 'react';
import { TabKey, UserProfile } from './types';
import { TabBar } from './components/TabBar';
import { TabRecommend } from './components/TabRecommend';
import { TabDiscover } from './components/TabDiscover';
import { TabMessage } from './components/TabMessage';
import { TabMine } from './components/TabMine';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabKey>('mine');
  // In a real app, this would come from local storage or backend
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const renderContent = () => {
    switch (currentTab) {
      case 'recommend':
        return <TabRecommend userProfile={userProfile} />;
      case 'discover':
        return <TabDiscover />;
      case 'message':
        return <TabMessage />;
      case 'mine':
        return <TabMine userProfile={userProfile} setUserProfile={setUserProfile} />;
      default:
        return <TabMine userProfile={userProfile} setUserProfile={setUserProfile} />;
    }
  };

  return (
    // Mobile container simulation
    <div className="max-w-md mx-auto h-[100dvh] bg-white shadow-2xl relative flex flex-col overflow-hidden text-slate-800 font-sans">
      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>
      <TabBar currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default App;