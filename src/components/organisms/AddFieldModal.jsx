import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const AddFieldModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    cropType: "",
    plantingDate: "",
    growthStage: "seedling",
    status: "healthy"
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const cropOptions = [
    { value: "", label: "Select crop type..." },
    { value: "corn", label: "Corn" },
    { value: "wheat", label: "Wheat" },
    { value: "soybeans", label: "Soybeans" },
    { value: "rice", label: "Rice" },
    { value: "tomatoes", label: "Tomatoes" },
    { value: "potatoes", label: "Potatoes" },
    { value: "carrots", label: "Carrots" },
    { value: "lettuce", label: "Lettuce" }
  ];

  const growthStageOptions = [
    { value: "seedling", label: "Seedling" },
    { value: "vegetative", label: "Vegetative" },
    { value: "flowering", label: "Flowering" },
    { value: "fruiting", label: "Fruiting" },
    { value: "mature", label: "Mature" }
  ];

  const statusOptions = [
    { value: "healthy", label: "Healthy" },
    { value: "needs attention", label: "Needs Attention" },
    { value: "ready to harvest", label: "Ready to Harvest" },
    { value: "inactive", label: "Inactive" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Field name is required";
    }

    if (!formData.size || parseFloat(formData.size) <= 0) {
      newErrors.size = "Valid field size is required";
    }

    if (!formData.cropType) {
      newErrors.cropType = "Crop type is required";
    }

    if (!formData.plantingDate) {
      newErrors.plantingDate = "Planting date is required";
    } else {
      const plantingDate = new Date(formData.plantingDate);
      const today = new Date();
      if (plantingDate > today) {
        newErrors.plantingDate = "Planting date cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
const newField = {
        name: formData.name.trim(),
        size: parseFloat(formData.size),
        cropType: formData.cropType,
        plantingDate: formData.plantingDate,
        growthStage: formData.growthStage,
        status: formData.status,
        lastInspection: new Date().toISOString().split('T')[0],
        notes: []
      };

      await onAdd(newField);
      toast.success("Field added successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to add field");
      console.error("Error adding field:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-forest to-fresh p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <ApperIcon name="Plus" className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white font-display">Add New Field</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                type="input"
                label="Field Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., North Field"
                required
                error={errors.name}
              />

              <FormField
                type="input"
                label="Field Size (acres)"
                name="size"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.size}
                onChange={handleInputChange}
                placeholder="e.g., 25.5"
                required
                error={errors.size}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                type="select"
                label="Crop Type"
                name="cropType"
                value={formData.cropType}
                onChange={handleInputChange}
                options={cropOptions}
                required
                error={errors.cropType}
              />

              <FormField
                type="input"
                label="Planting Date"
                name="plantingDate"
                type="date"
                value={formData.plantingDate}
                onChange={handleInputChange}
                required
                error={errors.plantingDate}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                type="select"
                label="Growth Stage"
                name="growthStage"
                value={formData.growthStage}
                onChange={handleInputChange}
                options={growthStageOptions}
              />

              <FormField
                type="select"
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                options={statusOptions}
              />
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                loading={loading}
                disabled={loading}
              >
                Add Field
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddFieldModal;