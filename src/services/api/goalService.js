const tableName = 'goal_c';

export const goalService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}}
        ],
        orderBy: [{"fieldName": "priority_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching goals:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "category_c"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching goal ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(goalData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: goalData.name || 'Goal',
          name_c: goalData.name,
          target_amount_c: parseFloat(goalData.targetAmount),
          current_amount_c: parseFloat(goalData.currentAmount) || 0,
          deadline_c: goalData.deadline,
          priority_c: parseInt(goalData.priority),
          category_c: goalData.category
        }]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results && response.results[0]) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || 'Failed to create goal');
        }
        return result.data;
      }

      throw new Error('No result returned from create operation');
    } catch (error) {
      console.error("Error creating goal:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, goalData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: goalData.name || 'Goal',
          name_c: goalData.name,
          target_amount_c: parseFloat(goalData.targetAmount),
          current_amount_c: parseFloat(goalData.currentAmount) || 0,
          deadline_c: goalData.deadline,
          priority_c: parseInt(goalData.priority),
          category_c: goalData.category
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results && response.results[0]) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || 'Failed to update goal');
        }
        return result.data;
      }

      throw new Error('No result returned from update operation');
    } catch (error) {
      console.error("Error updating goal:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results && response.results[0]) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || 'Failed to delete goal');
        }
        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting goal:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async updateProgress(id, newAmount) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          current_amount_c: parseFloat(newAmount)
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results && response.results[0]) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || 'Failed to update goal progress');
        }
        return result.data;
      }

      throw new Error('No result returned from update operation');
    } catch (error) {
      console.error("Error updating goal progress:", error?.response?.data?.message || error);
      throw error;
    }
  }
};