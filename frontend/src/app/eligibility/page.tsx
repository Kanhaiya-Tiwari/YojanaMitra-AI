'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    User,
    MapPin,
    Briefcase,
    IndianRupee,
    GraduationCap,
    Users,
    CheckSquare,
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import SchemeCard from '@/components/SchemeCard';
import { INDIAN_STATES } from '@/lib/schemes-data';
import { listSchemes } from '@/lib/api';

const STEPS = [
    { id: 'personal', icon: User, labelEn: 'Personal Info', labelHi: 'व्यक्तिगत जानकारी' },
    { id: 'location', icon: MapPin, labelEn: 'Location', labelHi: 'स्थान' },
    { id: 'occupation', icon: Briefcase, labelEn: 'Occupation', labelHi: 'पेशा' },
    { id: 'income', icon: IndianRupee, labelEn: 'Income', labelHi: 'आय' },
    { id: 'education', icon: GraduationCap, labelEn: 'Education', labelHi: 'शिक्षा' },
    { id: 'category', icon: Users, labelEn: 'Category', labelHi: 'वर्ग' },
];

interface FormData {
    age: string;
    gender: string;
    state: string;
    district: string;
    occupation: string;
    isFarmer: boolean;
    isStudent: boolean;
    isBusinessOwner: boolean;
    annualIncome: string;
    education: string;
    category: string;
    isRural: boolean;
    hasDisability: boolean;
}

const INITIAL: FormData = {
    age: '', gender: '', state: '', district: '', occupation: '', isFarmer: false,
    isStudent: false, isBusinessOwner: false, annualIncome: '', education: '',
    category: '', isRural: false, hasDisability: false,
};

export default function EligibilityPage() {
    const { lang } = useTheme();
    const hi = lang === 'hi';
    const [step, setStep] = useState(0);
    const [form, setForm] = useState<FormData>(INITIAL);
    const [results, setResults] = useState<any[]>([]);
    const [hasCalculated, setHasCalculated] = useState(false);

    const update = (field: keyof FormData, value: string | boolean) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

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

    const computeResults = () => {
        const income = parseFloat(form.annualIncome) || 0;
        return schemes.filter(s => {
            // Check if user matches the scheme's target group
            let matchesTargetGroup = false;
            const targetGroup = (s.target_group || '').toLowerCase();
            
            // Farmer matching
            if (form.isFarmer && (
                targetGroup.includes('farmer') || 
                targetGroup.includes('agricultural') ||
                targetGroup.includes('cultivator') ||
                targetGroup.includes('livestock') ||
                targetGroup.includes('horticulture') ||
                targetGroup.includes('dairy') ||
                targetGroup.includes('fishery')
            )) {
                matchesTargetGroup = true;
            }
            // Student matching
            else if (form.isStudent && (
                targetGroup.includes('student') || 
                targetGroup.includes('education') ||
                targetGroup.includes('college') ||
                targetGroup.includes('university') ||
                targetGroup.includes('scholarship')
            )) {
                matchesTargetGroup = true;
            }
            // Business owner matching
            else if (form.isBusinessOwner && (
                targetGroup.includes('business') || 
                targetGroup.includes('entrepreneur') ||
                targetGroup.includes('startup') ||
                targetGroup.includes('manufacturer') ||
                targetGroup.includes('trader')
            )) {
                matchesTargetGroup = true;
            }
            // Women matching
            else if (form.gender === 'female' && (
                targetGroup.includes('women') || 
                targetGroup.includes('girl') ||
                targetGroup.includes('female')
            )) {
                matchesTargetGroup = true;
            }
            // Health-related schemes (income-based)
            else if (targetGroup.includes('health') && income < 300000) {
                matchesTargetGroup = true;
            }
            // Housing-related schemes (income-based)
            else if (targetGroup.includes('housing') && income < 600000) {
                matchesTargetGroup = true;
            }
            // General schemes that apply to everyone
            else if (
                targetGroup.includes('all citizens') ||
                targetGroup.includes('general') ||
                targetGroup.includes('rural households') ||
                targetGroup.includes('urban citizens') ||
                targetGroup.includes('poor') ||
                targetGroup.includes('youth') ||
                targetGroup.includes('job seekers')
            ) {
                matchesTargetGroup = true;
            }
            
            // Check if scheme is available in user's state
            const matchesState = !s.state_availability || 
                                s.state_availability.length === 0 || 
                                s.state_availability.includes('All India') ||
                                s.state_availability.includes(form.state);
            
            return matchesTargetGroup && matchesState;
        });
    };

    const submit = () => {
        const calculatedResults = computeResults();
        setResults(calculatedResults);
        setHasCalculated(true);
    };

    if (hasCalculated) {
        return (
            <div className="min-h-screen bg-orange-50 dark:bg-gray-950 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8 animate-slide-up">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={40} className="text-green-500" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                            {hi ? '🎉 आपके लिए योग्य योजनाएं' : '🎉 Eligible Schemes for You'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {hi
                                ? `हमने आपकी प्रोफाइल के आधार पर ${results.length} योजनाएं खोजीं`
                                : `We found ${results.length} schemes matching your profile`}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {results.map(s => (
                            <SchemeCard key={s.id} scheme={s} lang={lang} />
                        ))}
                    </div>

                    <div className="text-center space-y-3">
                        <Link href="/chat" className="btn-primary text-base px-8 py-3.5">
                            {hi ? 'AI से और जानें' : 'Learn More with AI Chat'}
                            <ArrowRight size={16} />
                        </Link>
                        <div>
                            <button
                                onClick={() => { setResults([]); setHasCalculated(false); setStep(0); setForm(INITIAL); }}
                                className="text-sm text-gray-500 hover:text-orange-500 transition-colors mt-2"
                            >
                                {hi ? 'दोबारा जांचें' : 'Start Over'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-orange-50 dark:bg-gray-950 py-8 px-4">
            <div className="max-w-lg mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <CheckSquare size={28} className="text-orange-500" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                        {hi ? 'पात्रता जांचें' : 'Eligibility Checker'}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {hi ? 'चरण-दर-चरण जानकारी भरें' : 'Fill in step-by-step to discover your schemes'}
                    </p>
                </div>

                {/* Progress */}
                <div className="mb-6">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                        <span>{hi ? `चरण ${step + 1}/${STEPS.length}` : `Step ${step + 1} of ${STEPS.length}`}</span>
                        <span>{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill bg-gradient-to-r from-orange-500 to-green-500"
                            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-3">
                        {STEPS.map((s, i) => (
                            <div key={s.id} className={`flex flex-col items-center gap-1 ${i <= step ? 'text-orange-500' : 'text-gray-300 dark:text-gray-600'}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? 'bg-green-500 text-white' :
                                        i === step ? 'bg-orange-500 text-white shadow-glow' :
                                            'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                    }`}>
                                    {i < step ? '✓' : i + 1}
                                </div>
                                <span className="hidden sm:block text-xs">{hi ? s.labelHi : s.labelEn}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step forms */}
                <div className="card animate-slide-up">
                    {step === 0 && (
                        <div className="space-y-4">
                            <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                                👤 {hi ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    {hi ? 'आयु (वर्ष)' : 'Age (years)'}
                                </label>
                                <input type="number" min="1" max="120" value={form.age} onChange={e => update('age', e.target.value)}
                                    placeholder="e.g. 35" className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    {hi ? 'लिंग' : 'Gender'}
                                </label>
                                <select value={form.gender} onChange={e => update('gender', e.target.value)} className="select-field">
                                    <option value="">{hi ? 'चुनें' : 'Select'}</option>
                                    <option value="male">{hi ? 'पुरुष' : 'Male'}</option>
                                    <option value="female">{hi ? 'महिला' : 'Female'}</option>
                                    <option value="other">{hi ? 'अन्य' : 'Other'}</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-4">
                            <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                                📍 {hi ? 'स्थान' : 'Location'}
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    {hi ? 'राज्य' : 'State'}
                                </label>
                                <select value={form.state} onChange={e => update('state', e.target.value)} className="select-field">
                                    <option value="">{hi ? 'राज्य चुनें' : 'Select State'}</option>
                                    {INDIAN_STATES.filter((s: string) => s !== 'All States').map((s: string) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    {hi ? 'जिला' : 'District'}
                                </label>
                                <input type="text" value={form.district} onChange={e => update('district', e.target.value)}
                                    placeholder={hi ? 'जिले का नाम' : 'Enter district name'} className="input-field" />
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="rural" checked={form.isRural} onChange={e => update('isRural', e.target.checked)}
                                    className="w-4 h-4 rounded accent-orange-500" />
                                <label htmlFor="rural" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {hi ? 'ग्रामीण क्षेत्र में निवास करते हैं' : 'I live in a rural area'}
                                </label>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                                💼 {hi ? 'पेशा' : 'Occupation'}
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    {hi ? 'मुख्य पेशा' : 'Primary Occupation'}
                                </label>
                                <select value={form.occupation} onChange={e => update('occupation', e.target.value)} className="select-field">
                                    <option value="">{hi ? 'चुनें' : 'Select'}</option>
                                    <option value="farmer">{hi ? 'किसान' : 'Farmer'}</option>
                                    <option value="student">{hi ? 'छात्र' : 'Student'}</option>
                                    <option value="business">{hi ? 'व्यापारी' : 'Business Owner'}</option>
                                    <option value="job-seeker">{hi ? 'नौकरी खोज रहे हैं' : 'Job Seeker'}</option>
                                    <option value="government">{hi ? 'सरकारी कर्मचारी' : 'Government Employee'}</option>
                                    <option value="private">{hi ? 'निजी कर्मचारी' : 'Private Employee'}</option>
                                    <option value="self-employed">{hi ? 'स्वरोजगार' : 'Self-Employed'}</option>
                                    <option value="homemaker">{hi ? 'गृहिणी' : 'Homemaker'}</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                {[
                                    { key: 'isFarmer', en: 'I am a farmer', hi: 'मैं किसान हूं' },
                                    { key: 'isStudent', en: 'I am a student', hi: 'मैं छात्र हूं' },
                                    { key: 'isBusinessOwner', en: 'I own a business / startup', hi: 'मेरा व्यवसाय / स्टार्टअप है' },
                                ].map(({ key, en: enLabel, hi: hiLabel }) => (
                                    <div key={key} className="flex items-center gap-3">
                                        <input type="checkbox" id={key}
                                            checked={form[key as keyof FormData] as boolean}
                                            onChange={e => update(key as keyof FormData, e.target.checked)}
                                            className="w-4 h-4 rounded accent-orange-500"
                                        />
                                        <label htmlFor={key} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {hi ? hiLabel : enLabel}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                                ₹ {hi ? 'वार्षिक आय' : 'Annual Income'}
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    {hi ? 'पारिवारिक वार्षिक आय (रुपए में)' : 'Annual family income (in rupees)'}
                                </label>
                                <input type="number" min="0" value={form.annualIncome} onChange={e => update('annualIncome', e.target.value)}
                                    placeholder="e.g. 200000" className="input-field" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {['50000', '100000', '200000', '500000'].map(v => (
                                    <button key={v} onClick={() => update('annualIncome', v)}
                                        className={`p-2 text-sm rounded-xl border transition-all ${form.annualIncome === v
                                                ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-600'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                                            }`}>
                                        ₹{Number(v).toLocaleString('en-IN')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4">
                            <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                                🎓 {hi ? 'शिक्षा' : 'Education Level'}
                            </h2>
                            <select value={form.education} onChange={e => update('education', e.target.value)} className="select-field">
                                <option value="">{hi ? 'चुनें' : 'Select'}</option>
                                <option value="no-formal">{hi ? 'कोई औपचारिक शिक्षा नहीं' : 'No formal education'}</option>
                                <option value="primary">{hi ? 'प्राथमिक (1-5)' : 'Primary (1-5)'}</option>
                                <option value="middle">{hi ? 'माध्यमिक (6-8)' : 'Middle School (6-8)'}</option>
                                <option value="high-school">{hi ? 'हाई स्कूल (10वीं)' : 'High School (10th)'}</option>
                                <option value="12th">{hi ? '12वीं' : '12th / Intermediate'}</option>
                                <option value="graduate">{hi ? 'स्नातक' : 'Graduate'}</option>
                                <option value="post-graduate">{hi ? 'स्नातकोत्तर' : 'Post-Graduate'}</option>
                            </select>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-4">
                            <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                                👥 {hi ? 'सामाजिक वर्ग' : 'Social Category'}
                            </h2>
                            <select value={form.category} onChange={e => update('category', e.target.value)} className="select-field">
                                <option value="">{hi ? 'चुनें' : 'Select'}</option>
                                <option value="general">{hi ? 'सामान्य' : 'General'}</option>
                                <option value="obc">{hi ? 'OBC (अन्य पिछड़ा वर्ग)' : 'OBC (Other Backward Class)'}</option>
                                <option value="sc">{hi ? 'SC (अनुसूचित जाति)' : 'SC (Scheduled Caste)'}</option>
                                <option value="st">{hi ? 'ST (अनुसूचित जनजाति)' : 'ST (Scheduled Tribe)'}</option>
                                <option value="ews">{hi ? 'EWS (आर्थिक रूप से कमजोर)' : 'EWS (Economically Weaker Section)'}</option>
                                <option value="minority">{hi ? 'अल्पसंख्यक' : 'Minority'}</option>
                            </select>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="disability" checked={form.hasDisability}
                                    onChange={e => update('hasDisability', e.target.checked)}
                                    className="w-4 h-4 rounded accent-orange-500"
                                />
                                <label htmlFor="disability" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {hi ? 'दिव्यांगजन / विकलांगता श्रेणी' : 'Person with Disability'}
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex gap-3 mt-6">
                    {step > 0 && (
                        <button onClick={() => setStep(s => s - 1)} className="btn-secondary flex-1">
                            <ArrowLeft size={16} />
                            {hi ? 'पीछे' : 'Back'}
                        </button>
                    )}
                    {step < STEPS.length - 1 ? (
                        <button onClick={() => setStep(s => s + 1)} className="btn-primary flex-1">
                            {hi ? 'अगला चरण' : 'Next Step'}
                            <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button onClick={submit} className="btn-primary flex-1 text-base py-3.5">
                            <CheckSquare size={18} />
                            {hi ? 'योजनाएं खोजें' : 'Find My Schemes'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
