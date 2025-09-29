import React from 'react';
import Button from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const BankAccountList = ({ accounts, onEdit, onDelete, onAdd }) => {
  const formatBalance = (balance, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(balance || 0);
  };

  const getAccountTypeIcon = (type) => {
    switch (type) {
      case 'Checking':
        return 'CreditCard';
      case 'Savings':
        return 'PiggyBank';
      case 'Credit Card':
        return 'CreditCard';
      case 'Loan':
        return 'TrendingDown';
      default:
        return 'CreditCard';
    }
  };

  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'Checking':
        return 'text-blue-600 bg-blue-50';
      case 'Savings':
        return 'text-green-600 bg-green-50';
      case 'Credit Card':
        return 'text-purple-600 bg-purple-50';
      case 'Loan':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  if (accounts.length === 0) {
    return (
      <Empty 
        message="No bank accounts yet"
        description="Add your first bank account to start tracking your finances"
        actionButton={
          <Button onClick={onAdd} className="mt-4">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Bank Account
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Bank Accounts</h2>
        <Button onClick={onAdd}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card key={account.Id} className="hover:shadow-card-hover transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={cn(
                    'p-2 rounded-lg mr-3',
                    getAccountTypeColor(account.account_type_c)
                  )}>
                    <ApperIcon 
                      name={getAccountTypeIcon(account.account_type_c)} 
                      className="w-5 h-5" 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 truncate">
                      {account.Name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {account.bank_name_c}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(account)}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <ApperIcon name="Edit2" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(account.Id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Balance</span>
                  <span className="font-semibold text-slate-800">
                    {formatBalance(account.balance_c, account.currency_c)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Type</span>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    getAccountTypeColor(account.account_type_c)
                  )}>
                    {account.account_type_c}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Account</span>
                  <span className="text-sm text-slate-600 font-mono">
                    ****{account.account_number_c?.slice(-4) || '0000'}
                  </span>
                </div>

                {account.Tags && (
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1">
                      {account.Tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-primary-50 rounded-lg">
        <div className="flex items-center">
          <ApperIcon name="Info" className="w-5 h-5 text-primary-600 mr-2" />
          <div>
            <h4 className="font-medium text-primary-800">Total Balance</h4>
            <p className="text-2xl font-bold text-primary-800">
              {formatBalance(
                accounts.reduce((sum, account) => sum + (account.balance_c || 0), 0),
                'USD'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankAccountList;