import React from 'react';
import { cn } from '@/utils/cn';

const ProgressBar = ({ 
  value, 
  max = 100, 
  className, 
  label,
  showPercentage = true 
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const isOverBudget = percentage > 100;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          {showPercentage && (
            <span className={cn(
              "text-sm font-medium",
              isOverBudget ? "text-red-600" : "text-slate-600"
            )}>
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            isOverBudget 
              ? "bg-gradient-to-r from-red-500 to-red-600" 
              : "bg-gradient-to-r from-success-500 to-success-600"
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;