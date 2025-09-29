import React, { useState } from 'react';
import Header from '@/components/organisms/Header';
import GoalForm from '@/components/organisms/GoalForm';
import GoalsList from '@/components/organisms/GoalsList';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { useGoals } from '@/hooks/useGoals';

const Goals = () => {
  const { goals, loading, error, addGoal, updateGoal, deleteGoal, updateGoalProgress } = useGoals();
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  if (loading) {
    return <Loading type="list" />;
  }

  if (error) {
    return <Error message={error} />;
  }

  const handleAddGoal = async (goalData) => {
    await addGoal(goalData);
    setShowGoalForm(false);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowGoalForm(true);
  };

  const handleUpdateGoal = async (goalData) => {
    await updateGoal(editingGoal.Id, goalData);
    setEditingGoal(null);
    setShowGoalForm(false);
  };

  const handleCancelForm = () => {
    setEditingGoal(null);
    setShowGoalForm(false);
  };

  if (showGoalForm) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="mb-6">
            <button
              onClick={handleCancelForm}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Goals
            </button>
          </div>
          <GoalForm 
            onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}
            onCancel={handleCancelForm}
            initialData={editingGoal}
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
            <h1 className="text-2xl font-bold text-slate-900">Savings Goals</h1>
            <p className="text-slate-600 mt-1">Set and track your financial objectives</p>
          </div>
          <Button onClick={() => setShowGoalForm(true)}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Goal
          </Button>
        </div>

        <GoalsList
          goals={goals}
          onEdit={handleEditGoal}
          onDelete={deleteGoal}
          onAddProgress={updateGoalProgress}
          loading={loading}
        />
      </main>
    </div>
  );
};

export default Goals;