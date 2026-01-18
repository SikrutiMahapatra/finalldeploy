
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useAuth } from '../context/AuthContext.tsx';
import { DUMMY_ASSETS } from '../constants.tsx';
import { Send, Loader2, Sparkles, Globe, ExternalLink, RefreshCw, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "Predict yield for Emerald Meadows",
  "Summarize BLR real estate trends",
  "Assess risk for Heritage Acres",
  "Compare listed property returns",
  "Investment strategy for ₹10L budget"
];

const PropAI: React.FC = () => {
  const { user, wallet } = useAuth();
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; sources?: any[] }[]>([
    { 
      role: 'model', 
      text: `Institutional synchronization complete. Welcome back, ${user?.name}. I am the PropToken Neural Analyst. I have indexed ${DUMMY_ASSETS.length} primary assets and your portfolio holdings. How can I optimize your strategy today?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (overrideInput?: string) => {
    const messageToSend = overrideInput || input.trim();
    if (!messageToSend || isTyping) return;

    setInput('');
    const newMessages = [...messages, { role: 'user' as const, text: messageToSend }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: newMessages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          tools: [{ googleSearch: {} }],
          systemInstruction: `
            You are "PropAI", the official institutional analyst for PropToken.
            Tone: Ultra-professional, objective, and analytical.
            Context: Use internal property data: ${JSON.stringify(DUMMY_ASSETS)}.
            Wallet context: ${JSON.stringify(wallet.tokensByAsset)}.
            Instructions:
            1. Use the Indian Rupee (₹) symbol.
            2. When using Google Search, cite sources with clear titles.
            3. Provide data-driven insights on real estate investment in India (Bangalore, Chennai, etc.).
            4. Keep responses concise but information-dense.
          `,
        },
      });

      let fullResponseText = '';
      let groundingSources: any[] = [];
      
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        const textPart = chunk.text;
        if (textPart) {
          fullResponseText += textPart;
          const metadata = chunk.candidates?.[0]?.groundingMetadata;
          if (metadata?.groundingChunks) {
            groundingSources = [...groundingSources, ...metadata.groundingChunks];
          }

          setMessages(prev => {
            const historyWithoutLast = prev.slice(0, -1);
            return [
              ...historyWithoutLast, 
              { role: 'model', text: fullResponseText, sources: groundingSources }
            ];
          });
        }
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Signal degradation detected. I am unable to connect to the neural clearinghouse at this moment. Please check your registry access." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-10rem)] flex flex-col gap-6 animate-fintech-fade pb-6 px-2">
      {/* Normalized Header Aligned Left */}
      <div className="flex items-center justify-between pt-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">PropAI Catalyst</h1>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Institutional Reasoning Core v3.1</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setMessages([{ role: 'model', text: 'Registry state reset. Analyst ready.' }])}
            className="p-3 bg-white dark:bg-obsidian-900 border border-slate-100 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-400 shadow-sm"
            title="Reset Context"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-obsidian-900 rounded-[32px] border border-slate-100 dark:border-white/10 overflow-hidden flex flex-col shadow-xl relative">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] space-y-2 ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                {m.role === 'model' && (
                  <div className="flex items-center gap-2 px-3">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-neon-emerald" />
                    <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Neural Analyst</span>
                  </div>
                )}
                <div className={`p-6 rounded-2xl text-xs font-bold leading-relaxed ${
                  m.role === 'user' 
                  ? 'bg-fintech-purple-600 dark:bg-white text-white dark:text-obsidian-950 rounded-tr-none shadow-md' 
                  : 'bg-[#F8F8F8] dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-tl-none border border-[#EAEAEA] dark:border-white/5'
                }`}>
                  <div className="whitespace-pre-wrap">{m.text}</div>
                </div>
                
                {m.sources && m.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-1 pt-1">
                    {m.sources.map((source, idx) => source.web && (
                      <a 
                        key={idx}
                        href={source.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-full text-[8px] font-black uppercase tracking-tight text-slate-400 hover:text-fintech-purple-600 dark:hover:text-neon-emerald border border-transparent hover:border-fintech-purple-100 dark:hover:border-neon-emerald/20 transition-all"
                      >
                        <Globe className="w-2.5 h-2.5" />
                        {source.web.title?.slice(0, 20)}...
                        <ExternalLink className="w-2 h-2 opacity-30" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {messages.length === 1 && !isTyping && (
            <div className="pt-4 space-y-4">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                <MessageSquare className="w-3 h-3" /> Recommended Queries
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="p-4 bg-[#F8F8F8] dark:bg-white/5 border border-[#EAEAEA] dark:border-white/5 rounded-2xl text-left hover:border-fintech-purple-600 dark:hover:border-neon-emerald transition-all group"
                  >
                     <span className="text-slate-700 dark:text-slate-300 font-bold uppercase text-[9px] tracking-tight">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {isTyping && messages[messages.length - 1].role === 'user' && (
            <div className="flex justify-start">
              <div className="bg-[#F8F8F8] dark:bg-white/5 border border-[#EAEAEA] dark:border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                <Loader2 className="w-3 h-3 animate-spin text-fintech-purple-600 dark:text-neon-emerald" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Processing Analyst Signal...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-obsidian-950/50">
          <div className="flex gap-3 max-w-5xl mx-auto">
            <input 
              type="text" 
              placeholder="Query institutional data or market trends..."
              className="flex-1 bg-white dark:bg-obsidian-800 px-6 py-4 rounded-full font-bold outline-none border border-[#EAEAEA] dark:border-white/10 focus:ring-4 focus:ring-fintech-purple-600/5 dark:focus:ring-neon-emerald/5 transition-all text-xs"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={() => handleSend()}
              disabled={isTyping || !input.trim()}
              className="w-12 h-12 primary-gradient text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropAI;
