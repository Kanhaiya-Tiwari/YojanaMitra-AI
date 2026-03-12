'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    Menu,
    X,
    Sun,
    Moon,
    Globe,
    Bot,
    Search,
    CheckSquare,
    FileText,
    LayoutDashboard,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import clsx from 'clsx';

const navItems = [
    { href: '/chat', labelEn: 'AI Chat', labelHi: 'AI चैट', icon: Bot },
    { href: '/schemes', labelEn: 'Browse Schemes', labelHi: 'योजनाएँ', icon: Search },
    { href: '/eligibility', labelEn: 'Check Eligibility', labelHi: 'पात्रता जांचें', icon: CheckSquare },
    { href: '/documents', labelEn: 'Documents', labelHi: 'दस्तावेज़', icon: FileText },
    { href: '/admin', labelEn: 'Admin', labelHi: 'एडमिन', icon: LayoutDashboard },
];

export default function Navbar() {
    const { theme, lang, toggleTheme, toggleLang } = useTheme();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-gray-800">
            <div className="tricolor-bar" />
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                            <span className="text-white font-black text-sm">YM</span>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-base font-bold text-orange-600 dark:text-orange-400">YojanaMitra</span>
                            <span className="ml-1 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full">AI</span>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map(({ href, labelEn, labelHi, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className={clsx(
                                    'flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200',
                                    pathname === href
                                        ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                )}
                            >
                                <Icon size={15} />
                                {lang === 'hi' ? labelHi : labelEn}
                            </Link>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleLang}
                            title="Toggle language"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-gray-800 transition-all duration-200"
                        >
                            <Globe size={14} />
                            {lang === 'en' ? 'हिंदी' : 'EN'}
                        </button>

                        <button
                            onClick={toggleTheme}
                            title="Toggle dark mode"
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                        >
                            {theme === 'dark' ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-gray-600" />}
                        </button>

                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                            onClick={() => setMobileOpen(o => !o)}
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 animate-fade-in">
                    <div className="px-4 py-3 space-y-1">
                        {navItems.map(({ href, labelEn, labelHi, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className={clsx(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                                    pathname === href
                                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                )}
                            >
                                <Icon size={18} />
                                {lang === 'hi' ? labelHi : labelEn}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
