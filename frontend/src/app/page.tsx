'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  CheckSquare,
  FileText,
  Search,
  Sparkles,
  Users,
  MapPin,
  TrendingUp,
  Mic,
  Send,
  ChevronRight,
  Shield,
  Zap,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import SchemeCard from '@/components/SchemeCard';
import { listSchemes } from '@/lib/api';

const stats = [
  { value: '1000+', label: 'Government Schemes', labelHi: 'सरकारी योजनाएं', icon: '📋' },
  { value: '28', label: 'States Covered', labelHi: 'राज्य कवर', icon: '🗺️' },
  { value: '10M+', label: 'Citizens Helped', labelHi: 'नागरिक लाभान्वित', icon: '👥' },
  { value: 'AI', label: 'Powered Guidance', labelHi: 'AI गाइडेंस', icon: '🤖' },
];

const features = [
  {
    icon: Bot,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    title: 'AI Scheme Finder',
    titleHi: 'AI योजना खोजक',
    desc: 'Ask any question in Hindi or English. Our AI finds matching schemes instantly.',
    descHi: 'हिंदी या अंग्रेज़ी में कोई भी प्रश्न पूछें। हमारा AI तुरंत योजनाएं खोजता है।',
    href: '/chat',
  },
  {
    icon: CheckSquare,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    title: 'Eligibility Checker',
    titleHi: 'पात्रता जांचकर्ता',
    desc: 'Simple step-by-step form to check which schemes match your profile.',
    descHi: 'सरल चरण-दर-चरण फॉर्म से जांचें कि कौन सी योजनाएं आपके लिए हैं।',
    href: '/eligibility',
  },
  {
    icon: FileText,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    title: 'Document Guide',
    titleHi: 'दस्तावेज़ गाइड',
    desc: 'Know exactly which documents you need for each scheme.',
    descHi: 'जानें प्रत्येक योजना के लिए कौन से दस्तावेज़ चाहिए।',
    href: '/documents',
  },
  {
    icon: TrendingUp,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    title: 'Application Steps',
    titleHi: 'आवेदन प्रक्रिया',
    desc: 'Step-by-step guidance to apply for any government scheme.',
    descHi: 'किसी भी सरकारी योजना के लिए आवेदन करने की चरण-दर-चरण मार्गदर्शिका।',
    href: '/schemes',
  },
];

const suggestedQuestions = [
  'I am a farmer from Madhya Pradesh with income 2 lakh. Which schemes can I apply for?',
  'Scholarships for engineering students in Maharashtra',
  'Women entrepreneur loan schemes',
  'Health insurance for BPL families',
];

const suggestionsHi = [
  'मैं मध्य प्रदेश का किसान हूं, आय 2 लाख। कौन सी योजनाएं मिलेंगी?',
  'इंजीनियरिंग छात्रों के लिए छात्रवृत्ति',
  'महिला उद्यमियों के लिए लोन योजनाएं',
  'BPL परिवारों के लिए स्वास्थ्य बीमा',
];

export default function HomePage() {
  const { lang } = useTheme();
  const [query, setQuery] = useState('');
  const [listening, setListening] = useState(false);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load schemes from API on component mount
  useEffect(() => {
    const loadSchemes = async () => {
      setLoading(true);
      try {
        const data = await listSchemes();
        setSchemes(data);
      } catch (error) {
        console.error('Error loading schemes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSchemes();
  }, []);

  const hi = lang === 'hi';

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser.');
      return;
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = hi ? 'hi-IN' : 'en-IN';
    rec.onresult = (e: any) => {
      setQuery(e.results[0][0].transcript);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  };

  return (
    <div className="min-h-screen">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden gradient-bg dark:bg-gray-950 pt-16 pb-24 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-400/20 dark:bg-orange-900/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-green-400/20 dark:bg-green-900/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-orange-200 dark:border-orange-800 rounded-full px-4 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 mb-6 shadow-sm">
            <Sparkles size={14} />
            {hi ? 'AI-संचालित सरकारी योजना मार्गदर्शक' : 'AI-Powered Government Scheme Finder'}
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-4">
            {hi ? (
              <>
                <span className="text-gradient-india">सरकारी योजनाएं</span>
                <br />खोजें जिनके आप पात्र हैं
              </>
            ) : (
              <>
                Find Government Schemes{' '}
                <span className="text-gradient">You Are Eligible For</span>
              </>
            )}
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            {hi
              ? 'YojanaMitra AI हर भारतीय नागरिक को सेकंडों में लाभ, सब्सिडी, छात्रवृत्ति और वित्तीय योजनाएं खोजने में मदद करता है।'
              : 'YojanaMitra AI helps every Indian citizen discover benefits, subsidies, scholarships, and financial schemes in seconds.'}
          </p>

          {/* Chat Input */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-2 shadow-xl focus-within:border-orange-400 dark:focus-within:border-orange-500 transition-all duration-200">
              <Bot size={20} className="ml-2 text-orange-500 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={
                  hi
                    ? 'उदाहरण: मैं मध्य प्रदेश का किसान हूं, आय 2 लाख...'
                    : 'E.g.: I am a farmer from MP with income 2 lakh...'
                }
                className="flex-1 bg-transparent outline-none text-base text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 py-2"
              />
              <button
                onClick={handleVoice}
                title="Voice input"
                className={`p-2 rounded-xl transition-all ${listening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'hover:bg-orange-100 dark:hover:bg-gray-800 text-gray-500'
                  }`}
              >
                <Mic size={18} />
              </button>
              <Link
                href={`/chat?q=${encodeURIComponent(query)}`}
                className="btn-primary py-2 px-4 shrink-0"
              >
                <Send size={16} />
                {hi ? 'पूछें' : 'Ask'}
              </Link>
            </div>

            {/* Suggested questions */}
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {(hi ? suggestionsHi : suggestedQuestions).slice(0, 3).map((q, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(q)}
                  className="text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 rounded-full px-3 py-1.5 transition-all duration-200 truncate max-w-xs"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/chat" className="btn-primary text-base px-8 py-3.5">
              <Bot size={18} />
              {hi ? 'AI चैट शुरू करें' : 'Start AI Chat'}
              <ArrowRight size={16} />
            </Link>
            <Link href="/eligibility" className="btn-secondary text-base px-8 py-3.5">
              <CheckSquare size={18} />
              {hi ? 'पात्रता जांचें' : 'Check Eligibility'}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="bg-orange-500 py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label, labelHi, icon }) => (
            <div key={label} className="text-center">
              <div className="text-3xl mb-1">{icon}</div>
              <div className="text-3xl font-black text-white">{value}</div>
              <div className="text-sm font-medium text-orange-100 mt-0.5">
                {hi ? labelHi : label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">
              {hi ? 'हर किसी के लिए बना' : 'Built for Every Indian'}
            </h2>
            <p className="section-subtitle">
              {hi
                ? 'सरल, सुलभ और तेज़ - हर नागरिक के लिए'
                : 'Simple, accessible, and lightning-fast — for every citizen'}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, color, title, titleHi, desc, descHi, href }) => (
              <Link key={href} href={href} className="card-hover text-center p-6 group">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={26} />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{hi ? titleHi : title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{hi ? descHi : desc}</p>
                <div className="mt-4 flex items-center justify-center gap-1 text-orange-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {hi ? 'और जानें' : 'Learn more'} <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED SCHEMES ═══ */}
      <section className="py-16 px-4 bg-orange-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="section-title">{hi ? 'लोकप्रिय योजनाएं' : 'Popular Schemes'}</h2>
              <p className="section-subtitle">{hi ? 'सबसे ज्यादा खोजी गई सरकारी योजनाएं' : 'Most searched government schemes'}</p>
            </div>
            <Link href="/schemes" className="btn-secondary shrink-0">
              {hi ? 'सभी योजनाएं देखें' : 'View All Schemes'}
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.slice(0, 6).map((scheme: any) => (
              <SchemeCard key={scheme.id} scheme={scheme} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST SECTION ═══ */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title mb-4">{hi ? 'विश्वसनीय और सुरक्षित' : 'Trusted & Secure'}</h2>
          <p className="section-subtitle mb-10">
            {hi
              ? 'आपकी जानकारी सुरक्षित है। हम किसी भी व्यक्तिगत जानकारी को स्टोर नहीं करते।'
              : 'Your data stays private. We never store personal information. Always free to use.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: hi ? 'डेटा सुरक्षा' : 'Data Privacy', desc: hi ? 'कोई व्यक्तिगत डेटा स्टोर नहीं' : 'No personal data stored' },
              { icon: Zap, title: hi ? 'तेज़ परिणाम' : 'Instant Results', desc: hi ? 'सेकंडों में जवाब पाएं' : 'Get answers in seconds' },
              { icon: Users, title: hi ? 'सभी के लिए मुफ्त' : 'Free for All', desc: hi ? 'हमेशा मुफ्त उपयोग करें' : 'Always free to use' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={22} className="text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="hero-gradient py-16 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black mb-4">
            {hi ? 'आज ही अपनी पात्रता जांचें' : 'Check Your Eligibility Today'}
          </h2>
          <p className="text-orange-100 mb-8 text-lg">
            {hi
              ? '₹0 में जानें आप किन सरकारी योजनाओं के हकदार हैं'
              : 'Find out which government schemes you deserve — completely free'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/eligibility" className="bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors">
              {hi ? 'अभी शुरू करें' : 'Get Started Free'}
            </Link>
            <Link href="/schemes" className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
              {hi ? 'योजनाएं देखें' : 'Browse Schemes'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
