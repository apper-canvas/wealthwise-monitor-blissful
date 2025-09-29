import React, { useState } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import CategoryIcon from '@/components/molecules/CategoryIcon';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const BudgetForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [budgetData, setBudgetData] = useState(() => {
    const currentDate = new Date();
    const defaultCategories = {
      'Food & Dining': 0,
      'Transportation': 0,
      'Housing': 0,
      'Utilities': 0,
      'Entertainment': 0,
      'Healthcare': 0,
      'Shopping': 0,
      'Education': 0,
      'Travel': 0,
      'Other': 0
    };

    return {
      month: initialData?.month || currentDate.toLocaleString('default', { month: 'long' }),
      year: initialData?.year || currentDate.getFullYear(),
      categories: initialData?.categories || defaultCategories
    };
  });

  const handleCategoryChange = (category, value) => {
    setBudgetData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: parseFloat(value) || 0
      }
    }));
  };

  const getTotalBudget = () => {
    return Object.values(budgetData.categories).reduce((sum, amount) => sum + amount, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const totalBudget = getTotalBudget();
    
    if (totalBudget <= 0) {
      toast.error("Please set at least one category budget");
      return;
    }

    try {
// Ensure categories are properly formatted as JSON object
      const formattedCategories = typeof budgetData.categories === 'string' 
        ? budgetData.categories.split(',').reduce((acc, item) => {
            const [category, amount] = item.split(':').map(s => s.trim());
            if (category && amount) {
              acc[category] = parseFloat(amount) || 0;
            }
            return acc;
          }, {})
        : budgetData.categories || {};

      const budget = {
        ...budgetData,
        categories: formattedCategories,
        totalBudget,
        isActive: true,
        Id: initialData?.Id
      };

      await onSubmit(budget);
      toast.success(initialData ? "Budget updated successfully!" : "Budget created successfully!");
    } catch (error) {
      toast.error("Failed to save budget");
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ApperIcon name="PieChart" className="w-5 h-5 mr-2 text-primary-600" />
          {initialData ? 'Edit Budget' : 'Create Monthly Budget'}
        </CardTitle>
        <p className="text-sm text-slate-600">
          Set spending limits for {budgetData.month} {budgetData.year}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(budgetData.categories).map(([category, amount]) => (
              <FormField key={category} label={category}>
                <div className="flex items-center space-x-3">
                  <CategoryIcon category={category} size="sm" />
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={amount || ''}
                      onChange={(e) => handleCategoryChange(category, e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </FormField>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Monthly Budget:</span>
              <span className="text-gradient">${getTotalBudget().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              <ApperIcon name="Check" className="w-4 h-4 mr-2" />
              {initialData ? 'Update Budget' : 'Create Budget'}
            </Button>
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel}>
                <ApperIcon name="X" className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BudgetForm;