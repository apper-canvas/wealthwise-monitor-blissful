import { useState, useEffect } from 'react';
import { goalService } from '@/services/api/goalService';

export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await goalService.getAll();
      setGoals(data);
    } catch (err) {
      setError('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const addGoal = async (goalData) => {
    const newGoal = await goalService.create(goalData);
    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  };

  const updateGoal = async (id, goalData) => {
    const updatedGoal = await goalService.update(id, goalData);
    setGoals(prev => prev.map(goal => 
      goal.Id === parseInt(id) ? updatedGoal : goal
    ));
    return updatedGoal;
  };

  const deleteGoal = async (id) => {
    await goalService.delete(id);
    setGoals(prev => prev.filter(goal => goal.Id !== parseInt(id)));
  };

  const updateGoalProgress = async (id, newAmount) => {
    const updatedGoal = await goalService.updateProgress(id, newAmount);
    setGoals(prev => prev.map(goal => 
      goal.Id === parseInt(id) ? updatedGoal : goal
    ));
    return updatedGoal;
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