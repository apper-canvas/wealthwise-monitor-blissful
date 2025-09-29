import React from 'react';
import { Card, CardContent } from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = 'neutral',
  className 
}) => {
  const trendColors = {
    positive: 'text-success-600',
    negative: 'text-red-500',
    neutral: 'text-slate-600'
  };

  return (
    <Card className={cn("card-gradient", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {change && (
              <p className={cn("text-sm font-medium mt-1", trendColors[trend])}>
                {change}
              </p>
            )}
          </div>
          {icon && (
            <div className="ml-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                <ApperIcon name={icon} className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;