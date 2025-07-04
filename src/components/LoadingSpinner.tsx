import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500 mx-auto mb-2" />
        <p className="text-gray-600 dark:text-gray-400">Loading more memes...</p>
      </div>
    </div>
  );
};