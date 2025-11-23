import { GoogleGenAI, Type, Chat } from "@google/genai";
import { UserRole, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for the interviewer persona
const getSystemInstruction = (role: UserRole, currentProfile?: UserProfile) => {
  let context = "";
  if (currentProfile) {
    context = `
    The user already has a basic profile:
    Name: ${currentProfile.name}
    Tagline: ${currentProfile.tagline}
    Needs: ${currentProfile.needs}
    Offers: ${currentProfile.offers}
    
    Your goal is to DEEPEN this profile. Do not ask for basic info again.
    Ask about their specific challenges, recent achievements, or specific resource details to make the profile more attractive for matching.
    `;
  }

  return `You are an expert startup community manager for "FounderLink". 
  You are interviewing a user who wants to join as a "${role}". 
  ${context}
  Your goal is to ask 3-4 short, specific, and high-quality questions to understand their professional profile.
  Do not ask all questions at once. Ask one by one.
  Keep a friendly, professional, and concise tone.
  
  For Founder, ask about: Project one-liner, Field keywords, Current stage, What they need, What they offer.
  For Investor, ask about: Tracks/Sectors, Investment stage/range, What projects they look for, What support they offer.
  For Explorer, ask about: Identity (Student/Media/etc), Who they want to meet, What they offer (skills/volunteering), Interest direction.
  `;
};

export class GeminiService {
  private chat: Chat | null = null;
  private role: UserRole | null = null;

  startInterview(role: UserRole, currentProfile?: UserProfile) {
    this.role = role;
    this.chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: getSystemInstruction(role, currentProfile),
      },
    });
    return this.chat;
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.chat) throw new Error("Chat not initialized");
    const response = await this.chat.sendMessage({ message });
    return response.text || "抱歉，我没有听清，请再说一遍。";
  }

  /**
   * Generates a profile from the Chat History (Deep Mode)
   */
  async generateProfileFromHistory(historyText: string): Promise<UserProfile> {
    if (!this.role) throw new Error("Role not set");

    const prompt = `Based on the following interview transcript, generate a structured User Profile JSON.
    The user's role is ${this.role}.
    
    Transcript:
    ${historyText}
    
    If specific information is missing, infer a reasonable short placeholder or leave it generic based on context.
    The 'tags' should be short keywords (max 4).
    'tagline' should be a catchy one-liner.
    `;

    return this.callGenAI(prompt);
  }

  /**
   * Generates a profile from the 5-Question Wizard (Fast Mode)
   */
  async generateProfileFromWizard(role: UserRole, answers: string[]): Promise<UserProfile> {
    this.role = role;
    const prompt = `Generate a User Profile JSON for a "${role}" based on these 5 answers:
    1. ${answers[0]}
    2. ${answers[1]}
    3. ${answers[2]}
    4. ${answers[3]}
    5. ${answers[4]}
    
    Map these answers to: name/project, tags, description (stage/identity), needs, offers.
    Create a catchy 'tagline'.
    `;
    
    return this.callGenAI(prompt);
  }

  private async callGenAI(prompt: string): Promise<UserProfile> {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Infer a name or use 'Anonymous Founder' if not provided" },
            role: { type: Type.STRING, enum: [UserRole.FOUNDER, UserRole.INVESTOR, UserRole.EXPLORER] },
            tagline: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING, description: "Summary of what they are doing" },
            needs: { type: Type.STRING, description: "What they need" },
            offers: { type: Type.STRING, description: "What they offer" },
          },
          required: ["name", "role", "tagline", "tags", "description", "needs", "offers"],
        }
      }
    });

    const jsonText = response.text || "{}";
    try {
      const data = JSON.parse(jsonText);
      return {
        ...data,
        role: this.role, 
        avatarUrl: `https://picsum.photos/seed/${Math.random()}/200/200`,
        isVerified: false
      };
    } catch (e) {
      console.error("Failed to parse profile JSON", e);
      throw new Error("Profile generation failed");
    }
  }
}

export const geminiService = new GeminiService();