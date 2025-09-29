import { useState, useEffect } from 'react';
import { goalService } from '@/services/api/goalService';
import { toast } from 'react-toastify';

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadGoals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await goalService.getAll();
      // Map database fields to frontend format
      const mappedData = data.map(goal => ({
        Id: goal.Id,
        name: goal.name_c,
        targetAmount: goal.target_amount_c,
        currentAmount: goal.current_amount_c,
        deadline: goal.deadline_c,
        priority: goal.priority_c,
        category: goal.category_c
      }));
      setGoals(mappedData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const addGoal = async (goalData) => {
    try {
      const newGoal = await goalService.create(goalData);
      // Map database fields to frontend format
      const mappedGoal = {
        Id: newGoal.Id,
        name: newGoal.name_c,
        targetAmount: newGoal.target_amount_c,
        currentAmount: newGoal.current_amount_c,
        deadline: newGoal.deadline_c,
        priority: newGoal.priority_c,
        category: newGoal.category_c
      };
      setGoals(prev => [...prev, mappedGoal]);
      return mappedGoal;
    } catch (err) {
      toast.error(`Failed to add goal: ${err.message}`);
      throw err;
    }
  };

  const updateGoal = async (id, goalData) => {
    try {
      const updatedGoal = await goalService.update(id, goalData);
      // Map database fields to frontend format
      const mappedGoal = {
        Id: updatedGoal.Id,
        name: updatedGoal.name_c,
        targetAmount: updatedGoal.target_amount_c,
        currentAmount: updatedGoal.current_amount_c,
        deadline: updatedGoal.deadline_c,
        priority: updatedGoal.priority_c,
        category: updatedGoal.category_c
      };
      setGoals(prev => 
        prev.map(goal => goal.Id === id ? mappedGoal : goal)
      );
      return mappedGoal;
    } catch (err) {
      toast.error(`Failed to update goal: ${err.message}`);
      throw err;
    }
  };

  const deleteGoal = async (id) => {
    try {
      await goalService.delete(id);
      setGoals(prev => prev.filter(goal => goal.Id !== id));
    } catch (err) {
      toast.error(`Failed to delete goal: ${err.message}`);
      throw err;
    }
  };

  const updateGoalProgress = async (id, newAmount) => {
    try {
      const updatedGoal = await goalService.updateProgress(id, newAmount);
      // Map database fields to frontend format
      const mappedGoal = {
        Id: updatedGoal.Id,
        name: updatedGoal.name_c,
        targetAmount: updatedGoal.target_amount_c,
        currentAmount: updatedGoal.current_amount_c,
        deadline: updatedGoal.deadline_c,
        priority: updatedGoal.priority_c,
        category: updatedGoal.category_c
      };
      setGoals(prev => 
        prev.map(goal => goal.Id === id ? mappedGoal : goal)
      );
      return mappedGoal;
    } catch (err) {
      toast.error(`Failed to update goal progress: ${err.message}`);
      throw err;
    }
  };

  return {
    goals,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    updateGoalProgress,
    refetch: loadGoals
  };
};