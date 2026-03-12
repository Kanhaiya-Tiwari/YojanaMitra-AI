import React from 'react';
import { X, Download, Share2, Check, X as XIcon, AlertTriangle, Star, TrendingUp } from 'lucide-react';

interface Scheme {
  id: string;
  name: string;
  ministry: string;
  description: string;
  target_group: string;
  benefits?: string;
  income_limit?: number;
  age_min?: number;
  age_max?: number;
  required_documents?: string[];
  application_link?: string;
  offline_office?: string;
  application_steps?: string[];
}

interface SchemeComparisonProps {
  schemes: Scheme[];
  onClose: () => void;
}

const SchemeComparison: React.FC<SchemeComparisonProps> = ({ schemes, onClose }) => {
  if (schemes.length < 2) return null;

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'No Limit';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getAgeRange = (min?: number, max?: number) => {
    if (!min && !max) return 'All Ages';
    if (min && max) return `${min} - ${max} years`;
    if (min) return `${min}+ years`;
    if (max) return `Up to ${max} years`;
    return 'All Ages';
  };

  const compareFeature = (feature: string, getValue: (scheme: Scheme) => any) => {
    const values = schemes.map(scheme => getValue(scheme));
    const allSame = values.every(v => v === values[0]);
    
    return (
      <tr className="border-b border-gray-200 dark:border-gray-700">
        <td className="p-4 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">
          {feature}
        </td>
        {schemes.map((scheme, index) => (
          <td key={scheme.id} className={`p-4 ${allSame ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
            {getValue(scheme)}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Scheme Comparison</h2>
              <p className="text-orange-100">Compare {schemes.length} government schemes side by side</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <Download size={20} />
              </button>
              <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <Share2 size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Scheme Names */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
          {schemes.map((scheme, index) => (
            <div key={scheme.id} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                {index + 1}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{scheme.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{scheme.ministry}</p>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="p-4 text-left font-medium text-gray-900 dark:text-white">Feature</th>
                {schemes.map(scheme => (
                  <th key={scheme.id} className="p-4 text-left font-medium text-gray-900 dark:text-white">
                    {scheme.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareFeature('Target Group', (scheme) => scheme.target_group)}
              {compareFeature('Income Limit', (scheme) => formatCurrency(scheme.income_limit))}
              {compareFeature('Age Range', (scheme) => getAgeRange(scheme.age_min, scheme.age_max))}
              {compareFeature('Benefits', (scheme) => scheme.benefits || 'N/A')}
              {compareFeature('Required Documents', (scheme) => (
                <div className="flex flex-wrap gap-1">
                  {(scheme.required_documents || []).slice(0, 3).map((doc, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs">
                      {doc}
                    </span>
                  ))}
                  {(scheme.required_documents || []).length > 3 && (
                    <span className="text-xs text-gray-500">+{(scheme.required_documents || []).length - 3} more</span>
                  )}
                </div>
              ))}
              {compareFeature('Application Process', (scheme) => scheme.application_steps ? `${scheme.application_steps.length} steps` : 'N/A')}
              {compareFeature('Online Application', (scheme) => (
                scheme.application_link ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Check size={16} />
                    Available
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600">
                    <XIcon size={16} />
                    Not Available
                  </span>
                )
              ))}
            </tbody>
          </table>
        </div>

        {/* Detailed Comparison */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Differences</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {schemes.map((scheme, index) => (
              <div key={scheme.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{scheme.name}</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{scheme.benefits}</p>
                  </div>
                  {scheme.application_link && (
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Online application available</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recommendation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Based on the comparison, {schemes[0].name} appears to be the most comprehensive option with 
                {schemes[0].application_link && ' online application facility'}. 
                {schemes[0].income_limit && ` Suitable for income up to ${formatCurrency(schemes[0].income_limit)}`}.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Export as PDF
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Apply for Selected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeComparison;
