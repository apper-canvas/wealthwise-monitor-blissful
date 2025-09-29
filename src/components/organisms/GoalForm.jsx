import React, { useState } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import FormField from '@/components/molecules/FormField';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { format, addMonths } from 'date-fns';
import { toast } from 'react-toastify';

const GoalForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    targetAmount: initialData?.targetAmount || '',
    currentAmount: initialData?.currentAmount || 0,
    deadline: initialData?.deadline || format(addMonths(new Date(), 6), 'yyyy-MM-dd'),
    priority: initialData?.priority || 1,
    category: initialData?.category || ''
  });

  const [errors, setErrors] = useState({});

  const goalCategories = [
    'Emergency Fund',
    'Vacation',
    'Home Purchase',
    'Car Purchase',
    'Education',
    'Retirement',
    'Investment',
    'Debt Payoff',
    'Wedding',
    'Home Improvement',
    'Other'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter a goal name";
    }

    if (!formData.targetAmount || formData.targetAmount <= 0) {
      newErrors.targetAmount = "Please enter a valid target amount";
    }

    if (formData.currentAmount < 0) {
      newErrors.currentAmount = "Current amount cannot be negative";
    }

    if (formData.currentAmount > formData.targetAmount) {
      newErrors.currentAmount = "Current amount cannot exceed target amount";
    }

    if (!formData.deadline) {
      newErrors.deadline = "Please select a deadline";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
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
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        priority: parseInt(formData.priority)
      };

      if (initialData) {
        goalData.Id = initialData.Id;
      }

      await onSubmit(goalData);
      toast.success(initialData ? "Goal updated successfully!" : "Goal created successfully!");
      
      if (!initialData) {
        setFormData({
          name: '',
          targetAmount: '',
          currentAmount: 0,
          deadline: format(addMonths(new Date(), 6), 'yyyy-MM-dd'),
          priority: 1,
          category: ''
        });
      }
    } catch (error) {
      toast.error("Failed to save goal");
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getProgressPercentage = () => {
    if (!formData.targetAmount) return 0;
    return Math.min((formData.currentAmount / formData.targetAmount) * 100, 100);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ApperIcon name="Target" className="w-5 h-5 mr-2 text-primary-600" />
          {initialData ? 'Edit Savings Goal' : 'Create Savings Goal'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Goal Name"
            error={errors.name}
          >
            <Input
              placeholder="e.g., Emergency Fund"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
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
              {goalCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Target Amount"
            error={errors.targetAmount}
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.targetAmount}
                onChange={(e) => handleChange('targetAmount', e.target.value)}
                className="pl-8"
              />
            </div>
          </FormField>

          <FormField
            label="Current Amount"
            error={errors.currentAmount}
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.currentAmount}
                onChange={(e) => handleChange('currentAmount', e.target.value)}
                className="pl-8"
              />
            </div>
          </FormField>

          <FormField
            label="Deadline"
            error={errors.deadline}
          >
            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) => handleChange('deadline', e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
            />
          </FormField>

          <FormField label="Priority">
            <Select
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
            >
              <option value={1}>High Priority</option>
              <option value={2}>Medium Priority</option>
              <option value={3}>Low Priority</option>
            </Select>
          </FormField>

          {formData.targetAmount > 0 && (
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex justify-between text-sm text-slate-600 mb-1">
                <span>Progress</span>
                <span>{getProgressPercentage().toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              <ApperIcon name="Check" className="w-4 h-4 mr-2" />
              {initialData ? 'Update Goal' : 'Create Goal'}
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

export default GoalForm;