import React from 'react';
import { Sparkles, Heart, Shield, Users } from 'lucide-react';

const Logo = ({ size = 'md', animated = true }: { size?: 'sm' | 'md' | 'lg'; animated?: boolean }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`relative ${sizes[size]} ${animated ? 'animate-pulse' : ''}`}>
      {/* Main circle with gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 shadow-lg">
        {/* Inner design */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-orange-500">
          {/* Sparkles */}
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 text-white" />
        </div>
      </div>
      
      {/* Floating icons */}
      {animated && (
        <>
          <Heart className="absolute -top-2 -right-2 w-4 h-4 text-pink-500 animate-bounce" />
          <Shield className="absolute -bottom-2 -left-2 w-4 h-4 text-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
          <Users className="absolute -top-2 -left-2 w-4 h-4 text-green-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
        </>
      )}
    </div>
  );
};

export const LogoText = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`font-bold ${sizes[size]} bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent`}>
      योजना<span className="text-orange-500">मित्र</span>
    </div>
  );
};

export { Logo };
