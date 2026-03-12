'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Bot, User, Copy, ThumbsUp, ThumbsDown, Sparkles, Search, Filter, Download, Share2, Star, TrendingUp, Award, Shield, Heart, Zap, Globe, BookOpen, Users, Target, Lightbulb, ChevronRight, Menu, X, Home, RotateCcw } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  schemes?: SchemeCard[];
  extractedProfile?: Record<string, any>;
}

interface SchemeCard {
  id: string;
  name: string;
  benefits?: string;
  application_link?: string;
  offline_office?: string;
  application_steps?: string[];
  required_documents?: string[];
  fraud_warnings?: string[];
}

const SUGGESTED_PROMPTS = [
  { en: 'Scholarships for engineering students', hi: 'इंजीनियरिंग छात्रों के लिए छात्रवृत्ति', icon: BookOpen },
  { en: 'Schemes for farmers in UP', hi: 'उत्तर प्रदेश के किसानों के लिए योजनाएं', icon: Target },
  { en: 'Startup loans for small businesses', hi: 'छोटे व्यवसाय के लिए स्टार्टअप लोन', icon: TrendingUp },
  { en: 'Health insurance for poor families', hi: 'गरीब परिवारों के लिए स्वास्थ्य बीमा', icon: Shield },
  { en: 'Housing schemes for rural areas', hi: 'ग्रामीण क्षेत्रों के लिए आवास योजनाएं', icon: Home },
  { en: 'Women empowerment schemes', hi: 'महिला सशक्तिकरण योजनाएं', icon: Award },
];

function SchemeCard({ scheme, lang }: { scheme: SchemeCard; lang: boolean }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mt-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{scheme.name}</h4>
          {scheme.benefits && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{scheme.benefits}</p>
          )}
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-orange-500 hover:text-orange-600 text-sm font-medium"
        >
          {showDetails ? (lang ? 'कम दिखाएं' : 'Show Less') : (lang ? 'और जानें' : 'Learn More')}
        </button>
      </div>

      {showDetails && (
        <div className="mt-4 space-y-3 border-t border-gray-100 dark:border-gray-700 pt-3">
          {scheme.application_steps && scheme.application_steps.length > 0 && (
            <div>
              <h5 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                {lang ? 'आवेदन के चरण:' : 'Application Steps:'}
              </h5>
              <ol className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {scheme.application_steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-500 font-medium">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {scheme.required_documents && scheme.required_documents.length > 0 && (
            <div>
              <h5 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                {lang ? 'आवश्यक दस्तावेज़:' : 'Required Documents:'}
              </h5>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {scheme.required_documents.map((doc, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {scheme.application_link && (
            <div>
              <h5 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                {lang ? 'ऑनलाइन आवेदन:' : 'Online Application:'}
              </h5>
              <a
                href={scheme.application_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-orange-500 hover:text-orange-600 underline"
              >
                {scheme.application_link}
              </a>
            </div>
          )}

          {scheme.offline_office && (
            <div>
              <h5 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                {lang ? 'ऑफलाइन कार्यालय:' : 'Offline Office:'}
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">{scheme.offline_office}</p>
            </div>
          )}

          {scheme.fraud_warnings && scheme.fraud_warnings.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
              <h5 className="font-medium text-sm text-red-900 dark:text-red-100 mb-2">
                {lang ? '⚠️ धोखाधड़ी चेतावनी:' : '⚠️ Fraud Warning:'}
              </h5>
              <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                {scheme.fraud_warnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shrink-0">
        <Bot size={16} className="text-white" />
      </div>
      <div className="chat-bubble-ai py-3 px-4">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="typing-dot w-2 h-2 bg-gray-400 rounded-full animate-typing"
              style={{ animationDelay: `${(i - 1) * 0.25}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatContent() {
  const { lang } = useTheme();
  const searchParams = useSearchParams();
  const hi = lang === 'hi';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: hi
        ? 'नमस्ते! मैं YojanaMitra AI हूं। आप मुझसे किसी भी सरकारी योजना के बारे में हिंदी या अंग्रेज़ी में पूछ सकते हैं।\n\nआप कौन से सरकारी लाभ के बारे में जानना चाहते हैं?'
        : 'Hello! I am YojanaMitra AI. Ask me about any government scheme in Hindi or English.\n\nWhich government benefits would you like to explore today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Pre-fill from query param
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setInput(q);
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          language: hi ? 'hi' : 'en',
          profile: null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply_text,
        timestamp: new Date(),
        schemes: data.eligible_schemes || [],
        extractedProfile: data.extracted_profile || {},
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: hi 
          ? 'क्षमा करें, मुझे आपके प्रश्न का उत्तर देने में समस्या हो रही है। कृपया बाद में फिर से प्रयास करें।'
          : 'Sorry, I\'m having trouble answering your question right now. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser. Please use Chrome.');
      return;
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = hi ? 'hi-IN' : 'en-IN';
    rec.onresult = (e: any) => {
      setInput(e.results[0][0].transcript);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  };

  const clearChat = () => {
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: hi ? 'चैट साफ़ हो गई! नया प्रश्न पूछें।' : 'Chat cleared! Ask a new question.',
        timestamp: new Date(),
      },
    ]);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900 dark:text-white">YojanaMitra AI</div>
            <div className="flex items-center gap-1.5 text-xs text-green-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {hi ? 'ऑनलाइन और उपलब्ध' : 'Online & Ready'}
            </div>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800"
        >
          <RotateCcw size={14} />
          {hi ? 'साफ़ करें' : 'Clear'}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6 space-y-6 bg-gray-50 dark:bg-gray-950">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-3 animate-slide-up`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-white" />
              </div>
            )}

            <div className="max-w-xs md:max-w-md lg:max-w-2xl">
              {msg.role === 'assistant' ? (
                <div className="chat-bubble-ai">
                  <div
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>'),
                    }}
                  />
                  
                  {/* Display extracted profile if available */}
                  {msg.extractedProfile && Object.keys(msg.extractedProfile).length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <h5 className="font-medium text-sm text-blue-900 dark:text-blue-100 mb-2">
                        {hi ? '📋 आपकी जानकारी:' : '📋 Your Profile:'}
                      </h5>
                      <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        {Object.entries(msg.extractedProfile).map(([key, value]) => {
                          if (!value) return null;
                          return (
                            <div key={key} className="flex items-start gap-2">
                              <span className="font-medium">{key}:</span>
                              <span>{String(value)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Display scheme cards */}
                  {msg.schemes && msg.schemes.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {msg.schemes.map((scheme, index) => (
                        <SchemeCard key={scheme.id || index} scheme={scheme} lang={hi} />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <button onClick={() => copyText(msg.content)} className="p-1 hover:text-orange-500 transition-colors" title="Copy">
                      <Copy size={13} />
                    </button>
                    <button className="p-1 hover:text-green-500 transition-colors" title="Good response">
                      <ThumbsUp size={13} />
                    </button>
                    <button className="p-1 hover:text-red-500 transition-colors" title="Bad response">
                      <ThumbsDown size={13} />
                    </button>
                    <span className="ml-auto text-xs text-gray-400">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="chat-bubble-user">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className="text-xs text-orange-200 mt-1 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <User size={16} className="text-gray-600 dark:text-gray-300" />
              </div>
            )}
          </div>
        ))}

        {loading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      {messages.length <= 1 && (
        <div className="px-4 py-3 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <Sparkles size={12} />
            {hi ? 'सुझाए गए प्रश्न:' : 'Suggested questions:'}
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {SUGGESTED_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => sendMessage(hi ? p.hi : p.en)}
                className="shrink-0 text-xs bg-orange-50 dark:bg-gray-800 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 rounded-full px-3 py-1.5 hover:bg-orange-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                {hi ? p.hi : p.en}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="px-4 py-3 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-end gap-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-2 focus-within:border-orange-400 dark:focus-within:border-orange-600 transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hi ? 'अपना प्रश्न यहां लिखें...' : 'Type your question here...'}
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 py-1.5 px-2 max-h-32 scrollbar-thin"
            style={{ height: 'auto' }}
            onInput={e => {
              const t = e.target as HTMLTextAreaElement;
              t.style.height = 'auto';
              t.style.height = Math.min(t.scrollHeight, 128) + 'px';
            }}
          />
          <button
            onClick={handleVoice}
            title="Voice input"
            className={`p-2 rounded-xl transition-all ${listening
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800'
              }`}
          >
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="btn-primary py-2 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          {hi ? 'हिंदी या अंग्रेज़ी में टाइप करें • Enter से भेजें' : 'Type in Hindi or English • Press Enter to send'}
        </p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Bot size={40} className="text-orange-500 animate-spin-slow" /></div>}>
      <ChatContent />
    </Suspense>
  );
}
