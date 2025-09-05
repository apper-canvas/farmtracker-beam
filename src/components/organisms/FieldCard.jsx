import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const FieldCard = ({ field, onView, onEdit }) => {
  const getCropIcon = (cropType) => {
    const icons = {
      corn: "Wheat",
      wheat: "Wheat",
      soybeans: "Leaf",
      rice: "Sprout",
      tomatoes: "Cherry",
      potatoes: "Package",
      carrots: "Carrot",
      lettuce: "Leaf"
    };
    return icons[cropType?.toLowerCase()] || "Sprout";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  const getGrowthStageColor = (stage) => {
    const colors = {
      "seedling": "text-green-600 bg-green-50",
      "vegetative": "text-blue-600 bg-blue-50",
      "flowering": "text-purple-600 bg-purple-50",
      "fruiting": "text-orange-600 bg-orange-50",
      "mature": "text-amber-600 bg-amber-50",
      "harvested": "text-gray-600 bg-gray-50"
    };
    return colors[stage?.toLowerCase()] || "text-gray-600 bg-gray-50";
  };

  return (
    <Card hover className="h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-fresh/10 rounded-lg">
              <ApperIcon 
                name={getCropIcon(field.cropType)} 
                className="w-5 h-5 text-fresh" 
              />
            </div>
            <div>
<h3 className="font-semibold text-lg text-gray-900">{field.name_c || field.Name}</h3>
              <p className="text-sm text-gray-600">{field.crop_type_c || field.cropType}</p>
            </div>
          </div>
<StatusBadge status={field.status_c || field.status} showIcon={false} />
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Size:</span>
            <span className="font-medium">{field.size_c || field.size} acres</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Planted:</span>
            <span className="font-medium">{formatDate(field.planting_date_c || field.plantingDate)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Growth Stage:</span>
            <span 
              className={`px-2 py-1 rounded-full text-xs font-medium ${getGrowthStageColor(field.growth_stage_c || field.growthStage)}`}
            >
              {field.growth_stage_c || field.growthStage}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Last Inspection:</span>
            <span className="font-medium">{formatDate(field.last_inspection_c || field.lastInspection)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            icon="Eye"
            onClick={() => onView(field)}
            className="flex-1"
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon="Edit"
            onClick={() => onEdit(field)}
          >
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldCard;