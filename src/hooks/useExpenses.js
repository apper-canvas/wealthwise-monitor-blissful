import { useState, useEffect } from 'react';
import { expenseService } from '@/services/api/expenseService';
import { toast } from 'react-toastify';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expenseService.getAll();
      // Map database fields to frontend format
      const mappedData = data.map(expense => ({
        Id: expense.Id,
        amount: expense.amount_c,
        category: expense.category_c,
        description: expense.description_c,
        date: expense.date_c,
        createdAt: expense.created_at_c
      }));
      setExpenses(mappedData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const addExpense = async (expenseData) => {
    try {
      const newExpense = await expenseService.create(expenseData);
      // Map database fields to frontend format
      const mappedExpense = {
        Id: newExpense.Id,
        amount: newExpense.amount_c,
        category: newExpense.category_c,
        description: newExpense.description_c,
        date: newExpense.date_c,
        createdAt: newExpense.created_at_c
      };
      setExpenses(prev => [mappedExpense, ...prev]);
      return mappedExpense;
    } catch (err) {
      toast.error(`Failed to add expense: ${err.message}`);
      throw err;
    }
  };

  const updateExpense = async (id, expenseData) => {
    try {
      const updatedExpense = await expenseService.update(id, expenseData);
      // Map database fields to frontend format
      const mappedExpense = {
        Id: updatedExpense.Id,
        amount: updatedExpense.amount_c,
        category: updatedExpense.category_c,
        description: updatedExpense.description_c,
        date: updatedExpense.date_c,
        createdAt: updatedExpense.created_at_c
      };
      setExpenses(prev => 
        prev.map(expense => expense.Id === id ? mappedExpense : expense)
      );
      return mappedExpense;
    } catch (err) {
      toast.error(`Failed to update expense: ${err.message}`);
      throw err;
    }
  };

  const deleteExpense = async (id) => {
    try {
      await expenseService.delete(id);
      setExpenses(prev => prev.filter(expense => expense.Id !== id));
    } catch (err) {
      toast.error(`Failed to delete expense: ${err.message}`);
      throw err;
    }
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