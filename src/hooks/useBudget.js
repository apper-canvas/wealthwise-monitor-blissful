import { useState, useEffect } from 'react';
import { budgetService } from '@/services/api/budgetService';

export const useBudget = () => {
  const [budget, setBudget] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBudget = async () => {
    try {
      setLoading(true);
      setError('');
      const [activeBudget, allBudgets] = await Promise.all([
        budgetService.getActive(),
        budgetService.getAll()
      ]);
      setBudget(activeBudget);
      setBudgets(allBudgets);
    } catch (err) {
      setError('Failed to load budget');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudget();
  }, []);

  const createBudget = async (budgetData) => {
    const newBudget = await budgetService.create(budgetData);
    setBudget(newBudget);
    setBudgets(prev => [...prev, newBudget]);
    return newBudget;
  };

  const updateBudget = async (id, budgetData) => {
    const updatedBudget = await budgetService.update(id, budgetData);
    setBudget(updatedBudget);
    setBudgets(prev => prev.map(b => b.Id === parseInt(id) ? updatedBudget : b));
    return updatedBudget;
  };

  const deleteBudget = async (id) => {
    await budgetService.delete(id);
    setBudgets(prev => prev.filter(b => b.Id !== parseInt(id)));
    if (budget && budget.Id === parseInt(id)) {
      setBudget(null);
    }
  };

  return {
    budget,
    budgets,
    loading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    refetch: loadBudget
  };
};