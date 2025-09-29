import budgetsData from '@/services/mockData/budgets.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let budgets = [...budgetsData];

export const budgetService = {
  async getAll() {
    await delay(300);
    return [...budgets];
  },

  async getById(id) {
    await delay(200);
    const budget = budgets.find(item => item.Id === parseInt(id));
    if (!budget) {
      throw new Error('Budget not found');
    }
    return { ...budget };
  },

  async getActive() {
    await delay(250);
    const activeBudget = budgets.find(budget => budget.isActive);
    return activeBudget ? { ...activeBudget } : null;
  },

  async create(budgetData) {
    await delay(400);
    // Deactivate other budgets first
    budgets = budgets.map(budget => ({ ...budget, isActive: false }));
    
    const highestId = budgets.reduce((max, item) => Math.max(max, item.Id), 0);
    const newBudget = {
      ...budgetData,
      Id: highestId + 1,
      isActive: true
    };
    budgets.push(newBudget);
    return { ...newBudget };
  },

  async update(id, budgetData) {
    await delay(350);
    const index = budgets.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Budget not found');
    }
    budgets[index] = { ...budgets[index], ...budgetData };
    return { ...budgets[index] };
  },

  async delete(id) {
    await delay(250);
    const index = budgets.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Budget not found');
    }
    budgets.splice(index, 1);
    return { success: true };
  }
};