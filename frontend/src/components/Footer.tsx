'use client';

import Link from 'next/link';
import { Bot, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

const links = {
    platform: [
        { href: '/schemes', label: 'Browse Schemes' },
        { href: '/chat', label: 'AI Chatbot' },
        { href: '/eligibility', label: 'Check Eligibility' },
        { href: '/documents', label: 'Document Guide' },
    ],
    categories: [
        { href: '/schemes?category=farmer', label: '🌾 Farmer Schemes' },
        { href: '/schemes?category=student', label: '🎓 Student Scholarships' },
        { href: '/schemes?category=women', label: '👩 Women Empowerment' },
        { href: '/schemes?category=startup', label: '🚀 Startup & Business' },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="tricolor-bar" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-2.5 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                <span className="text-white font-black text-base">YM</span>
                            </div>
                            <div>
                                <div className="text-white font-bold text-lg leading-none">YojanaMitra</div>
                                <div className="text-orange-400 text-xs font-semibold">AI Powered</div>
                            </div>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            Empowering every Indian citizen to discover government schemes they deserve — powered by AI.
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="text-orange-500">🇮🇳</span>
                            Made with pride for India
                        </div>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm">Platform</h4>
                        <ul className="space-y-2.5">
                            {links.platform.map(({ href, label }) => (
                                <li key={href}>
                                    <Link href={href} className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm">Scheme Categories</h4>
                        <ul className="space-y-2.5">
                            {links.categories.map(({ href, label }) => (
                                <li key={href}>
                                    <Link href={href} className="text-sm text-gray-400 hover:text-orange-400 transition-colors duration-200">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm">Contact & Support</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2.5 text-sm text-gray-400">
                                <Mail size={14} className="text-orange-400 shrink-0" />
                                support@yojanamitra.ai
                            </li>
                            <li className="flex items-center gap-2.5 text-sm text-gray-400">
                                <Phone size={14} className="text-orange-400 shrink-0" />
                                1800-YM-HELP (toll free)
                            </li>
                            <li className="flex items-start gap-2.5 text-sm text-gray-400">
                                <MapPin size={14} className="text-orange-400 shrink-0 mt-0.5" />
                                New Delhi, India
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500 text-center sm:text-left">
                        © 2024 YojanaMitra AI. Built to serve 1.4 billion Indians. Not an official government website.
                    </p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-orange-400 transition-colors duration-200"
                    >
                        <ArrowUp size={14} />
                        Back to top
                    </button>
                </div>
            </div>
        </footer>
    );
}
