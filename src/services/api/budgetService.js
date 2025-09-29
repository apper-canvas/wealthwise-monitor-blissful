const tableName = 'budget_c';

export const budgetService = {
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
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "categories_c"}},
          {"field": {"Name": "total_budget_c"}},
          {"field": {"Name": "is_active_c"}}
        ],
        orderBy: [{"fieldName": "year_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

return (response.data || []).map(budget => ({
        ...budget,
        categories: budget.categories_c ? (() => {
          try {
            return JSON.parse(budget.categories_c);
          } catch (error) {
            console.error('Failed to parse categories JSON:', error.message, 'Data:', budget.categories_c);
            return {};
          }
        })() : {}
      }));
    } catch (error) {
      console.error("Error fetching budgets:", error?.response?.data?.message || error);
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
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "categories_c"}},
          {"field": {"Name": "total_budget_c"}},
          {"field": {"Name": "is_active_c"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      const budget = response.data;
return {
        ...budget,
        categories: budget.categories_c ? (() => {
          try {
            return JSON.parse(budget.categories_c);
          } catch (error) {
            console.error('Failed to parse categories JSON:', error.message, 'Data:', budget.categories_c);
            return {};
          }
        })() : {}
      };
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async getActive() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "categories_c"}},
          {"field": {"Name": "total_budget_c"}},
          {"field": {"Name": "is_active_c"}}
        ],
        where: [{"FieldName": "is_active_c", "Operator": "EqualTo", "Values": [true]}],
        pagingInfo: {"limit": 1, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        return null;
      }

      const budget = response.data[0];
return {
        ...budget,
        categories: budget.categories_c ? (() => {
          try {
            return JSON.parse(budget.categories_c);
          } catch (error) {
            console.error('Failed to parse categories JSON:', error.message, 'Data:', budget.categories_c);
            return {};
          }
        })() : {}
      };
    } catch (error) {
      console.error("Error fetching active budget:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(budgetData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First deactivate other budgets
      await this._deactivateOtherBudgets();

      const params = {
        records: [{
          Name: `${budgetData.month} ${budgetData.year} Budget`,
          month_c: budgetData.month,
          year_c: parseInt(budgetData.year),
          categories_c: JSON.stringify(budgetData.categories || {}),
          total_budget_c: parseFloat(budgetData.totalBudget),
          is_active_c: true
        }]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results && response.results[0]) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || 'Failed to create budget');
        }
        return {
...result.data,
          categories: (() => {
            try {
              return JSON.parse(result.data.categories_c || '{}');
            } catch (error) {
              console.error('Failed to parse categories JSON:', error.message, 'Data:', result.data.categories_c);
              return {};
            }
          })()
        };
      }

      throw new Error('No result returned from create operation');
    } catch (error) {
      console.error("Error creating budget:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, budgetData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: `${budgetData.month} ${budgetData.year} Budget`,
          month_c: budgetData.month,
          year_c: parseInt(budgetData.year),
          categories_c: JSON.stringify(budgetData.categories || {}),
          total_budget_c: parseFloat(budgetData.totalBudget),
          is_active_c: budgetData.isActive !== undefined ? budgetData.isActive : true
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results && response.results[0]) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || 'Failed to update budget');
        }
        return {
...result.data,
          categories: (() => {
            try {
              return JSON.parse(result.data.categories_c || '{}');
            } catch (error) {
              console.error('Failed to parse categories JSON:', error.message, 'Data:', result.data.categories_c);
              return {};
            }
          })()
        };
      }

      throw new Error('No result returned from update operation');
    } catch (error) {
      console.error("Error updating budget:", error?.response?.data?.message || error);
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
          throw new Error(result.message || 'Failed to delete budget');
        }
        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting budget:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async _deactivateOtherBudgets() {
    try {
      const allBudgets = await this.getAll();
      const activeBudgets = allBudgets.filter(b => b.is_active_c);
      
      if (activeBudgets.length > 0) {
        const { ApperClient } = window.ApperSDK;
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });

        const params = {
          records: activeBudgets.map(budget => ({
            Id: budget.Id,
            is_active_c: false
          }))
        };

        await apperClient.updateRecord(tableName, params);
      }
    } catch (error) {
      console.error("Error deactivating other budgets:", error);
    }
  }
};