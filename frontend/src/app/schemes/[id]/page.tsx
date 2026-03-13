'use client';

import { useState, useEffect } from 'react';
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
import { useTheme } from '@/components/ThemeProvider';
import { getScheme } from '@/lib/api';

const DOCUMENTS: Record<string, string[]> = {
    'pm-kisan': ['Aadhaar Card', 'Land Record (Khatauni)', 'Bank Passbook', 'Mobile Number'],
    'nsp-merit': ['Aadhaar Card', '10th & 12th Marksheet', 'Income Certificate', 'Bank Passbook', 'College Admission Proof'],
    'pm-ujjwala': ['Aadhaar Card', 'BPL Ration Card', 'Bank Passbook', 'Passport Photo', 'Address Proof'],
    'startup-india-seed': ['PAN Card', 'DPIIT Recognition Certificate', 'Business Plan', 'Bank Account Details'],
    'ayushman-bharat': ['Aadhaar Card', 'SECC / Ration Card', 'Mobile Number', 'Family Photograph'],
    'pm-awas-gramin': ['Aadhaar Card', 'BPL Certificate', 'Bank Passbook', 'Land Record', 'SECC Database inclusion proof'],
    'mudra-yojana': ['Aadhaar Card', 'PAN Card', 'Business Proof / License', 'Bank Passbook', 'Passport Size Photo'],
    'beti-bachao-padao': ['Birth Certificate', 'Aadhaar Card of Parents', 'Bank Passbook'],
    'digital-india': ['Aadhaar Card', 'Mobile Number', 'Email ID'],
    'make-in-india': ['PAN Card', 'GST Registration', 'Business Plan', 'Bank Account Details'],
    'skill-india': ['Aadhaar Card', 'Educational Certificates', 'Bank Passbook'],
    'swachh-bharat': ['Aadhaar Card', 'Address Proof', 'Bank Account Details'],
};

const APP_STEPS: Record<string, string[]> = {
    'pm-kisan': [
        'Visit the official PM-KISAN portal',
        'Click on "New Farmer Registration"',
        'Enter your Aadhaar number and verify OTP',
        'Fill in your bank account details',
        'Upload land records and submit application',
        'Wait for verification and approval',
    ],
    'nsp-merit': [
        'Go to National Scholarship Portal',
        'Register with your email and mobile',
        'Select the scholarship scheme',
        'Fill the application form with details',
        'Upload required documents',
        'Submit and track application status',
    ],
    'pm-ujjwala': [
        'Visit nearest LPG distributor',
        'Fill the Ujjwala Yojana form',
        'Attach required documents',
        'Submit BPL certificate',
        'Get connection after verification',
    ],
    'startup-india-seed': [
        'Register on Startup India portal',
        'Get DPIIT recognition',
        'Apply for seed fund scheme',
        'Submit business plan and pitch deck',
        'Wait for evaluation and approval',
    ],
    'ayushman-bharat': [
        'Check eligibility on PM-JAY portal',
        'Visit nearest empaneled hospital',
        'Show Aadhaar card and ration card',
        'Get treatment cashless',
        'Hospital settles claim directly',
    ],
    'pm-awas-gramin': [
        'Apply through Gram Panchayat',
        'Submit income and land documents',
        'Get verification from officials',
        'Wait for approval and sanction',
        'Construct house as per guidelines',
    ],
    'mudra-yojana': [
        'Approach any bank branch',
        'Submit business plan',
        'Provide collateral if required',
        'Get loan approval',
        'Start or expand business',
    ],
    'beti-bachao-padao': [
        'Open Sukanya Samriddhi account',
        'Deposit minimum required amount',
        'Get tax benefits under 80C',
        'Withdraw after girl turns 21',
    ],
    'digital-india': [
        'Get Aadhaar card made',
        'Link mobile number with Aadhaar',
        'Create email ID',
        'Learn to use government apps',
        'Access digital services',
    ],
    'make-in-india': [
        'Register business',
        'Get necessary licenses',
        'Apply for government incentives',
        'Follow compliance requirements',
        'Scale up manufacturing',
    ],
    'skill-india': [
        'Visit nearest skill center',
        'Choose skill course',
        'Complete training program',
        'Get certification',
        'Apply for jobs or start business',
    ],
    'swachh-bharat': [
        'Apply for toilet construction',
        'Get approval from local body',
        'Construct toilet as per norms',
        'Get subsidy after verification',
    ],
    default: [
        'Check eligibility criteria',
        'Gather required documents',
        'Fill application form',
        'Submit with supporting documents',
        'Track application status',
        'Follow up if needed',
    ],
};

export default function SchemeDetailPage({ params }: { params: { id: string } }) {
    const { lang } = useTheme();
    const hi = lang === 'hi';
    const [scheme, setScheme] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Load scheme from API on component mount
    useEffect(() => {
        const loadScheme = async () => {
            setLoading(true);
            try {
                const data = await getScheme(params.id);
                setScheme(data);
            } catch (error) {
                console.error('Error loading scheme:', error);
                notFound();
            } finally {
                setLoading(false);
            }
        };
        loadScheme();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-orange-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading scheme details...</p>
                </div>
            </div>
        );
    }

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
                            {scheme.target_group?.toLowerCase().includes('farmer') ? '🌾' :
                                scheme.target_group?.toLowerCase().includes('student') ? '🎓' :
                                    scheme.target_group?.toLowerCase().includes('women') ? '👩' :
                                        scheme.target_group?.toLowerCase().includes('business') ? '🚀' :
                                            scheme.target_group?.toLowerCase().includes('health') ? '🏥' : '🏠'}
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-2">
                                <span className="badge badge-saffron capitalize">{scheme.target_group || 'General'}</span>
                                <span className="badge badge-green">{scheme.state_availability?.join(', ') || 'All India'}</span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-1">
                                {scheme.name}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{scheme.ministry}</p>
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
                        <p className="font-semibold text-green-800 dark:text-green-300">{scheme.benefits}</p>
                    </div>
                </div>

                {/* Eligibility */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-3">
                        <Users size={18} className="text-blue-500" />
                        <h2 className="font-bold text-gray-900 dark:text-white">{hi ? 'पात्रता' : 'Eligibility Criteria'}</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{scheme.target_group || 'General eligibility criteria'}</p>
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
