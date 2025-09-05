class EquipmentService {
  constructor() {
    this.tableName = 'equipment_c';
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "model_c"}},
          {"field": {"Name": "manufacturer_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_hours_c"}},
          {"field": {"Name": "last_maintenance_hours_c"}},
          {"field": {"Name": "next_maintenance_hours_c"}},
          {"field": {"Name": "maintenance_interval_c"}},
          {"field": {"Name": "last_maintenance_c"}},
          {"field": {"Name": "next_maintenance_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "fuel_capacity_c"}},
          {"field": {"Name": "total_fuel_c"}},
          {"field": {"Name": "purchase_price_c"}},
          {"field": {"Name": "current_value_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "last_used_c"}},
          {"field": {"Name": "usage_logs_c"}},
          {"field": {"Name": "maintenance_history_c"}}
        ]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response?.data?.length) {
        return [];
      }

      // Transform database field names to match UI expectations
      return response.data.map(item => ({
        Id: item.Id,
        name: item.name_c || item.Name,
        type: item.type_c,
        model: item.model_c,
        manufacturer: item.manufacturer_c,
        year: item.year_c,
        status: item.status_c,
        totalHours: item.total_hours_c || 0,
        lastMaintenanceHours: item.last_maintenance_hours_c,
        nextMaintenanceHours: item.next_maintenance_hours_c,
        maintenanceInterval: item.maintenance_interval_c,
        lastMaintenance: item.last_maintenance_c,
        nextMaintenance: item.next_maintenance_c,
        location: item.location_c,
        fuelCapacity: item.fuel_capacity_c,
        totalFuel: item.total_fuel_c || 0,
        purchasePrice: item.purchase_price_c,
        currentValue: item.current_value_c,
        image: item.image_c,
        lastUsed: item.last_used_c,
        usageLogs: item.usage_logs_c ? JSON.parse(item.usage_logs_c) : [],
        maintenanceHistory: item.maintenance_history_c ? JSON.parse(item.maintenance_history_c) : []
      }));
    } catch (error) {
      console.error("Error fetching equipment:", error?.response?.data?.message || error);
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "model_c"}},
          {"field": {"Name": "manufacturer_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "total_hours_c"}},
          {"field": {"Name": "last_maintenance_hours_c"}},
          {"field": {"Name": "next_maintenance_hours_c"}},
          {"field": {"Name": "maintenance_interval_c"}},
          {"field": {"Name": "last_maintenance_c"}},
          {"field": {"Name": "next_maintenance_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "fuel_capacity_c"}},
          {"field": {"Name": "total_fuel_c"}},
          {"field": {"Name": "purchase_price_c"}},
          {"field": {"Name": "current_value_c"}},
          {"field": {"Name": "image_c"}},
          {"field": {"Name": "last_used_c"}},
          {"field": {"Name": "usage_logs_c"}},
          {"field": {"Name": "maintenance_history_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response?.data) {
        return null;
      }

      // Transform database field names to match UI expectations
      const item = response.data;
      return {
        Id: item.Id,
        name: item.name_c || item.Name,
        type: item.type_c,
        model: item.model_c,
        manufacturer: item.manufacturer_c,
        year: item.year_c,
        status: item.status_c,
        totalHours: item.total_hours_c || 0,
        lastMaintenanceHours: item.last_maintenance_hours_c,
        nextMaintenanceHours: item.next_maintenance_hours_c,
        maintenanceInterval: item.maintenance_interval_c,
        lastMaintenance: item.last_maintenance_c,
        nextMaintenance: item.next_maintenance_c,
        location: item.location_c,
        fuelCapacity: item.fuel_capacity_c,
        totalFuel: item.total_fuel_c || 0,
        purchasePrice: item.purchase_price_c,
        currentValue: item.current_value_c,
        image: item.image_c,
        lastUsed: item.last_used_c,
        usageLogs: item.usage_logs_c ? JSON.parse(item.usage_logs_c) : [],
        maintenanceHistory: item.maintenance_history_c ? JSON.parse(item.maintenance_history_c) : []
      };
    } catch (error) {
      console.error(`Error fetching equipment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(equipmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: equipmentData.name || equipmentData.Name,
          name_c: equipmentData.name || equipmentData.Name,
          type_c: equipmentData.type,
          model_c: equipmentData.model,
          manufacturer_c: equipmentData.manufacturer,
          year_c: parseInt(equipmentData.year),
          status_c: equipmentData.status || 'Active',
          total_hours_c: parseFloat(equipmentData.totalHours) || 0,
          last_maintenance_hours_c: parseFloat(equipmentData.lastMaintenanceHours) || 0,
          next_maintenance_hours_c: parseFloat(equipmentData.nextMaintenanceHours) || 500,
          maintenance_interval_c: parseFloat(equipmentData.maintenanceInterval) || 500,
          last_maintenance_c: equipmentData.lastMaintenance,
          next_maintenance_c: equipmentData.nextMaintenance,
          location_c: equipmentData.location,
          fuel_capacity_c: parseFloat(equipmentData.fuelCapacity) || 0,
          total_fuel_c: parseFloat(equipmentData.totalFuel) || 0,
          purchase_price_c: parseFloat(equipmentData.purchasePrice) || 0,
          current_value_c: parseFloat(equipmentData.currentValue) || 0,
          image_c: equipmentData.image,
          last_used_c: equipmentData.lastUsed,
          usage_logs_c: JSON.stringify(equipmentData.usageLogs || []),
          maintenance_history_c: JSON.stringify(equipmentData.maintenanceHistory || [])
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
          throw new Error(failed[0].message || 'Failed to create equipment');
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating equipment:", error?.response?.data?.message || error);
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
      if (data.name !== undefined) updateData.name_c = data.name;
      if (data.type !== undefined) updateData.type_c = data.type;
      if (data.model !== undefined) updateData.model_c = data.model;
      if (data.manufacturer !== undefined) updateData.manufacturer_c = data.manufacturer;
      if (data.year !== undefined) updateData.year_c = parseInt(data.year);
      if (data.status !== undefined) updateData.status_c = data.status;
      if (data.totalHours !== undefined) updateData.total_hours_c = parseFloat(data.totalHours);
      if (data.lastMaintenanceHours !== undefined) updateData.last_maintenance_hours_c = parseFloat(data.lastMaintenanceHours);
      if (data.nextMaintenanceHours !== undefined) updateData.next_maintenance_hours_c = parseFloat(data.nextMaintenanceHours);
      if (data.maintenanceInterval !== undefined) updateData.maintenance_interval_c = parseFloat(data.maintenanceInterval);
      if (data.lastMaintenance !== undefined) updateData.last_maintenance_c = data.lastMaintenance;
      if (data.nextMaintenance !== undefined) updateData.next_maintenance_c = data.nextMaintenance;
      if (data.location !== undefined) updateData.location_c = data.location;
      if (data.fuelCapacity !== undefined) updateData.fuel_capacity_c = parseFloat(data.fuelCapacity);
      if (data.totalFuel !== undefined) updateData.total_fuel_c = parseFloat(data.totalFuel);
      if (data.purchasePrice !== undefined) updateData.purchase_price_c = parseFloat(data.purchasePrice);
      if (data.currentValue !== undefined) updateData.current_value_c = parseFloat(data.currentValue);
      if (data.image !== undefined) updateData.image_c = data.image;
      if (data.lastUsed !== undefined) updateData.last_used_c = data.lastUsed;
      if (data.usageLogs !== undefined) updateData.usage_logs_c = JSON.stringify(data.usageLogs);
      if (data.maintenanceHistory !== undefined) updateData.maintenance_history_c = JSON.stringify(data.maintenanceHistory);

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
          throw new Error(failed[0].message || 'Failed to update equipment');
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating equipment:", error?.response?.data?.message || error);
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
          throw new Error(failed[0].message || 'Failed to delete equipment');
        }
        
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting equipment:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async logUsage(id, usageData) {
    try {
      // Get current equipment record
      const equipment = await this.getById(id);
      if (!equipment) {
        throw new Error(`Equipment with Id ${id} not found`);
      }

      const usageLog = {
        id: Date.now(),
        date: usageData.date || new Date().toISOString(),
        hours: parseFloat(usageData.hours) || 0,
        fuelUsed: parseFloat(usageData.fuelUsed) || 0,
        operator: usageData.operator || '',
        notes: usageData.notes || '',
        maintenancePerformed: usageData.maintenancePerformed || false
      };

      const updatedUsageLogs = [...(equipment.usageLogs || []), usageLog];
      const newTotalHours = (equipment.totalHours || 0) + usageLog.hours;
      const newTotalFuel = (equipment.totalFuel || 0) + usageLog.fuelUsed;

      // Update equipment with new usage data
      const updateData = {
        totalHours: newTotalHours,
        totalFuel: newTotalFuel,
        lastUsed: usageLog.date,
        usageLogs: updatedUsageLogs
      };

      // Update maintenance status based on hours
      if (newTotalHours >= equipment.nextMaintenanceHours) {
        updateData.status = 'Maintenance Due';
      }

      await this.update(id, updateData);
      
      return { ...equipment, ...updateData };
    } catch (error) {
      console.error("Error logging usage:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async scheduleMaintenance(id, maintenanceData) {
    try {
      const equipment = await this.getById(id);
      if (!equipment) {
        throw new Error('Equipment not found');
      }

      const maintenanceRecord = {
        Id: Date.now(),
        equipmentId: equipment.Id,
        serviceType: maintenanceData.type,
        date: maintenanceData.scheduledDate + 'T10:00:00Z',
        estimatedCost: parseFloat(maintenanceData.estimatedCost) || 0,
        priority: maintenanceData.priority,
        notes: maintenanceData.notes,
        status: 'scheduled',
        createdDate: new Date().toISOString()
      };

      const updatedMaintenanceHistory = [...(equipment.maintenanceHistory || []), maintenanceRecord];
      
      await this.update(id, {
        maintenanceHistory: updatedMaintenanceHistory
      });

      return maintenanceRecord;
    } catch (error) {
      console.error("Error scheduling maintenance:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async getMaintenanceHistory() {
    try {
      const allEquipment = await this.getAll();
      const allRecords = [];
      
      allEquipment.forEach(equipment => {
        if (equipment.maintenanceHistory) {
          allRecords.push(...equipment.maintenanceHistory);
        }
      });
      
      return allRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error("Error fetching maintenance history:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getMaintenanceAlerts() {
    try {
      const allEquipment = await this.getAll();
      const alerts = [];
      const currentDate = new Date();
      
      allEquipment.forEach(equipment => {
        const nextMaintenanceDate = new Date(equipment.nextMaintenance);
        const daysUntilMaintenance = Math.ceil((nextMaintenanceDate - currentDate) / (1000 * 60 * 60 * 24));
        const hoursUntilMaintenance = equipment.nextMaintenanceHours - equipment.totalHours;
        
        let priority = 'low';
        let status = 'upcoming';
        
        if (daysUntilMaintenance < 0 || hoursUntilMaintenance <= 0) {
          priority = 'high';
          status = 'overdue';
        } else if (daysUntilMaintenance <= 7 || hoursUntilMaintenance <= 50) {
          priority = 'medium';
          status = 'due-soon';
        }
        
        if (daysUntilMaintenance <= 30 || hoursUntilMaintenance <= 100) {
          alerts.push({
            Id: `alert-${equipment.Id}`,
            equipmentId: equipment.Id,
            equipmentName: equipment.name,
            equipmentType: equipment.type,
            nextMaintenanceDate: equipment.nextMaintenance,
            daysUntilMaintenance,
            hoursUntilMaintenance,
            priority,
            status,
            location: equipment.location,
            lastMaintenance: equipment.lastMaintenance
          });
        }
      });
      
      return alerts.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return a.daysUntilMaintenance - b.daysUntilMaintenance;
      });
    } catch (error) {
      console.error("Error fetching maintenance alerts:", error?.response?.data?.message || error);
      return [];
    }
  }

  async updateMaintenanceRecord(id, updates) {
    try {
      const allEquipment = await this.getAll();
      
      for (let equipment of allEquipment) {
        if (equipment.maintenanceHistory) {
          const recordIndex = equipment.maintenanceHistory.findIndex(record => record.Id === parseInt(id));
          if (recordIndex !== -1) {
            equipment.maintenanceHistory[recordIndex] = {
              ...equipment.maintenanceHistory[recordIndex],
              ...updates,
              updatedDate: new Date().toISOString()
            };
            
            await this.update(equipment.Id, {
              maintenanceHistory: equipment.maintenanceHistory
            });
            
            return equipment.maintenanceHistory[recordIndex];
          }
        }
      }
      
      throw new Error('Maintenance record not found');
    } catch (error) {
      console.error("Error updating maintenance record:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

const equipmentService = new EquipmentService();
export default equipmentService;