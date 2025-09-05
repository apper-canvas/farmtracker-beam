class CropScheduleService {
  constructor() {
    this.tableName = 'crop_schedule_c';
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
          {"field": {"Name": "crop_name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "expected_yield_c"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      // Transform database field names to match UI expectations
      return response.data.map(schedule => ({
        Id: schedule.Id,
        cropName: schedule.crop_name_c,
        variety: schedule.variety_c,
        type: schedule.type_c,
        date: schedule.date_c,
        fieldId: schedule.field_id_c,
        notes: schedule.notes_c,
        createdAt: schedule.created_at_c,
        expectedYield: schedule.expected_yield_c
      }));
    } catch (error) {
      console.error("Error fetching crop schedules:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByMonth(year, month) {
    try {
      const allSchedules = await this.getAll();
      return allSchedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate.getFullYear() === year && scheduleDate.getMonth() === month;
      });
    } catch (error) {
      console.error(`Error fetching crop schedules for ${year}-${month}:`, error?.response?.data?.message || error);
      return [];
    }
  }

  async getBySeason(season) {
    try {
      const seasonMonths = {
        Spring: [2, 3, 4], // Mar, Apr, May
        Summer: [5, 6, 7], // Jun, Jul, Aug
        Fall: [8, 9, 10],  // Sep, Oct, Nov
        Winter: [11, 0, 1] // Dec, Jan, Feb
      };
      
      const allSchedules = await this.getAll();
      return allSchedules.filter(schedule => {
        const scheduleDate = new Date(schedule.date);
        return seasonMonths[season].includes(scheduleDate.getMonth());
      });
    } catch (error) {
      console.error(`Error fetching crop schedules for ${season}:`, error?.response?.data?.message || error);
      return [];
    }
  }

  async getByField(fieldId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "crop_name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "expected_yield_c"}}
        ],
        where: [{"FieldName": "field_id_c", "Operator": "EqualTo", "Values": [parseInt(fieldId)]}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      // Transform database field names to match UI expectations
      return response.data.map(schedule => ({
        Id: schedule.Id,
        cropName: schedule.crop_name_c,
        variety: schedule.variety_c,
        type: schedule.type_c,
        date: schedule.date_c,
        fieldId: schedule.field_id_c,
        notes: schedule.notes_c,
        createdAt: schedule.created_at_c,
        expectedYield: schedule.expected_yield_c
      }));
    } catch (error) {
      console.error(`Error fetching crop schedules for field ${fieldId}:`, error?.response?.data?.message || error);
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
          {"field": {"Name": "crop_name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "field_id_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "expected_yield_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        throw new Error("Crop schedule not found");
      }

      // Transform database field names to match UI expectations
      const schedule = response.data;
      return {
        Id: schedule.Id,
        cropName: schedule.crop_name_c,
        variety: schedule.variety_c,
        type: schedule.type_c,
        date: schedule.date_c,
        fieldId: schedule.field_id_c,
        notes: schedule.notes_c,
        createdAt: schedule.created_at_c,
        expectedYield: schedule.expected_yield_c
      };
    } catch (error) {
      console.error(`Error fetching crop schedule ${id}:`, error?.response?.data?.message || error);
      throw new Error("Crop schedule not found");
    }
  }

  async create(scheduleData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: `${scheduleData.cropName} ${scheduleData.type}`,
          crop_name_c: scheduleData.cropName,
          variety_c: scheduleData.variety || '',
          type_c: scheduleData.type,
          date_c: scheduleData.date,
          field_id_c: parseInt(scheduleData.fieldId),
          notes_c: scheduleData.notes || '',
          created_at_c: new Date().toISOString(),
          expected_yield_c: scheduleData.expectedYield || ''
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
          throw new Error(failed[0].message || 'Failed to create crop schedule');
        }
        
        const created = successful[0]?.data;
        return {
          Id: created.Id,
          cropName: created.crop_name_c,
          variety: created.variety_c,
          type: created.type_c,
          date: created.date_c,
          fieldId: created.field_id_c,
          notes: created.notes_c,
          createdAt: created.created_at_c,
          expectedYield: created.expected_yield_c
        };
      }
    } catch (error) {
      console.error("Error creating crop schedule:", error?.response?.data?.message || error);
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
      if (data.cropName !== undefined) updateData.crop_name_c = data.cropName;
      if (data.variety !== undefined) updateData.variety_c = data.variety;
      if (data.type !== undefined) updateData.type_c = data.type;
      if (data.date !== undefined) updateData.date_c = data.date;
      if (data.fieldId !== undefined) updateData.field_id_c = parseInt(data.fieldId);
      if (data.notes !== undefined) updateData.notes_c = data.notes;
      if (data.expectedYield !== undefined) updateData.expected_yield_c = data.expectedYield;

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
          throw new Error(failed[0].message || 'Failed to update crop schedule');
        }
        
        const updated = successful[0]?.data;
        return {
          Id: updated.Id,
          cropName: updated.crop_name_c,
          variety: updated.variety_c,
          type: updated.type_c,
          date: updated.date_c,
          fieldId: updated.field_id_c,
          notes: updated.notes_c,
          createdAt: updated.created_at_c,
          expectedYield: updated.expected_yield_c
        };
      }
    } catch (error) {
      console.error("Error updating crop schedule:", error?.response?.data?.message || error);
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
          throw new Error(failed[0].message || 'Failed to delete crop schedule');
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting crop schedule:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async reschedule(id, newDate) {
    return this.update(id, { date: newDate });
  }
}

const cropScheduleService = new CropScheduleService();
export default cropScheduleService;