import React, { useState, useEffect, useRef } from 'react';
import { UserRole, UserProfile } from '../types';
import { geminiService } from '../services/geminiService';
import { Send, Loader2, Sparkles, ChevronRight, ArrowRight, Check } from 'lucide-react';

export type GeneratorMode = 'wizard' | 'chat';

interface ProfileGeneratorProps {
  mode: GeneratorMode;
  currentProfile?: UserProfile | null;
  onProfileGenerated: (profile: UserProfile) => void;
  onCancel: () => void;
}

// --- WIZARD CONFIGURATION ---
const WIZARD_QUESTIONS: Record<UserRole, string[]> = {
  [UserRole.FOUNDER]: [
    "你的项目叫什么？一句话介绍它。",
    "你的领域关键词是什么？（如：AI、SaaS、医疗）",
    "现在处于什么阶段？（如：Idea、MVP、已上线）",
    "你现在最需要什么？（如：找技术合伙人、融资）",
    "你能为别人提供什么？（如：技术、渠道、经验）"
  ],
  [UserRole.INVESTOR]: [
    "你的机构或名字是？",
    "你关注哪些赛道？（如：硬科技、出海）",
    "你的投资轮次和范围是多少？",
    "你正在寻找什么样的项目？",
    "你愿意提供哪些支持？（资金、导师、资源）"
  ],
  [UserRole.EXPLORER]: [
    "你的身份是什么？（如：学生、产品经理、媒体）",
    "你感兴趣的创业方向是什么？",
    "你希望在社区认识哪类人？",
    "你能提供什么技能或帮助？",
    "你现在的核心目标是什么？"
  ]
};

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const ProfileGenerator: React.FC<ProfileGeneratorProps> = ({ 
  mode, 
  currentProfile, 
  onProfileGenerated, 
  onCancel 
}) => {
  const [step, setStep] = useState<'role-select' | 'wizard-qa' | 'chat' | 'generating'>('role-select');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(currentProfile?.role || null);
  
  // Wizard State
  const [wizardStepIndex, setWizardStepIndex] = useState(0);
  const [wizardAnswers, setWizardAnswers] = useState<string[]>([]);
  const [wizardInput, setWizardInput] = useState('');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize
  useEffect(() => {
    if (mode === 'chat' && currentProfile) {
      setSelectedRole(currentProfile.role);
      setStep('chat');
      startChatSession(currentProfile.role, currentProfile);
    } else if (mode === 'wizard') {
      // For wizard, if role is not set, stay at role-select, else go to qa
      if (selectedRole) {
        setStep('wizard-qa');
      } else {
        setStep('role-select');
      }
    }
  }, [mode, currentProfile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- LOGIC: WIZARD ---

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('wizard-qa');
    setWizardStepIndex(0);
    setWizardAnswers([]);
  };

  const handleWizardNext = () => {
    if (!wizardInput.trim()) return;
    const newAnswers = [...wizardAnswers, wizardInput];
    setWizardAnswers(newAnswers);
    setWizardInput('');

    if (wizardStepIndex < 4) {
      setWizardStepIndex(prev => prev + 1);
    } else {
      // Finished
      finishWizard(selectedRole!, newAnswers);
    }
  };

  const finishWizard = async (role: UserRole, answers: string[]) => {
    setStep('generating');
    try {
      const profile = await geminiService.generateProfileFromWizard(role, answers);
      onProfileGenerated(profile);
    } catch (e) {
      console.error(e);
      setStep('wizard-qa'); // Fallback
      alert("生成失败，请重试");
    }
  };

  // --- LOGIC: CHAT (Refinement) ---

  const startChatSession = async (role: UserRole, profile?: UserProfile) => {
    setIsLoading(true);
    try {
      geminiService.startInterview(role, profile);
      const greeting = profile 
        ? `你好 ${profile.name}，我是 AI 助手。为了让你的档案更吸引人，我有几个进阶问题想问你。首先，关于 "${profile.description}"，能具体讲讲最近的一个亮点吗？` 
        : "你好，让我们开始完善你的档案。";
      
      // If we are starting fresh chat (not wizard), we can use gemini generated greeting, 
      // but here we simulate a smart start based on context
      const initialMsg = await geminiService.sendMessage(profile ? "Let's deepen the profile." : "Hi");
      setMessages([{ role: 'model', text: initialMsg }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || isLoading) return;
    const userMsg = chatInput.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsLoading(true);

    if (messages.length >= 7) {
       await finishChat(userMsg);
       return;
    }

    try {
      const reply = await geminiService.sendMessage(userMsg);
      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const finishChat = async (lastUserMessage: string) => {
    setStep('generating');
    const fullHistory = messages.map(m => `${m.role}: ${m.text}`).join('\n') + `\nuser: ${lastUserMessage}`;
    try {
      const profile = await geminiService.generateProfileFromHistory(fullHistory);
      onProfileGenerated(profile);
    } catch (e) {
      console.error(e);
      setStep('chat');
    }
  };

  // --- RENDERING ---

  // 1. Role Selection (Only for Wizard mode initial step)
  if (step === 'role-select') {
    return (
      <div className="flex flex-col h-full p-6 bg-white">
        <h2 className="text-2xl font-bold mb-2">欢迎来到 FounderLink</h2>
        <p className="text-gray-500 mb-8">第一步，请选择你的社区身份。</p>
        
        <div className="space-y-4">
          {[
            { role: UserRole.FOUNDER, title: '创业者 Founder', desc: '正在构建伟大产品的梦想家' },
            { role: UserRole.INVESTOR, title: '投资人 Investor', desc: '寻找下一个独角兽的伯乐' },
            { role: UserRole.EXPLORER, title: '探索者 Explorer', desc: '寻找机会与灵感的连接者' },
          ].map((item) => (
            <button
              key={item.role}
              onClick={() => handleRoleSelect(item.role)}
              className="w-full text-left p-5 border rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group relative overflow-hidden"
            >
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
              </div>
            </button>
          ))}
        </div>
        <button onClick={onCancel} className="mt-auto text-center text-gray-400 py-4">取消</button>
      </div>
    );
  }

  // 2. Generating State
  if (step === 'generating') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white p-6 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Sparkles className="text-blue-600 w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {mode === 'wizard' ? "正在为你生成名片..." : "正在优化你的档案..."}
        </h3>
        <p className="text-gray-500">AI 正在提炼你的核心亮点</p>
      </div>
    );
  }

  // 3. Wizard Question Mode
  if (step === 'wizard-qa' && selectedRole) {
    const questions = WIZARD_QUESTIONS[selectedRole];
    const currentQuestion = questions[wizardStepIndex];
    const progress = ((wizardStepIndex + 1) / questions.length) * 100;

    return (
      <div className="flex flex-col h-full bg-white">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-100">
          <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="flex-1 p-8 flex flex-col">
          <span className="text-blue-600 font-bold text-sm mb-4">问题 {wizardStepIndex + 1} / {questions.length}</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-tight">
            {currentQuestion}
          </h2>
          
          <textarea
            autoFocus
            value={wizardInput}
            onChange={(e) => setWizardInput(e.target.value)}
            placeholder="请输入..."
            className="w-full h-40 p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 resize-none text-lg text-gray-800 placeholder-gray-400"
          />

          <div className="mt-auto">
             <button
               onClick={handleWizardNext}
               disabled={!wizardInput.trim()}
               className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
             >
               {wizardStepIndex === questions.length - 1 ? '完成并生成' : '下一题'}
               {wizardStepIndex !== questions.length - 1 && <ArrowRight size={20} />}
               {wizardStepIndex === questions.length - 1 && <Check size={20} />}
             </button>
             {wizardStepIndex === 0 && (
                <button onClick={onCancel} className="w-full mt-4 text-gray-400 text-sm">取消</button>
             )}
          </div>
        </div>
      </div>
    );
  }

  // 4. Chat Mode (Improve Profile)
  if (step === 'chat') {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white px-4 py-3 border-b flex justify-between items-center sticky top-0 z-10">
          <span className="font-semibold text-gray-700 flex items-center gap-2">
            <Sparkles size={16} className="text-blue-500"/> AI 档案完善助手
          </span>
          <button 
            onClick={() => finishChat('')}
            className="text-sm text-blue-600 font-medium"
          >
            保存并退出
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white shadow-sm text-gray-800 rounded-bl-none border border-gray-100'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white shadow-sm rounded-2xl rounded-bl-none px-4 py-3 border border-gray-100">
                <Loader2 className="animate-spin text-gray-400 w-5 h-5" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white p-4 border-t pb-safe">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
              placeholder="输入你的回答..."
              className="flex-1 bg-gray-100 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button 
              onClick={handleChatSend}
              disabled={!chatInput.trim() || isLoading}
              className="p-3 bg-blue-600 rounded-full text-white disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};