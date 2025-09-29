import expensesData from '@/services/mockData/expenses.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let expenses = [...expensesData];

export const expenseService = {
  async getAll() {
    await delay(300);
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getById(id) {
    await delay(200);
    const expense = expenses.find(item => item.Id === parseInt(id));
    if (!expense) {
      throw new Error('Expense not found');
    }
    return { ...expense };
  },

  async create(expenseData) {
    await delay(400);
    const highestId = expenses.reduce((max, item) => Math.max(max, item.Id), 0);
    const newExpense = {
      ...expenseData,
      Id: highestId + 1,
      createdAt: new Date().toISOString()
    };
    expenses.push(newExpense);
    return { ...newExpense };
  },

  async update(id, expenseData) {
    await delay(350);
    const index = expenses.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Expense not found');
    }
    expenses[index] = { ...expenses[index], ...expenseData };
    return { ...expenses[index] };
  },

  async delete(id) {
    await delay(250);
    const index = expenses.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Expense not found');
    }
    expenses.splice(index, 1);
    return { success: true };
  }
};