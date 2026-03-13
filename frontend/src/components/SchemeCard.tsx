'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, IndianRupee, Users, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

export interface Scheme {
    id: string;
    name: string;
    ministry?: string;
    description: string;
    target_group?: string;
    benefits?: string;
    income_limit?: number;
    age_min?: number;
    age_max?: number;
    state_availability?: string[];
    required_documents?: string[];
    application_link?: string;
    offline_office?: string;
    application_steps?: string[];
    last_date?: string;
    eligibility_rules?: any;
    fraud_warnings?: string[];
}

const categoryColors: Record<string, string> = {
    farmer: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    student: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    women: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
    startup: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    health: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    housing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
    general: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const categoryIcons: Record<string, string> = {
    farmer: '🌾',
    student: '🎓',
    women: '👩',
    startup: '🚀',
    health: '🏥',
    housing: '🏠',
    general: '📋',
};

interface SchemeCardProps {
    scheme: Scheme;
    lang?: 'en' | 'hi';
    compact?: boolean;
}

export default function SchemeCard({ scheme, lang = 'en', compact = false }: SchemeCardProps) {
    const getCategoryColor = () => {
        const target = scheme.target_group?.toLowerCase() || '';
        if (target.includes('farmer')) return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
        if (target.includes('student')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
        if (target.includes('women')) return 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300';
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    };

    const getCategoryIcon = () => {
        const target = scheme.target_group?.toLowerCase() || '';
        if (target.includes('farmer')) return '🌾';
        if (target.includes('student')) return '🎓';
        if (target.includes('women')) return '👩';
        return '📋';
    };

    return (
        <div className={clsx(
            'card-hover flex flex-col h-full group',
            compact ? 'p-4' : 'p-6'
        )}>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={clsx('badge text-xs font-semibold capitalize', getCategoryColor())}>
                            {getCategoryIcon()} {scheme.target_group || 'General'}
                        </span>
                    </div>
                    <h3 className={clsx(
                        'font-bold text-gray-900 dark:text-white leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors',
                        compact ? 'text-sm' : 'text-base'
                    )}>
                        {scheme.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{scheme.ministry}</p>
                </div>
                <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-lg">
                    {getCategoryIcon()}
                </div>
            </div>

            {/* Description */}
            {!compact && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed line-clamp-2">
                    {scheme.description}
                </p>
            )}

            {/* Benefit */}
            {scheme.benefits && (
                <div className="flex items-start gap-2 mb-3">
                    <IndianRupee size={14} className="text-green-500 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{scheme.benefits}</p>
                </div>
            )}

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between gap-3">
                <Link
                    href={`/schemes/${scheme.id}`}
                    className="btn-primary text-sm py-2 px-4 flex-1 justify-center"
                >
                    View Details
                    <ArrowRight size={14} />
                </Link>
                {scheme.application_link && (
                    <a 
                        href={scheme.application_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 transition-colors"
                    >
                        <ExternalLink size={13} />
                        Apply
                    </a>
                )}
            </div>
        </div>
    );
}
