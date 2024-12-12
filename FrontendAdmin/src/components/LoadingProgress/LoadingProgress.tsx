import React from 'react';

interface LoadingProgressProps {
  progress: number;
  message?: string;
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({ progress, message = 'Đang xử lý...' }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1001] flex items-center justify-center">
      <div className="bg-white/90 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-gray-100">
        <div className="text-center">
          <div className="mb-6">
            {/* Circular Progress */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
                {/* Progress circle */}
                <circle
                  className="text-blue-600 transition-all duration-300 ease-in-out"
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * progress) / 100}
                  transform="rotate(-90 50 50)"
                />
                {/* Percentage text */}
                <text
                  x="50"
                  y="50"
                  className="text-2xl font-bold"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fill="#1e40af"
                >
                  {progress}%
                </text>
              </svg>
            </div>
            
            {/* Linear Progress Bar (optional) */}
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-in-out"
                style={{ 
                  width: `${progress}%`,
                  boxShadow: '0 0 10px rgba(37, 99, 235, 0.5)'
                }}
              />
            </div>
          </div>
          
          {/* Message */}
          <div className="relative">
            <div className="h-12"> {/* Fixed height container */}
              <p className="text-gray-700 font-medium animate-pulse">
                {message}
              </p>
              <div className="mt-2 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingProgress; 