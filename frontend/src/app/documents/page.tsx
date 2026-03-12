'use client';

import { FileText, AlertCircle, CheckCircle2, Info, Lightbulb } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const DOCUMENTS = [
    {
        emoji: '🪪',
        name: 'Aadhaar Card',
        nameHi: 'आधार कार्ड',
        purpose: 'Identity proof required for almost all government schemes',
        purposeHi: 'लगभग सभी सरकारी योजनाओं के लिए पहचान प्रमाण',
        tip: 'Link your Aadhaar with your bank account and mobile number for faster processing',
        tipHi: 'तेज़ प्रसंस्करण के लिए आधार को बैंक खाते और मोबाइल से जोड़ें',
    },
    {
        emoji: '🏦',
        name: 'Bank Passbook / Account',
        nameHi: 'बैंक पासबुक / खाता',
        purpose: 'Required for Direct Benefit Transfer (DBT) of scheme money',
        purposeHi: 'योजना की राशि के सीधे खाते में हस्तांतरण (DBT) के लिए आवश्यक',
        tip: 'Use a savings account, not a Jan Dhan account with zero-balance restriction',
        tipHi: 'जन धन खाते की बजाय बचत खाता उपयोग करें',
    },
    {
        emoji: '📊',
        name: 'Income Certificate',
        nameHi: 'आय प्रमाण पत्र',
        purpose: 'Proves annual family income for eligibility in BPL/EWS schemes',
        purposeHi: 'BPL/EWS योजनाओं के लिए पारिवारिक आय प्रमाणित करता है',
        tip: 'Get it from your Tehsildar or SDM office. Valid for typically 1-3 years',
        tipHi: 'तहसीलदार या SDM कार्यालय से प्राप्त करें। आमतौर पर 1-3 वर्ष तक वैध',
    },
    {
        emoji: '🌾',
        name: 'Land Record (Khatauni)',
        nameHi: 'भूमि अभिलेख (खतौनी)',
        purpose: 'Required for farmer schemes like PM-KISAN, KCC, Fasal Bima',
        purposeHi: 'PM-KISAN, KCC, फसल बीमा जैसी किसान योजनाओं के लिए आवश्यक',
        tip: 'Available at your local Patwari office or on state land record portals',
        tipHi: 'अपने स्थानीय पटवारी कार्यालय या राज्य भूमि अभिलेख पोर्टल पर उपलब्ध',
    },
    {
        emoji: '📋',
        name: 'Ration Card (BPL / APL)',
        nameHi: 'राशन कार्ड (BPL / APL)',
        purpose: 'Identifies BPL/APL status for housing, health, and nutrition schemes',
        purposeHi: 'आवास, स्वास्थ्य और पोषण योजनाओं के लिए BPL/APL स्थिति की पहचान',
        tip: 'Ensure all family members are listed in your ration card',
        tipHi: 'सुनिश्चित करें कि सभी परिवार के सदस्य राशन कार्ड में सूचीबद्ध हों',
    },
    {
        emoji: '🎓',
        name: 'Educational Certificates',
        nameHi: 'शैक्षिक प्रमाण पत्र',
        purpose: 'Required for student scholarships and education-linked schemes',
        purposeHi: 'छात्रवृत्ति और शिक्षा-संबंधी योजनाओं के लिए आवश्यक',
        tip: 'Keep both original and certified photocopies of all marksheets',
        tipHi: 'सभी अंकसूचियों की मूल और प्रमाणित फोटोकॉपी रखें',
    },
    {
        emoji: '📸',
        name: 'Passport Size Photo',
        nameHi: 'पासपोर्ट साइज फोटो',
        purpose: 'Required for most application forms and identity verification',
        purposeHi: 'अधिकांश आवेदन पत्रों और पहचान सत्यापन के लिए आवश्यक',
        tip: 'Keep 10-15 recent photos available at home for multiple applications',
        tipHi: 'कई आवेदनों के लिए घर में 10-15 हालिया फोटो रखें',
    },
    {
        emoji: '📱',
        name: 'Mobile Number (Aadhaar-linked)',
        nameHi: 'आधार से जुड़ा मोबाइल नंबर',
        purpose: 'OTP verification and SMS updates on scheme application status',
        purposeHi: 'OTP सत्यापन और योजना आवेदन की SMS अपडेट के लिए',
        tip: 'Always link an active mobile number with your Aadhaar for seamless verification',
        tipHi: 'निर्बाध सत्यापन के लिए हमेशा एक सक्रिय मोबाइल नंबर आधार से जोड़ें',
    },
];

const TIPS = [
    {
        icon: CheckCircle2,
        color: 'text-green-500',
        bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        tip: 'Always make 2-3 photocopies of each document before submitting',
        tipHi: 'जमा करने से पहले हर दस्तावेज़ की 2-3 फोटोकॉपी बना लें',
    },
    {
        icon: AlertCircle,
        color: 'text-orange-500',
        bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
        tip: 'Self-attest photocopies with your signature and date',
        tipHi: 'फोटोकॉपी पर अपने हस्ताक्षर और तारीख से स्व-सत्यापन करें',
    },
    {
        icon: Info,
        color: 'text-blue-500',
        bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        tip: 'Keep a digital copy of all documents in Google Drive or DigiLocker for easy access',
        tipHi: 'आसान पहुँच के लिए सभी दस्तावेज़ों की डिजिटल कॉपी DigiLocker में रखें',
    },
    {
        icon: Lightbulb,
        color: 'text-yellow-500',
        bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
        tip: 'Visit the Common Service Centre (CSC) in your village for free document assistance',
        tipHi: 'मुफ्त दस्तावेज़ सहायता के लिए अपने गाँव के CSC केंद्र पर जाएं',
    },
];

export default function DocumentsPage() {
    const { lang } = useTheme();
    const hi = lang === 'hi';

    return (
        <div className="min-h-screen bg-orange-50 dark:bg-gray-950">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                            <FileText size={24} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                                {hi ? '📄 दस्तावेज़ गाइड' : '📄 Document Guide'}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {hi ? 'सरकारी योजनाओं के लिए ज़रूरी दस्तावेज़' : 'Essential documents for government scheme applications'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
                {/* Documents Grid */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        {hi ? 'आवश्यक दस्तावेज़' : 'Required Documents'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {DOCUMENTS.map((doc, i) => (
                            <div key={i} className="card-hover flex gap-4 p-5">
                                <div className="text-4xl shrink-0">{doc.emoji}</div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                        {hi ? doc.nameHi : doc.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                                        {hi ? doc.purposeHi : doc.purpose}
                                    </p>
                                    <div className="flex items-start gap-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-2.5">
                                        <Lightbulb size={13} className="text-orange-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-orange-700 dark:text-orange-300 leading-relaxed">
                                            {hi ? doc.tipHi : doc.tip}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tips */}
                <section>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        {hi ? '💡 महत्वपूर्ण सुझाव' : '💡 Important Tips'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {TIPS.map(({ icon: Icon, color, bg, tip, tipHi }, i) => (
                            <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${bg}`}>
                                <Icon size={20} className={`${color} shrink-0 mt-0.5`} />
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {hi ? tipHi : tip}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* DigiLocker info */}
                <section className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-4">
                        <div className="text-4xl">🔐</div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                {hi ? 'DigiLocker – डिजिटल दस्तावेज़ बटुआ' : 'DigiLocker – Your Digital Document Wallet'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                                {hi
                                    ? 'DigiLocker पर अपने आधार, पैन, डिग्री और अन्य दस्तावेज़ डिजिटल रूप से सुरक्षित रखें। कई सरकारी पोर्टल DigiLocker दस्तावेज़ सीधे स्वीकार करते हैं।'
                                    : 'Store your Aadhaar, PAN, degrees and other documents digitally on DigiLocker. Many government portals accept DigiLocker documents directly, saving you physical copies.'}
                            </p>
                            <a
                                href="https://digilocker.gov.in"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary text-sm py-2 px-4 inline-flex"
                            >
                                {hi ? 'DigiLocker खोलें' : 'Open DigiLocker'}
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
