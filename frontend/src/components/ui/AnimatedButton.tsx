import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, variant = 'primary', size = 'md', animated = true, ...props }, ref) => {
    const baseClasses = "relative overflow-hidden rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95";
    
    const variants = {
      primary: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-orange-500/25",
      secondary: "bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 shadow-md hover:shadow-gray-500/25",
      gradient: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white shadow-lg hover:shadow-purple-500/25"
    };
    
    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          animated && "animate-pulse-once",
          className
        )}
        {...props}
      >
        {animated && (
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
        )}
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
