import React, { useState } from 'react';
import Header from '@/components/organisms/Header';
import BudgetForm from '@/components/organisms/BudgetForm';
import BudgetOverview from '@/components/organisms/BudgetOverview';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { useExpenses } from '@/hooks/useExpenses';
import { useBudget } from '@/hooks/useBudget';

const Budget = () => {
  const { expenses, loading: expensesLoading } = useExpenses();
  const { budget, loading: budgetLoading, error, createBudget, updateBudget } = useBudget();
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  const loading = expensesLoading || budgetLoading;

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} />;
  }

  const handleCreateBudget = async (budgetData) => {
    await createBudget(budgetData);
    setShowBudgetForm(false);
  };

  const handleUpdateBudget = async (budgetData) => {
    await updateBudget(budget.Id, budgetData);
    setShowBudgetForm(false);
  };

  if (showBudgetForm) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={() => setShowBudgetForm(false)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Budget
            </button>
          </div>
          <BudgetForm 
            onSubmit={budget ? handleUpdateBudget : handleCreateBudget}
            onCancel={() => setShowBudgetForm(false)}
            initialData={budget}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="px-6 py-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Budget</h1>
            <p className="text-slate-600 mt-1">Monitor your spending limits and track progress</p>
          </div>
          <Button
            onClick={() => setShowBudgetForm(true)}
            variant={budget ? "outline" : "primary"}
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {budget ? 'Edit Budget' : 'Create Budget'}
          </Button>
        </div>

        <BudgetOverview 
          budget={budget} 
          expenses={expenses} 
          loading={loading} 
        />
      </main>
    </div>
  );
};

export default Budget;