import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Label from '@/components/atoms/Label';
import { Card } from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const BankAccountForm = ({ account, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    bankName: '',
    accountNumber: '',
    accountType: 'Checking',
    currency: 'USD',
    balance: '',
    tags: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.Name || '',
        bankName: account.bank_name_c || '',
        accountNumber: account.account_number_c || '',
        accountType: account.account_type_c || 'Checking',
        currency: account.currency_c || 'USD',
        balance: account.balance_c?.toString() || '',
        tags: account.Tags || ''
      });
    }
  }, [account]);

  const accountTypes = [
    { value: 'Checking', label: 'Checking' },
    { value: 'Savings', label: 'Savings' },
    { value: 'Credit Card', label: 'Credit Card' },
    { value: 'Loan', label: 'Loan' }
  ];

  const currencies = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'CAD', label: 'CAD' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Account name is required';
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }

    if (formData.balance && isNaN(parseFloat(formData.balance))) {
      newErrors.balance = 'Balance must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {account ? 'Edit Account' : 'Add Bank Account'}
          </h2>
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-700"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Account Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="My Checking Account"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                name="bankName"
                type="text"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Chase Bank"
                className={errors.bankName ? 'border-red-500' : ''}
              />
              {errors.bankName && (
                <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                type="text"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="****1234"
                className={errors.accountNumber ? 'border-red-500' : ''}
              />
              {errors.accountNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>
              )}
            </div>

            <div>
              <Label htmlFor="accountType">Account Type</Label>
              <Select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
              >
                {accountTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                {currencies.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="balance">Balance</Label>
              <Input
                id="balance"
                name="balance"
                type="number"
                step="0.01"
                value={formData.balance}
                onChange={handleChange}
                placeholder="0.00"
                className={errors.balance ? 'border-red-500' : ''}
              />
              {errors.balance && (
                <p className="text-red-500 text-sm mt-1">{errors.balance}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (Optional)</Label>
            <Input
              id="tags"
              name="tags"
              type="text"
              value={formData.tags}
              onChange={handleChange}
              placeholder="personal, business, savings"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </div>
              ) : (
                account ? 'Update Account' : 'Add Account'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default BankAccountForm;