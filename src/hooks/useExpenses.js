import { useState, useEffect } from 'react';
import { expenseService } from '@/services/api/expenseService';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await expenseService.getAll();
      setExpenses(data);
    } catch (err) {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const addExpense = async (expenseData) => {
    const newExpense = await expenseService.create(expenseData);
    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  };

  const updateExpense = async (id, expenseData) => {
    const updatedExpense = await expenseService.update(id, expenseData);
    setExpenses(prev => prev.map(expense => 
      expense.Id === parseInt(id) ? updatedExpense : expense
    ));
    return updatedExpense;
  };

  const deleteExpense = async (id) => {
    await expenseService.delete(id);
    setExpenses(prev => prev.filter(expense => expense.Id !== parseInt(id)));
  };

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refetch: loadExpenses
  };
};