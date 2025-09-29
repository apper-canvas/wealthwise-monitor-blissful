import { useState, useEffect } from 'react';
import { budgetService } from '@/services/api/budgetService';
import { toast } from 'react-toastify';

export const useBudget = () => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadActiveBudget = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await budgetService.getActive();
      if (data) {
        // Map database fields to frontend format
        const mappedBudget = {
          Id: data.Id,
          month: data.month_c,
          year: data.year_c,
          categories: data.categories,
          totalBudget: data.total_budget_c,
          isActive: data.is_active_c
        };
        setBudget(mappedBudget);
      } else {
        setBudget(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading budget:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveBudget();
  }, []);

  const createBudget = async (budgetData) => {
    try {
      const newBudget = await budgetService.create(budgetData);
      // Map database fields to frontend format
      const mappedBudget = {
        Id: newBudget.Id,
        month: newBudget.month_c,
        year: newBudget.year_c,
        categories: newBudget.categories,
        totalBudget: newBudget.total_budget_c,
        isActive: newBudget.is_active_c
      };
      setBudget(mappedBudget);
      return mappedBudget;
    } catch (err) {
      toast.error(`Failed to create budget: ${err.message}`);
      throw err;
    }
  };

  const updateBudget = async (id, budgetData) => {
    try {
      const updatedBudget = await budgetService.update(id, budgetData);
      // Map database fields to frontend format
      const mappedBudget = {
        Id: updatedBudget.Id,
        month: updatedBudget.month_c,
        year: updatedBudget.year_c,
        categories: updatedBudget.categories,
        totalBudget: updatedBudget.total_budget_c,
        isActive: updatedBudget.is_active_c
      };
      setBudget(mappedBudget);
      return mappedBudget;
    } catch (err) {
      toast.error(`Failed to update budget: ${err.message}`);
      throw err;
    }
  };

  const deleteBudget = async (id) => {
    try {
      await budgetService.delete(id);
      setBudget(null);
    } catch (err) {
      toast.error(`Failed to delete budget: ${err.message}`);
      throw err;
    }
  };

  return {
    budget,
    loading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    refetch: loadActiveBudget
  };
};