const tableName = 'expense_c';

export const expenseService = {
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
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching expenses:", error?.response?.data?.message || error);
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
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };

      const response = await apperClient.getRecordById(tableName, parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching expense ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
},

  async create(expenseData) {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    try {
      // Create expense first
      const params = {
        records: [{
          amount_c: expenseData.amount,
          category_c: expenseData.category,
          description_c: expenseData.description,
date_c: expenseData.date, // Use correct field name from schema
          created_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        throw new Error(response.message);
      }

      const createdExpense = response.results?.[0]?.data;
      
      // Try to send SMS notification (non-blocking)
      try {
        // Get user's phone number from profile
        const { profileService } = await import('./profileService');
        const profile = await profileService.getProfile();
        
        if (profile?.phone_number_c) {
          // Send SMS via Edge function
          const smsResult = await apperClient.functions.invoke(import.meta.env.VITE_SEND_EXPENSE_SMS, {
            body: JSON.stringify({
              phoneNumber: profile.phone_number_c,
              expenseData: {
                amount: expenseData.amount,
                category: expenseData.category,
                description: expenseData.description,
                date: expenseData.date
              }
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          // Log SMS result for debugging (don't throw on SMS failure)
          if (smsResult?.success) {
            console.info('apper_info: SMS notification sent successfully for expense creation');
          } else {
            console.info(`apper_info: SMS notification failed for expense creation: ${JSON.stringify(smsResult)}`);
          }
        }
      } catch (smsError) {
        // Log SMS error but don't fail expense creation
        console.info(`apper_info: An error occurred sending SMS notification: ${smsError.message}`);
      }

      return createdExpense;
    } catch (error) {
      throw new Error(error.message || 'Failed to create expense');
    }
  },

  async update(id, expenseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: expenseData.description || 'Expense',
          amount_c: parseFloat(expenseData.amount),
          category_c: expenseData.category,
          description_c: expenseData.description,
          date_c: expenseData.date
        }]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results && response.results[0]) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || 'Failed to update expense');
        }
        return result.data;
      }

      throw new Error('No result returned from update operation');
    } catch (error) {
      console.error("Error updating expense:", error?.response?.data?.message || error);
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
          throw new Error(result.message || 'Failed to delete expense');
        }
        return { success: true };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting expense:", error?.response?.data?.message || error);
      throw error;
    }
  }
};