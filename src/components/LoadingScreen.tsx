
import React from 'react';
import { Heart } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg animate-pulse">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <p className="text-gray-600 dark:text-gray-300">Memuat Family...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
