import React, { useState } from 'react';
import { ExternalLink, MapPin, FileText, Clock, AlertTriangle, CheckCircle, ArrowRight, Star, Download, Share2 } from 'lucide-react';

interface EnhancedSchemeCardProps {
  scheme: {
    id: string;
    name: string;
    benefits?: string;
    application_link?: string;
    offline_office?: string;
    application_steps?: string[];
    required_documents?: string[];
    fraud_warnings?: string[];
  };
  lang: boolean;
  index: number;
}

const EnhancedSchemeCard: React.FC<EnhancedSchemeCardProps> = ({ scheme, lang, index }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl border border-orange-100 dark:border-orange-800 overflow-hidden animate-fade-in-up`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* Header */}
      <div className="relative p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white text-sm font-bold">
                {index + 1}
              </span>
              {scheme.name}
            </h3>
            {scheme.benefits && (
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {scheme.benefits}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {scheme.application_link && (
              <a
                href={scheme.application_link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
                title={lang ? 'ऑनलाइन आवेदन' : 'Apply Online'}
              >
                <ExternalLink size={16} />
              </a>
            )}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={lang ? 'विवरण देखें' : 'View Details'}
            >
              <ArrowRight size={16} className={`transform transition-transform ${showDetails ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Quick stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {scheme.required_documents && (
            <span className="flex items-center gap-1">
              <FileText size={14} />
              {scheme.required_documents.length} {lang ? 'दस्तावेज' : 'documents'}
            </span>
          )}
          {scheme.application_steps && (
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {scheme.application_steps.length} {lang ? 'चरण' : 'steps'}
            </span>
          )}
        </div>
      </div>

      {/* Expandable details */}
      <div className={`relative transition-all duration-300 ease-in-out ${showDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-6 space-y-6">
          {/* Application Steps */}
          {scheme.application_steps && scheme.application_steps.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                {lang ? 'आवेदन के चरण' : 'Application Steps'}
              </h4>
              <ol className="space-y-2">
                {scheme.application_steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Required Documents */}
          {scheme.required_documents && scheme.required_documents.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                {lang ? 'आवश्यक दस्तावेज़' : 'Required Documents'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {scheme.required_documents.map((doc, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Offline Office */}
          {scheme.offline_office && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-500" />
                {lang ? 'ऑफलाइन कार्यालय' : 'Offline Office'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                {scheme.offline_office}
              </p>
            </div>
          )}

          {/* Fraud Warnings */}
          {scheme.fraud_warnings && scheme.fraud_warnings.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {lang ? '⚠️ धोखाधड़ी चेतावनी' : '⚠️ Fraud Warning'}
              </h4>
              <ul className="space-y-2 text-sm text-red-800 dark:text-red-200">
                {scheme.fraud_warnings.map((warning, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="relative p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <Download size={16} />
            </button>
            <button className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <Share2 size={16} />
            </button>
            <button className="p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <Star size={16} />
            </button>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105">
            {lang ? 'आवेदन करें' : 'Apply Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSchemeCard;
