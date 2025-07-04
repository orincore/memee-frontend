import React from 'react';

interface AdBannerProps {
  size: 'horizontal' | 'square' | 'vertical';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ size, className = '' }) => {
  const getAdDimensions = () => {
    switch (size) {
      case 'horizontal':
        return 'h-24 sm:h-32';
      case 'square':
        return 'aspect-square';
      case 'vertical':
        return 'h-96';
      default:
        return 'h-32';
    }
  };

  const getAdText = () => {
    switch (size) {
      case 'horizontal':
        return 'Advertisement 728x90';
      case 'square':
        return 'Ad 300x300';
      case 'vertical':
        return 'Advertisement 160x600';
      default:
        return 'Advertisement';
    }
  };

  return (
    <div className={`bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center ${getAdDimensions()} ${className}`}>
      <div className="text-center">
        <div className="text-gray-400 dark:text-gray-500 text-2xl mb-2">📢</div>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
          {getAdText()}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Place your ad here
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          contact us at contact@orincore.com
        </p>
      </div>
    </div>
  );
};