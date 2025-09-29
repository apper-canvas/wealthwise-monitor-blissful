import React from 'react';
import Button from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  icon = "Inbox", 
  title = "Nothing here yet", 
  description = "Get started by adding your first item",
  actionLabel,
  onAction 
}) => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-8 h-8 text-slate-400" />
        </div>
        
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          {title}
        </h3>
        
        <p className="text-slate-600 mb-6">
          {description}
        </p>
        
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="primary">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Empty;