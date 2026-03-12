'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import SchemeCard from '@/components/SchemeCard';
import { SCHEMES, CATEGORIES, INDIAN_STATES } from '@/lib/schemes-data';
import { useTheme } from '@/components/ThemeProvider';

const INCOME_RANGES = [
  { value: 'any', label: 'Any Income' },
  { value: '0-1', label: 'Up to ₹1 Lakh' },
  { value: '1-2', label: '₹1 – 2 Lakh' },
  { value: '2-5', label: '₹2 – 5 Lakh' },
  { value: '5-plus', label: 'Above ₹5 Lakh' },
];

export default function SchemesPage() {
  const { lang } = useTheme();
  const hi = lang === 'hi';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [state, setState] = useState('All States');
  const [income, setIncome] = useState('any');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return SCHEMES.filter(s => {
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        (s.nameHi && s.nameHi.includes(search));

      const matchesCategory = category === 'all' || s.category === category;
      const matchesState = state === 'All States' || s.state === 'All India' || s.state === state;

      return matchesSearch && matchesCategory && matchesState;
    });
  }, [search, category, state, income]);

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setState('All States');
    setIncome('any');
  };

  const hasActiveFilters = category !== 'all' || state !== 'All States' || income !== 'any' || search;

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            {hi ? '📋 सरकारी योजनाएं' : '📋 Government Schemes'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {hi
              ? `${SCHEMES.length}+ योजनाएं उपलब्ध • खोजें और जानें`
              : `${SCHEMES.length}+ schemes available • Search, filter, and discover`}
          </p>

          {/* Search bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={hi ? 'योजना खोजें...' : 'Search schemes by name or keyword...'}
                className="input-field pl-10 pr-4"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => setFiltersOpen(o => !o)}
              className={`btn-secondary flex items-center gap-2 ${hasActiveFilters ? 'border-orange-400 text-orange-600' : ''}`}
            >
              <SlidersHorizontal size={16} />
              {hi ? 'फ़िल्टर' : 'Filters'}
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-orange-500" />
              )}
            </button>
          </div>

          {/* Filter panel */}
          {filtersOpen && (
            <div className="mt-4 p-4 bg-orange-50 dark:bg-gray-800 rounded-2xl border border-orange-100 dark:border-gray-700 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                    {hi ? 'श्रेणी' : 'Category'}
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="select-field"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>
                        {c.icon} {hi ? c.labelHi : c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                    {hi ? 'राज्य' : 'State'}
                  </label>
                  <select value={state} onChange={e => setState(e.target.value)} className="select-field">
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                    {hi ? 'आय सीमा' : 'Income Range'}
                  </label>
                  <select value={income} onChange={e => setIncome(e.target.value)} className="select-field">
                    {INCOME_RANGES.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  <X size={14} />
                  {hi ? 'सभी फ़िल्टर हटाएं' : 'Clear all filters'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-3 px-4 overflow-x-auto no-scrollbar">
        <div className="max-w-6xl mx-auto flex gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${category === c.value
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-orange-100 dark:hover:bg-gray-700'
                }`}
            >
              {c.icon} {hi ? c.labelHi : c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {hi
              ? `${filtered.length} योजनाएं मिलीं`
              : `${filtered.length} scheme${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">
              {hi ? 'कोई योजना नहीं मिली' : 'No schemes found'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {hi ? 'फ़िल्टर बदलकर दोबारा खोजें' : 'Try adjusting your filters or search terms'}
            </p>
            <button onClick={clearFilters} className="btn-primary">
              {hi ? 'फ़िल्टर हटाएं' : 'Clear Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(scheme => (
              <SchemeCard key={scheme.id} scheme={scheme} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
