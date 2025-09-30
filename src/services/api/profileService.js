const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const profileService = {
  async getProfile() {
    await delay(300);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "name_c" } },
          { field: { Name: "avatar_url_c" } },
          { field: { Name: "website_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [{ fieldName: "ModifiedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 1, offset: 0 }
      };

      const response = await apperClient.fetchRecords('profiles_c', params);
      
      if (!response.success) {
        console.error('Profile fetch failed:', response.message);
        throw new Error(response.message || 'Failed to fetch profile');
      }

      // Return first profile or null if none found
      return response.data && response.data.length > 0 ? response.data[0] : null;
      
    } catch (error) {
      console.error('Error fetching profile:', error?.response?.data?.message || error.message || error);
      throw error;
    }
  },

  async updateProfile(profileData) {
    await delay(300);
    
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First try to get existing profile
      const existingProfile = await this.getProfile();
      
      // Prepare data with only updateable fields
      const updateData = {
        name_c: profileData.name_c,
        avatar_url_c: profileData.avatar_url_c || null,
        website_c: profileData.website_c || null,
        updated_at_c: profileData.updated_at_c || new Date().toISOString()
      };

      let response;

      if (existingProfile && existingProfile.Id) {
        // Update existing profile
        const params = {
          records: [{
            Id: existingProfile.Id,
            ...updateData
          }]
        };
        
        response = await apperClient.updateRecord('profiles_c', params);
        
        if (!response.success) {
          console.error('Profile update failed:', response.message);
          throw new Error(response.message || 'Failed to update profile');
        }

        if (response.results) {
          const successful = response.results.filter(r => r.success);
          const failed = response.results.filter(r => !r.success);
          
          if (failed.length > 0) {
            console.error(`Failed to update profile:`, failed);
            failed.forEach(record => {
              if (record.errors) {
                record.errors.forEach(error => {
                  throw new Error(`${error.fieldLabel}: ${error.message}`);
                });
              }
              if (record.message) {
                throw new Error(record.message);
              }
            });
          }
          
          return successful.length > 0 ? successful[0].data : null;
        }
      } else {
        // Create new profile
        const params = {
          records: [updateData]
        };
        
        response = await apperClient.createRecord('profiles_c', params);
        
        if (!response.success) {
          console.error('Profile creation failed:', response.message);
          throw new Error(response.message || 'Failed to create profile');
        }

        if (response.results) {
          const successful = response.results.filter(r => r.success);
          const failed = response.results.filter(r => !r.success);
          
          if (failed.length > 0) {
            console.error(`Failed to create profile:`, failed);
            failed.forEach(record => {
              if (record.errors) {
                record.errors.forEach(error => {
                  throw new Error(`${error.fieldLabel}: ${error.message}`);
                });
              }
              if (record.message) {
                throw new Error(record.message);
              }
            });
          }
          
          return successful.length > 0 ? successful[0].data : null;
        }
      }
      
      return null;
      
    } catch (error) {
      console.error('Error updating profile:', error?.response?.data?.message || error.message || error);
      throw error;
    }
  }
};

export { profileService };