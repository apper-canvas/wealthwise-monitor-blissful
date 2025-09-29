import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import ProgressBar from '@/components/molecules/ProgressBar';
import CategoryIcon from '@/components/molecules/CategoryIcon';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const BudgetOverview = ({ budget, expenses, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!budget) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ApperIcon name="PieChart" className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Budget Set</h3>
          <p className="text-slate-600 mb-4">
            Create a monthly budget to track your spending and stay on target.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate spending by category
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const expenseMonth = expenseDate.toLocaleString('default', { month: 'long' });
    const expenseYear = expenseDate.getFullYear();
    return expenseMonth === currentMonth && expenseYear === currentYear;
  });

  const spendingByCategory = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const totalSpent = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudget = budget.totalBudget || 0;
  const remainingBudget = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="PieChart" className="w-5 h-5 mr-2 text-primary-600" />
            {budget.month} {budget.year} Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Total Budget</p>
              <p className="text-xl font-bold text-slate-900">${totalBudget.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Spent</p>
              <p className="text-xl font-bold text-slate-900">${totalSpent.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-1">Remaining</p>
              <p className={cn(
                "text-xl font-bold",
                remainingBudget >= 0 ? "text-success-600" : "text-red-600"
              )}>
                ${Math.abs(remainingBudget).toFixed(2)}
              </p>
            </div>
          </div>
          
          <ProgressBar
            value={totalSpent}
            max={totalBudget}
            label="Overall Budget Usage"
          />
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(budget.categories).map(([category, budgetAmount]) => {
              if (budgetAmount === 0) return null;
              
              const spent = spendingByCategory[category] || 0;
              const remaining = budgetAmount - spent;
              const percentage = (spent / budgetAmount) * 100;
              
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <CategoryIcon category={category} size="sm" />
                      <span className="font-medium text-slate-900">{category}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900">
                        ${spent.toFixed(2)} / ${budgetAmount.toFixed(2)}
                      </p>
                      <p className={cn(
                        "text-sm",
                        remaining >= 0 ? "text-success-600" : "text-red-600"
                      )}>
                        {remaining >= 0 
                          ? `$${remaining.toFixed(2)} left`
                          : `$${Math.abs(remaining).toFixed(2)} over`
                        }
                      </p>
                    </div>
                  </div>
                  <ProgressBar
                    value={spent}
                    max={budgetAmount}
                    showPercentage={true}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetOverview;