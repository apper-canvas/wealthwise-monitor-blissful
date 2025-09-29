import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const CategoryIcon = ({ category, size = 'md', className }) => {
  const iconMap = {
    'Food & Dining': 'Utensils',
    'Transportation': 'Car',
    'Housing': 'Home',
    'Utilities': 'Zap',
    'Entertainment': 'Film',
    'Healthcare': 'Heart',
    'Shopping': 'ShoppingBag',
    'Education': 'GraduationCap',
    'Travel': 'Plane',
    'Income': 'TrendingUp',
    'Savings': 'PiggyBank',
    'Other': 'MoreHorizontal'
  };

  const colorMap = {
    'Food & Dining': 'bg-orange-100 text-orange-600',
    'Transportation': 'bg-blue-100 text-blue-600',
    'Housing': 'bg-green-100 text-green-600',
    'Utilities': 'bg-yellow-100 text-yellow-600',
    'Entertainment': 'bg-purple-100 text-purple-600',
    'Healthcare': 'bg-red-100 text-red-600',
    'Shopping': 'bg-pink-100 text-pink-600',
    'Education': 'bg-indigo-100 text-indigo-600',
    'Travel': 'bg-teal-100 text-teal-600',
    'Income': 'bg-success-100 text-success-600',
    'Savings': 'bg-emerald-100 text-emerald-600',
    'Other': 'bg-slate-100 text-slate-600'
  };

  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconName = iconMap[category] || iconMap['Other'];
  const colorClasses = colorMap[category] || colorMap['Other'];

  return (
    <div className={cn(
      "rounded-lg flex items-center justify-center",
      sizeMap[size],
      colorClasses,
      className
    )}>
      <ApperIcon name={iconName} className={iconSizeMap[size]} />
    </div>
  );
};

export default CategoryIcon;