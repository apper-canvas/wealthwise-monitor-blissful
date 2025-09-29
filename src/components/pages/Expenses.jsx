import React, { useState } from 'react';
import Header from '@/components/organisms/Header';
import ExpenseList from '@/components/organisms/ExpenseList';
import ExpenseForm from '@/components/organisms/ExpenseForm';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { useExpenses } from '@/hooks/useExpenses';

const Expenses = () => {
  const { expenses, loading, error, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  if (loading) {
    return <Loading type="list" />;
  }

  if (error) {
    return <Error message={error} />;
  }

  const handleAddExpense = async (expenseData) => {
    await addExpense(expenseData);
    setShowExpenseForm(false);
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleUpdateExpense = async (expenseData) => {
    await updateExpense(editingExpense.Id, expenseData);
    setEditingExpense(null);
    setShowExpenseForm(false);
  };

  const handleCancelForm = () => {
    setEditingExpense(null);
    setShowExpenseForm(false);
  };

  if (showExpenseForm) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={handleCancelForm}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Expenses
            </button>
          </div>
          <ExpenseForm 
            onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
            onCancel={handleCancelForm}
            initialData={editingExpense}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onAddExpense={() => setShowExpenseForm(true)} />
      
      <main className="px-6 py-6 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
          <p className="text-slate-600 mt-1">Track and manage your spending</p>
        </div>

        <ExpenseList
          expenses={expenses}
          onEdit={handleEditExpense}
          onDelete={deleteExpense}
          loading={loading}
        />
      </main>
    </div>
  );
};

export default Expenses;