'use client';

import { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    TrendingUp,
    Plus,
    Edit2,
    Trash2,
    Eye,
    Search,
    BarChart2,
    Activity,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';
import { SCHEMES } from '@/lib/schemes-data';

const STATS = [
    { label: 'Total Schemes', value: '1,024', change: '+12 this month', icon: BookOpen, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
    { label: 'Active Users', value: '48,291', change: '+2.4k today', icon: Users, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { label: 'Total Queries', value: '1.2M', change: 'Last 30 days', icon: Activity, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
    { label: 'Success Rate', value: '94.2%', change: '↑ 2.1% vs last week', icon: TrendingUp, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
];

const TOP_SCHEMES = [
    { name: 'PM-KISAN', searches: 42891, pct: 85 },
    { name: 'Ayushman Bharat', searches: 38204, pct: 75 },
    { name: 'MUDRA Yojana', searches: 29103, pct: 58 },
    { name: 'PM Ujjwala', searches: 24819, pct: 49 },
    { name: 'NSP Scholarship', searches: 19402, pct: 38 },
];

const STATE_DATA = [
    { state: 'Uttar Pradesh', users: 12400, pct: 90 },
    { state: 'Maharashtra', users: 9800, pct: 71 },
    { state: 'Bihar', users: 8100, pct: 59 },
    { state: 'Rajasthan', users: 6700, pct: 49 },
    { state: 'Madhya Pradesh', users: 5900, pct: 43 },
    { state: 'Karnataka', users: 5200, pct: 38 },
];

const ACTIVITIES = [
    { msg: 'New scheme "PMEGP 2024" added', time: '2 min ago', type: 'success' },
    { msg: 'PM-KISAN scheme details updated', time: '14 min ago', type: 'info' },
    { msg: 'User report: incorrect eligibility for NSP', time: '1 hr ago', type: 'warning' },
    { msg: 'Bulk import: 15 new state schemes added', time: '3 hr ago', type: 'success' },
    { msg: 'Server response time high (>2s)', time: '5 hr ago', type: 'warning' },
];

type Tab = 'overview' | 'schemes' | 'users';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [schemeSearch, setSchemeSearch] = useState('');

    const filteredSchemes = SCHEMES.filter(s =>
        s.name.toLowerCase().includes(schemeSearch.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
            {/* Admin header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <LayoutDashboard size={20} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">YojanaMitra AI Control Panel</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                            Admin: superadmin
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 flex gap-1">
                    {(['overview', 'schemes', 'users'] as Tab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-all ${activeTab === tab
                                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                {/* ══ OVERVIEW TAB ══ */}
                {activeTab === 'overview' && (
                    <>
                        {/* Stats grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {STATS.map(({ label, value, change, icon: Icon, color }) => (
                                <div key={label} className="card">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
                                            <Icon size={22} />
                                        </div>
                                        <span className="text-xs text-gray-400">{change}</span>
                                    </div>
                                    <div className="text-2xl font-black text-gray-900 dark:text-white">{value}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Most searched schemes chart */}
                            <div className="card">
                                <div className="flex items-center gap-2 mb-5">
                                    <BarChart2 size={18} className="text-orange-500" />
                                    <h2 className="font-bold text-gray-900 dark:text-white">Most Searched Schemes</h2>
                                </div>
                                <div className="space-y-4">
                                    {TOP_SCHEMES.map(({ name, searches, pct }) => (
                                        <div key={name}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{name}</span>
                                                <span className="text-xs font-bold text-gray-500">{searches.toLocaleString()}</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill bg-gradient-to-r from-orange-500 to-yellow-400"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Users by state */}
                            <div className="card">
                                <div className="flex items-center gap-2 mb-5">
                                    <Users size={18} className="text-blue-500" />
                                    <h2 className="font-bold text-gray-900 dark:text-white">Users by State</h2>
                                </div>
                                <div className="space-y-4">
                                    {STATE_DATA.map(({ state, users, pct }) => (
                                        <div key={state}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{state}</span>
                                                <span className="text-xs font-bold text-gray-500">{users.toLocaleString()}</span>
                                            </div>
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill bg-gradient-to-r from-blue-500 to-indigo-400"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent activity */}
                        <div className="card">
                            <div className="flex items-center gap-2 mb-4">
                                <Activity size={18} className="text-green-500" />
                                <h2 className="font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                            </div>
                            <div className="space-y-3">
                                {ACTIVITIES.map(({ msg, time, type }, i) => (
                                    <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                                        {type === 'success' ? (
                                            <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                                        ) : (
                                            <AlertCircle size={16} className={`${type === 'warning' ? 'text-orange-500' : 'text-blue-500'} shrink-0 mt-0.5`} />
                                        )}
                                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{msg}</span>
                                        <span className="text-xs text-gray-400 shrink-0">{time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* ══ SCHEMES TAB ══ */}
                {activeTab === 'schemes' && (
                    <div className="card">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                            <h2 className="font-bold text-gray-900 dark:text-white">Manage Schemes</h2>
                            <button className="btn-primary text-sm py-2">
                                <Plus size={16} />
                                Add New Scheme
                            </button>
                        </div>
                        <div className="relative mb-4">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={schemeSearch}
                                onChange={e => setSchemeSearch(e.target.value)}
                                placeholder="Search schemes..."
                                className="input-field pl-9 text-sm"
                            />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Scheme</th>
                                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                                        <th className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">State</th>
                                        <th className="text-right py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSchemes.map(scheme => (
                                        <tr key={scheme.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="py-3 px-2">
                                                <div className="font-medium text-gray-900 dark:text-white">{scheme.name}</div>
                                                <div className="text-xs text-gray-400">{scheme.ministry}</div>
                                            </td>
                                            <td className="py-3 px-2">
                                                <span className="badge badge-saffron capitalize text-xs">{scheme.category}</span>
                                            </td>
                                            <td className="py-3 px-2 text-gray-500 dark:text-gray-400">{scheme.state}</td>
                                            <td className="py-3 px-2">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-colors" title="View">
                                                        <Eye size={15} />
                                                    </button>
                                                    <button className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-500 transition-colors" title="Edit">
                                                        <Edit2 size={15} />
                                                    </button>
                                                    <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Delete">
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ══ USERS TAB ══ */}
                {activeTab === 'users' && (
                    <div className="card">
                        <h2 className="font-bold text-gray-900 dark:text-white mb-5">User Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            {[
                                { label: 'Total Registered', value: '48,291', icon: '👥' },
                                { label: 'New Today', value: '2,418', icon: '🆕' },
                                { label: 'Active Chats', value: '1,204', icon: '💬' },
                            ].map(({ label, value, icon }) => (
                                <div key={label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 text-center">
                                    <div className="text-3xl mb-1">{icon}</div>
                                    <div className="text-2xl font-black text-gray-900 dark:text-white">{value}</div>
                                    <div className="text-sm text-gray-500">{label}</div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center py-10 text-gray-400">
                            <Users size={48} className="mx-auto mb-3 opacity-30" />
                            <p>Full user management table with export and GDPR tools would be displayed here.</p>
                            <p className="text-sm mt-1 text-gray-300">Connect to the backend API to load real user data.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
