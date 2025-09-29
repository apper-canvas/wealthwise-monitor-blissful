const tableName = 'bank_accounts_c';

export const bankAccountService = {
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
          {"field": {"Name": "account_number_c"}},
          {"field": {"Name": "bank_name_c"}},
          {"field": {"Name": "account_type_c"}},
          {"field": {"Name": "currency_c"}},
          {"field": {"Name": "balance_c"}},
          {"field": {"Name": "Tags"}}
        ],
        orderBy: [{"fieldName": "bank_name_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching bank accounts:", error?.response?.data?.message || error);
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
          {"field": {"Name": "account_number_c"}},
          {"field": {"Name": "bank_name_c"}},
          {"field": {"Name": "account_type_c"}},
          {"field": {"Name": "currency_c"}},
          {"field": {"Name": "balance_c"}},
          {"field": {"Name": "Tags"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching bank account ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(accountData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: accountData.name,
          account_number_c: accountData.accountNumber,
          bank_name_c: accountData.bankName,
          account_type_c: accountData.accountType,
          currency_c: accountData.currency || 'USD',
          balance_c: parseFloat(accountData.balance || 0),
          Tags: accountData.tags || ''
        }]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results && response.results[0]) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || 'Failed to create bank account');
        }
        return result.data;
      }

      throw new Error('No result returned from create operation');
    } catch (error) {
      console.error("Error creating bank account:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, accountData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: accountData.name,
          account_number_c: accountData.accountNumber,
          bank_name_c: accountData.bankName,
          account_type_c: accountData.accountType,
          currency_c: accountData.currency || 'USD',
          balance_c: parseFloat(accountData.balance || 0),
          Tags: accountData.tags || ''
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results && response.results[0]) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || 'Failed to update bank account');
        }
        return result.data;
      }

      throw new Error('No result returned from update operation');
    } catch (error) {
      console.error("Error updating bank account:", error?.response?.data?.message || error);
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
          throw new Error(result.message || 'Failed to delete bank account');
        }
        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting bank account:", error?.response?.data?.message || error);
      throw error;
    }
  }
};