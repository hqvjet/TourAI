import React from 'react';

interface ProgressBarProps {
  positive: number;
  neutral: number;
  negative: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ positive, neutral, negative }) => {
  const total = positive + neutral + negative;
  const positiveWidth = (positive / total) * 100;
  const neutralWidth = (neutral / total) * 100;
  const negativeWidth = (negative / total) * 100;

  return (
    <div className="w-full h-6 bg-gray-200 rounded-lg overflow-hidden flex">
      <div
        className="h-full"
        style={{
          width: `${positiveWidth}%`,
          backgroundColor: '#34D399',
        }}
      ></div>
      <div
        className="h-full"
        style={{
          width: `${neutralWidth}%`,
          backgroundColor: '#6B7280',
        }}
      ></div>
      <div
        className="h-full"
        style={{
          width: `${negativeWidth}%`,
          backgroundColor: '#EF4444',
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
