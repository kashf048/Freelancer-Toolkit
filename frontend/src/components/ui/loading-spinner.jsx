import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const LoadingSpinner = ({ 
  size = 'default', 
  className = '', 
  text = '',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinnerVariants = {
    spin: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 shadow-xl">
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              variants={spinnerVariants}
              animate="spin"
              className={cn(sizeClasses.xl, 'text-blue-600')}
            >
              <Loader2 className="h-full w-full" />
            </motion.div>
            {text && (
              <p className={cn(textSizeClasses.default, 'text-gray-600 font-medium')}>
                {text}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <motion.div
          variants={spinnerVariants}
          animate="spin"
          className={cn(sizeClasses.xl, 'text-blue-600')}
        >
          <Loader2 className="h-full w-full" />
        </motion.div>
        {text && (
          <p className={cn(textSizeClasses.lg, 'text-gray-600 font-medium')}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <motion.div
        variants={spinnerVariants}
        animate="spin"
        className={cn(sizeClasses[size], 'text-blue-600')}
      >
        <Loader2 className="h-full w-full" />
      </motion.div>
      {text && (
        <span className={cn(textSizeClasses[size], 'text-gray-600')}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
