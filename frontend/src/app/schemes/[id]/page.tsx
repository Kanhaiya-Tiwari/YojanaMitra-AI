'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    CheckCircle2,
    FileText,
    IndianRupee,
    Users,
    ExternalLink,
    BookOpen,
    ClipboardList,
    Star,
    Share2,
} from 'lucide-react';
import { SCHEMES } from '@/lib/schemes-data';
import { useTheme } from '@/components/ThemeProvider';

const DOCUMENTS: Record<string, string[]> = {
    'pm-kisan': ['Aadhaar Card', 'Land Record (Khatauni)', 'Bank Passbook', 'Mobile Number'],
    'nsp-merit': ['Aadhaar Card', '10th & 12th Marksheet', 'Income Certificate', 'Bank Passbook', 'College Admission Proof'],
    'pm-ujjwala': ['Aadhaar Card', 'BPL Ration Card', 'Bank Passbook', 'Passport Photo', 'Address Proof'],
    'startup-india-seed': ['PAN Card', 'DPIIT Recognition Certificate', 'Business Plan', 'Bank Account Details'],
    'ayushman-bharat': ['Aadhaar Card', 'SECC / Ration Card', 'Mobile Number', 'Family Photograph'],
    'pm-awas-gramin': ['Aadhaar Card', 'BPL Certificate', 'Bank Passbook', 'Land Record', 'SECC Database inclusion proof'],
    'mudra-yojana': ['Aadhaar Card', 'PAN Card', 'Business Proof / License', 'Bank Passbook', 'Passport Size Photo'],
    'beti-bachao-padao': ['Birth Certificate', 'Aadhaar Card of Parents', 'Bank Passbook'],
    'kcc': ['Aadhaar Card', 'Land Record', 'Bank Passbook', 'Passport Photo', 'Khasra / Khatauni'],
    'iay-housing': ['Aadhaar Card', 'Income Certificate', 'Bank Passbook', 'Property Documents', 'Caste Certificate (if applicable)'],
};

const APP_STEPS: Record<string, string[]> = {
    'pm-kisan': [
        'Visit pmkisan.gov.in or nearest Common Service Centre (CSC)',
        'Click on "Farmers Corner" → "New Farmer Registration"',
        'Enter Aadhaar number and state',
        'Fill in personal and land details',
        'Upload required documents',
        'Submit and note your application number',
    ],
    default: [
        'Gather all required documents listed above',
        'Visit the official government portal or nearest CSC',
        'Fill in the application form with accurate details',
        'Upload scanned copies of documents',
        'Submit the application and save acknowledgement number',
        'Track your application status on the portal',
    ],
};

export default function SchemeDetailPage({ params }: { params: { id: string } }) {
    const { lang } = useTheme();
    const hi = lang === 'hi';
    const scheme = SCHEMES.find(s => s.id === params.id);
    if (!scheme) notFound();

    const docs = DOCUMENTS[scheme.id] ?? DOCUMENTS['pm-kisan'];
    const steps = APP_STEPS[scheme.id] ?? APP_STEPS.default;

    return (
        <div className="min-h-screen bg-orange-50 dark:bg-gray-950 pb-16">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <Link
                        href="/schemes"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        {hi ? 'सभी योजनाएं' : 'All Schemes'}
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-3xl shrink-0">
                            {scheme.category === 'farmer' ? '🌾' :
                                scheme.category === 'student' ? '🎓' :
                                    scheme.category === 'women' ? '👩' :
                                        scheme.category === 'startup' ? '🚀' :
                                            scheme.category === 'health' ? '🏥' : '🏠'}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-2">
                                <span className="badge badge-saffron capitalize">{scheme.category}</span>
                                <span className="badge badge-green">{scheme.state}</span>
                                {scheme.matchScore && (
                                    <span className="badge bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                                        ✅ {scheme.matchScore}% Match
                                    </span>
                                )}
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-1">
                                {scheme.name}
                            </h1>
                            {scheme.nameHi && (
                                <p className="text-base text-gray-500 dark:text-gray-400">{scheme.nameHi}</p>
                            )}
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{scheme.ministry}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="btn-ghost">
                                <Share2 size={16} />
                            </button>
                            <button className="btn-ghost">
                                <Star size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {/* Description */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-3">
                        <BookOpen size={18} className="text-orange-500" />
                        <h2 className="font-bold text-gray-900 dark:text-white">{hi ? 'योजना विवरण' : 'About This Scheme'}</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{scheme.description}</p>
                </div>

                {/* Benefits */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-3">
                        <IndianRupee size={18} className="text-green-500" />
                        <h2 className="font-bold text-gray-900 dark:text-white">{hi ? 'लाभ' : 'Benefits'}</h2>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
                        <p className="font-semibold text-green-800 dark:text-green-300">{scheme.benefit}</p>
                    </div>
                </div>

                {/* Eligibility */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-3">
                        <Users size={18} className="text-blue-500" />
                        <h2 className="font-bold text-gray-900 dark:text-white">{hi ? 'पात्रता' : 'Eligibility Criteria'}</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{scheme.eligibility}</p>
                </div>

                {/* Documents */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText size={18} className="text-purple-500" />
                        <h2 className="font-bold text-gray-900 dark:text-white">{hi ? 'आवश्यक दस्तावेज़' : 'Required Documents'}</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {docs.map((doc, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{doc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Application steps */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-4">
                        <ClipboardList size={18} className="text-orange-500" />
                        <h2 className="font-bold text-gray-900 dark:text-white">{hi ? 'आवेदन प्रक्रिया' : 'How to Apply'}</h2>
                    </div>
                    <div className="space-y-3">
                        {steps.map((step, i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold text-sm flex items-center justify-center shrink-0">
                                    {i + 1}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pt-0.5">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Apply CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <a
                        href="https://services.india.gov.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex-1 justify-center text-base py-3.5"
                    >
                        <ExternalLink size={18} />
                        {hi ? 'आधिकारिक पोर्टल पर आवेदन करें' : 'Apply on Official Portal'}
                    </a>
                    <Link href="/chat" className="btn-secondary flex-1 justify-center text-base py-3.5">
                        <BookOpen size={18} />
                        {hi ? 'AI से सहायता लें' : 'Get AI Guidance'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
