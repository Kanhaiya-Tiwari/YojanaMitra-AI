import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, Star, Clock, MapPin, Users, TrendingUp } from 'lucide-react';

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
  state_availability?: string[];
  required_documents?: string[];
  application_link?: string;
  offline_office?: string;
}

interface SchemeSearchProps {
  onSchemeSelect: (scheme: Scheme) => void;
  onCompareSelect: (schemes: Scheme[]) => void;
}

const SchemeSearch: React.FC<SchemeSearchProps> = ({ onSchemeSelect, onCompareSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    ministry: '',
    targetGroup: '',
    incomeLimit: '',
    ageRange: '',
    state: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [compareList, setCompareList] = useState<Scheme[]>([]);

  useEffect(() => {
    if (searchTerm.length > 2) {
      searchSchemes();
    }
  }, [searchTerm, filters]);

  const searchSchemes = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        q: searchTerm,
        limit: '20'
      });
      
      if (filters.ministry) queryParams.append('ministry', filters.ministry);
      if (filters.targetGroup) queryParams.append('target_group', filters.targetGroup);
      if (filters.state) queryParams.append('state', filters.state);
      
      const response = await fetch(`http://localhost:8000/api/v1/schemes?${queryParams}`);
      const data = await response.json();
      setSchemes(data);
    } catch (error) {
      console.error('Error searching schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCompare = (scheme: Scheme) => {
    if (compareList.length < 3 && !compareList.find(s => s.id === scheme.id)) {
      const newCompareList = [...compareList, scheme];
      setCompareList(newCompareList);
      if (newCompareList.length >= 2) {
        onCompareSelect(newCompareList);
      }
    }
  };

  const removeFromCompare = (schemeId: string) => {
    const newCompareList = compareList.filter(s => s.id !== schemeId);
    setCompareList(newCompareList);
    if (newCompareList.length < 2) {
      onCompareSelect([]);
    }
  };

  const ministries = ['Ministry of Agriculture', 'Ministry of Education', 'Ministry of Health', 'Ministry of Finance', 'Ministry of Rural Development'];
  const targetGroups = ['Farmers', 'Students', 'Women', 'Elderly', 'Business Owners', 'Rural Poor'];
  const states = ['Uttar Pradesh', 'Maharashtra', 'Bihar', 'Rajasthan', 'Madhya Pradesh', 'Tamil Nadu'];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search government schemes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl transition-colors ${
              showFilters 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ministry</label>
                <select
                  value={filters.ministry}
                  onChange={(e) => setFilters({...filters, ministry: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">All Ministries</option>
                  {ministries.map(ministry => (
                    <option key={ministry} value={ministry}>{ministry}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Group</label>
                <select
                  value={filters.targetGroup}
                  onChange={(e) => setFilters({...filters, targetGroup: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">All Groups</option>
                  {targetGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">State</label>
                <select
                  value={filters.state}
                  onChange={(e) => setFilters({...filters, state: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-4 mb-6 border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-medium text-orange-800 dark:text-orange-200">Compare ({compareList.length}/3)</span>
              <div className="flex gap-2">
                {compareList.map(scheme => (
                  <div key={scheme.id} className="bg-white dark:bg-gray-800 px-3 py-1 rounded-lg flex items-center gap-2">
                    <span className="text-sm truncate max-w-32">{scheme.name}</span>
                    <button
                      onClick={() => removeFromCompare(scheme.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {compareList.length >= 2 && (
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Compare Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* Search Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : schemes.length > 0 ? (
        <div className="grid gap-4">
          {schemes.map((scheme, index) => (
            <div
              key={scheme.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{scheme.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{scheme.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {scheme.target_group}
                    </span>
                    {scheme.ministry && (
                      <span className="flex items-center gap-1">
                        <Star size={14} />
                        {scheme.ministry}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSchemeSelect(scheme)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => addToCompare(scheme)}
                    disabled={compareList.length >= 3 || !!compareList.find(s => s.id === scheme.id)}
                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Add to Compare"
                  >
                    <TrendingUp size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : searchTerm.length > 2 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p>No schemes found matching your search.</p>
            <p className="text-sm mt-2">Try different keywords or adjust filters.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SchemeSearch;
