class FieldService {
  constructor() {
    this.tableName = 'field_c';
  }

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
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "crop_type_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "growth_stage_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "last_inspection_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching fields:", error?.response?.data?.message || error);
      return [];
    }
  }

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
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "crop_type_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "growth_stage_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "last_inspection_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Field not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching field ${id}:`, error?.response?.data?.message || error);
      throw new Error("Field not found");
    }
  }

  async create(fieldData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI field names to database field names and include only Updateable fields
      const params = {
        records: [{
          Name: fieldData.name || fieldData.Name,
          name_c: fieldData.name || fieldData.Name,
          size_c: parseFloat(fieldData.size),
          crop_type_c: fieldData.cropType,
          planting_date_c: fieldData.plantingDate,
          growth_stage_c: fieldData.growthStage,
          status_c: fieldData.status,
          last_inspection_c: fieldData.lastInspection || new Date().toISOString().split('T')[0],
          notes_c: Array.isArray(fieldData.notes) ? fieldData.notes.join('\n') : fieldData.notes || ''
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
          throw new Error(failed[0].message || 'Failed to create field');
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating field:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Map UI field names to database field names and include only Updateable fields
      const updateData = {
        Id: parseInt(id)
      };

      if (data.name !== undefined) updateData.name_c = data.name;
      if (data.size !== undefined) updateData.size_c = parseFloat(data.size);
      if (data.cropType !== undefined) updateData.crop_type_c = data.cropType;
      if (data.plantingDate !== undefined) updateData.planting_date_c = data.plantingDate;
      if (data.growthStage !== undefined) updateData.growth_stage_c = data.growthStage;
      if (data.status !== undefined) updateData.status_c = data.status;
      if (data.lastInspection !== undefined) updateData.last_inspection_c = data.lastInspection;
      if (data.notes !== undefined) updateData.notes_c = Array.isArray(data.notes) ? data.notes.join('\n') : data.notes;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => console.error(`${error.fieldLabel}: ${error}`));
          });
          throw new Error(failed[0].message || 'Failed to update field');
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating field:", error?.response?.data?.message || error);
      throw error;
    }
  }

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

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records:`, failed);
          failed.forEach(record => {
            if (record.message) console.error(record.message);
          });
          throw new Error(failed[0].message || 'Failed to delete field');
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting field:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

const fieldService = new FieldService();
export default fieldService;