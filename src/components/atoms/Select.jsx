import React from 'react';
import { cn } from '@/utils/cn';

const Select = React.forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <select
      className={cn(
        "flex w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900",
        "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;