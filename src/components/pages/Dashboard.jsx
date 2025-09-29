import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import Header from '@/components/organisms/Header';
import StatCard from '@/components/molecules/StatCard';
import SpendingChart from '@/components/organisms/SpendingChart';
import CategoryChart from '@/components/organisms/CategoryChart';
import ExpenseForm from '@/components/organisms/ExpenseForm';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { useExpenses } from '@/hooks/useExpenses';
import { useBudget } from '@/hooks/useBudget';
import { useGoals } from '@/hooks/useGoals';

const Dashboard = () => {
  const { expenses, loading: expensesLoading, error: expensesError, addExpense } = useExpenses();
  const { budget, loading: budgetLoading } = useBudget();
  const { goals, loading: goalsLoading } = useGoals();
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const loading = expensesLoading || budgetLoading || goalsLoading;
  const error = expensesError;

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} />;
  }

  // Calculate current month statistics
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= monthStart && expenseDate <= monthEnd;
  });

  const thisMonthSpending = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudget = budget?.totalBudget || 0;
  const remainingBudget = totalBudget - thisMonthSpending;
  
  // Calculate goal statistics
  const totalGoalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalGoalProgress = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const goalCompletionRate = totalGoalTarget > 0 ? (totalGoalProgress / totalGoalTarget) * 100 : 0;

  // Calculate spending trend
  const lastMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const lastMonthStart = startOfMonth(lastMonth);
    const lastMonthEnd = endOfMonth(lastMonth);
    return expenseDate >= lastMonthStart && expenseDate <= lastMonthEnd;
  });

  const lastMonthSpending = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const spendingChange = lastMonthSpending > 0 
    ? ((thisMonthSpending - lastMonthSpending) / lastMonthSpending) * 100
    : 0;

  const handleAddExpense = async (expenseData) => {
    await addExpense(expenseData);
    setShowExpenseForm(false);
  };

  if (showExpenseForm) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={() => setShowExpenseForm(false)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
          <ExpenseForm 
            onSubmit={handleAddExpense}
            onCancel={() => setShowExpenseForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onAddExpense={() => setShowExpenseForm(true)} />
      
      <main className="px-6 py-6 pb-20">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            title="This Month Spending"
            value={`$${thisMonthSpending.toFixed(2)}`}
            change={spendingChange !== 0 ? `${spendingChange > 0 ? '+' : ''}${spendingChange.toFixed(1)}%` : null}
            trend={spendingChange > 0 ? 'negative' : spendingChange < 0 ? 'positive' : 'neutral'}
            icon="CreditCard"
          />
          <StatCard
            title="Budget Remaining"
            value={`$${Math.abs(remainingBudget).toFixed(2)}`}
            change={remainingBudget < 0 ? "Over budget" : totalBudget > 0 ? `${((remainingBudget / totalBudget) * 100).toFixed(0)}% left` : null}
            trend={remainingBudget < 0 ? 'negative' : 'positive'}
            icon="PieChart"
          />
          <StatCard
            title="Savings Goals"
            value={`${goalCompletionRate.toFixed(0)}%`}
            change={`${goals.length} active goals`}
            trend="positive"
            icon="Target"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SpendingChart expenses={expenses} />
          <CategoryChart expenses={thisMonthExpenses} />
        </div>

        {/* Recent Expenses */}
        <div className="bg-white rounded-lg shadow-card">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Recent Expenses</h2>
            <p className="text-sm text-slate-600 mt-1">Your latest transactions</p>
          </div>
          <div className="divide-y divide-slate-200">
            {expenses.slice(0, 5).map(expense => (
              <div key={expense.Id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    expense.category === 'Food & Dining' ? 'bg-orange-100 text-orange-600' :
                    expense.category === 'Transportation' ? 'bg-blue-100 text-blue-600' :
                    expense.category === 'Housing' ? 'bg-green-100 text-green-600' :
                    expense.category === 'Utilities' ? 'bg-yellow-100 text-yellow-600' :
                    expense.category === 'Entertainment' ? 'bg-purple-100 text-purple-600' :
                    expense.category === 'Healthcare' ? 'bg-red-100 text-red-600' :
                    expense.category === 'Shopping' ? 'bg-pink-100 text-pink-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    <span className="text-sm font-medium">
                      {expense.category.split(' ')[0].charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{expense.description}</p>
                    <div className="flex items-center text-sm text-slate-500">
                      <span>{expense.category}</span>
                      <span className="mx-1">•</span>
                      <span>{format(new Date(expense.date), 'MMM d')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">${expense.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;