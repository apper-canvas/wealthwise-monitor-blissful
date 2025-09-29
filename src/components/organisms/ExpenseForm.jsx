import React, { useState } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import FormField from '@/components/molecules/FormField';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const ExpenseForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    amount: initialData?.amount || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    date: initialData?.date || format(new Date(), 'yyyy-MM-dd')
  });

  const [errors, setErrors] = useState({});

  const categories = [
    'Food & Dining',
    'Transportation',
    'Housing',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Education',
    'Travel',
    'Other'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please enter a description";
    }

    if (!formData.date) {
      newErrors.date = "Please select a date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        createdAt: new Date().toISOString()
      };

      if (initialData) {
        expenseData.Id = initialData.Id;
      }

      await onSubmit(expenseData);
      toast.success(initialData ? "Expense updated successfully!" : "Expense added successfully!");
      
      if (!initialData) {
        setFormData({
          amount: '',
          category: '',
          description: '',
          date: format(new Date(), 'yyyy-MM-dd')
        });
      }
    } catch (error) {
      toast.error("Failed to save expense");
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ApperIcon name="Receipt" className="w-5 h-5 mr-2 text-primary-600" />
          {initialData ? 'Edit Expense' : 'Add New Expense'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Amount"
            error={errors.amount}
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className="pl-8"
              />
            </div>
          </FormField>

          <FormField
            label="Category"
            error={errors.category}
          >
            <Select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Description"
            error={errors.description}
          >
            <Input
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </FormField>

          <FormField
            label="Date"
            error={errors.date}
          >
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
            />
          </FormField>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              <ApperIcon name="Check" className="w-4 h-4 mr-2" />
              {initialData ? 'Update' : 'Add Expense'}
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

export default ExpenseForm;