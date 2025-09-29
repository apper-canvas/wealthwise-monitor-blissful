import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ProgressBar from '@/components/molecules/ProgressBar';
import ApperIcon from '@/components/ApperIcon';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'react-toastify';
import { cn } from '@/utils/cn';

const GoalsList = ({ goals, onEdit, onDelete, onAddProgress, loading = false }) => {
  const handleDelete = async (goal) => {
    if (window.confirm(`Are you sure you want to delete "${goal.name}"?`)) {
      try {
        await onDelete(goal.Id);
        toast.success("Goal deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete goal");
      }
    }
  };

  const handleQuickAdd = async (goal, amount) => {
    const newAmount = goal.currentAmount + amount;
    if (newAmount > goal.targetAmount) {
      toast.error("Cannot exceed target amount");
      return;
    }

    try {
      await onAddProgress(goal.Id, newAmount);
      toast.success(`$${amount} added to ${goal.name}!`);
    } catch (error) {
      toast.error("Failed to add progress");
    }
  };

  const getDaysRemaining = (deadline) => {
    return differenceInDays(new Date(deadline), new Date());
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1: return 'text-red-600 bg-red-100';
      case 2: return 'text-yellow-600 bg-yellow-100';
      case 3: return 'text-green-600 bg-green-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 1: return 'High';
      case 2: return 'Medium';
      case 3: return 'Low';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-3">
                <div className="w-full bg-slate-200 rounded-full h-2"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ApperIcon name="Target" className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Savings Goals</h3>
          <p className="text-slate-600 mb-4">
            Create your first savings goal to start building your financial future.
          </p>
        </CardContent>
      </Card>
    );
  }

  const sortedGoals = [...goals].sort((a, b) => {
    // Sort by priority first, then by deadline
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return new Date(a.deadline) - new Date(b.deadline);
  });

  return (
    <div className="space-y-4">
      {sortedGoals.map(goal => {
        const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
        const daysRemaining = getDaysRemaining(goal.deadline);
        const isCompleted = goal.currentAmount >= goal.targetAmount;
        const isOverdue = daysRemaining < 0 && !isCompleted;

        return (
          <Card key={goal.Id} className={cn(
            "hover:shadow-card-hover transition-all duration-200",
            isCompleted && "ring-2 ring-success-500 bg-success-50"
          )}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center">
                    <ApperIcon name="Target" className="w-5 h-5 mr-2 text-primary-600" />
                    {goal.name}
                    {isCompleted && (
                      <ApperIcon name="CheckCircle" className="w-5 h-5 ml-2 text-success-600" />
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getPriorityColor(goal.priority)
                    )}>
                      {getPriorityLabel(goal.priority)} Priority
                    </span>
                    <span className="text-sm text-slate-600">{goal.category}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(goal)}
                    className="p-1"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(goal)}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                    <span>Progress</span>
                    <span>${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</span>
                  </div>
                  <ProgressBar
                    value={goal.currentAmount}
                    max={goal.targetAmount}
                    showPercentage={true}
                  />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div>
                    <span className="text-slate-600">Deadline: </span>
                    <span className={cn(
                      "font-medium",
                      isOverdue ? "text-red-600" : "text-slate-900"
                    )}>
                      {format(new Date(goal.deadline), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className={cn(
                    "font-medium",
                    isOverdue ? "text-red-600" : 
                    daysRemaining <= 30 ? "text-yellow-600" : "text-slate-600"
                  )}>
                    {isOverdue 
                      ? `${Math.abs(daysRemaining)} days overdue`
                      : isCompleted 
                        ? "Completed!"
                        : `${daysRemaining} days left`
                    }
                  </div>
                </div>

                {!isCompleted && (
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd(goal, 25)}
                      className="flex-1 text-xs"
                    >
                      +$25
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd(goal, 50)}
                      className="flex-1 text-xs"
                    >
                      +$50
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAdd(goal, 100)}
                      className="flex-1 text-xs"
                    >
                      +$100
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default GoalsList;