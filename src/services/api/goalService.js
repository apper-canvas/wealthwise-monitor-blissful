import goalsData from '@/services/mockData/goals.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let goals = [...goalsData];

export const goalService = {
  async getAll() {
    await delay(300);
    return [...goals];
  },

  async getById(id) {
    await delay(200);
    const goal = goals.find(item => item.Id === parseInt(id));
    if (!goal) {
      throw new Error('Goal not found');
    }
    return { ...goal };
  },

  async create(goalData) {
    await delay(400);
    const highestId = goals.reduce((max, item) => Math.max(max, item.Id), 0);
    const newGoal = {
      ...goalData,
      Id: highestId + 1
    };
    goals.push(newGoal);
    return { ...newGoal };
  },

  async update(id, goalData) {
    await delay(350);
    const index = goals.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Goal not found');
    }
    goals[index] = { ...goals[index], ...goalData };
    return { ...goals[index] };
  },

  async delete(id) {
    await delay(250);
    const index = goals.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Goal not found');
    }
    goals.splice(index, 1);
    return { success: true };
  },

  async updateProgress(id, newAmount) {
    await delay(300);
    const index = goals.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Goal not found');
    }
    goals[index].currentAmount = newAmount;
    return { ...goals[index] };
  }
};