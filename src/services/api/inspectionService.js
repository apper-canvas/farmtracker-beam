class InspectionService {
  constructor() {
    this.tableName = 'inspection_c';
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
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "user_id_c"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      // Transform database field names to match UI expectations
      return response.data.map(inspection => ({
        Id: inspection.Id,
        fieldId: inspection.field_id_c,
        date: inspection.date_c,
        notes: inspection.notes_c,
        status: inspection.status_c,
        userId: inspection.user_id_c
      }));
    } catch (error) {
      console.error("Error fetching inspections:", error?.response?.data?.message || error);
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
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "user_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Inspection not found");
      }

      // Transform database field names to match UI expectations
      const inspection = response.data;
      return {
        Id: inspection.Id,
        fieldId: inspection.field_id_c,
        date: inspection.date_c,
        notes: inspection.notes_c,
        status: inspection.status_c,
        userId: inspection.user_id_c
      };
    } catch (error) {
      console.error(`Error fetching inspection ${id}:`, error?.response?.data?.message || error);
      throw new Error("Inspection not found");
    }
  }

  async getByFieldId(fieldId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "user_id_c"}}
        ],
        where: [{"FieldName": "field_id_c", "Operator": "EqualTo", "Values": [parseInt(fieldId)]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      // Transform database field names to match UI expectations
      return response.data.map(inspection => ({
        Id: inspection.Id,
        fieldId: inspection.field_id_c,
        date: inspection.date_c,
        notes: inspection.notes_c,
        status: inspection.status_c,
        userId: inspection.user_id_c
      }));
    } catch (error) {
      console.error(`Error fetching inspections for field ${fieldId}:`, error?.response?.data?.message || error);
      return [];
    }
  }

  async create(inspectionData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `Inspection ${new Date().toLocaleDateString()}`,
          field_id_c: parseInt(inspectionData.fieldId),
          date_c: inspectionData.date || new Date().toISOString(),
          notes_c: inspectionData.notes,
          status_c: inspectionData.status,
          user_id_c: inspectionData.userId || 1 // Default to system user
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
          throw new Error(failed[0].message || 'Failed to create inspection');
        }
        
        const created = successful[0]?.data;
        return {
          Id: created.Id,
          fieldId: created.field_id_c,
          date: created.date_c,
          notes: created.notes_c,
          status: created.status_c,
          userId: created.user_id_c
        };
      }
    } catch (error) {
      console.error("Error creating inspection:", error?.response?.data?.message || error);
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

      const updateData = {
        Id: parseInt(id)
      };

      // Map UI field names to database field names
      if (data.fieldId !== undefined) updateData.field_id_c = parseInt(data.fieldId);
      if (data.date !== undefined) updateData.date_c = data.date;
      if (data.notes !== undefined) updateData.notes_c = data.notes;
      if (data.status !== undefined) updateData.status_c = data.status;
      if (data.userId !== undefined) updateData.user_id_c = data.userId;

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
          throw new Error(failed[0].message || 'Failed to update inspection');
        }
        
        const updated = successful[0]?.data;
        return {
          Id: updated.Id,
          fieldId: updated.field_id_c,
          date: updated.date_c,
          notes: updated.notes_c,
          status: updated.status_c,
          userId: updated.user_id_c
        };
      }
    } catch (error) {
      console.error("Error updating inspection:", error?.response?.data?.message || error);
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
          throw new Error(failed[0].message || 'Failed to delete inspection');
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting inspection:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

const inspectionService = new InspectionService();
export default inspectionService;

export default new InspectionService();