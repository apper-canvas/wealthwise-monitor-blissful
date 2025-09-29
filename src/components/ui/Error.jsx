import React from 'react';
import Button from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  type = 'default' 
}) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-slate-600 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Error;