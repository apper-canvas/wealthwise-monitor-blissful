import React from 'react';
import { cn } from '@/utils/cn';

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "block text-sm font-medium text-slate-700 mb-1",
      className
    )}
    {...props}
  />
));

Label.displayName = "Label";

export default Label;