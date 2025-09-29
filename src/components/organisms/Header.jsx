import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Header = ({ onAddExpense, userName = "Welcome back" }) => {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">WealthWise</h1>
            <p className="text-primary-100 mt-1">{userName}</p>
          </div>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={onAddExpense}
          >
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;