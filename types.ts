export enum UserRole {
  FOUNDER = 'Founder',
  INVESTOR = 'Investor',
  EXPLORER = 'Explorer',
}

export interface UserProfile {
  name: string;
  role: UserRole;
  tagline: string; // One sentence intro
  tags: string[]; // e.g., AI, Seed Round, ToB
  description: string; // "What I am doing"
  needs: string; // "What I need"
  offers: string; // "What I can offer"
  avatarUrl?: string;
  isVerified?: boolean;
}

export interface Activity {
  id: string;
  type: 'Coffee Chat' | '圆桌' | '分享会';
  title: string;
  time: string;
  hostName: string;
  hostRole: string;
  enrolledCount: number;
  maxCount?: number;
  description: string;
}

export interface Message {
  id: string;
  senderName: string;
  avatarUrl: string;
  lastMessage: string;
  time: string;
  unread: number;
}

export type TabKey = 'recommend' | 'discover' | 'message' | 'mine';