import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import { format } from "date-fns";
import { toast } from "react-toastify";
import activityService from "@/services/api/activityService";
import inspectionService from "@/services/api/inspectionService";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

const FieldDetailModal = ({ field, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [newNote, setNewNote] = useState("");
  const [inspections, setInspections] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (field) {
      loadInspections();
      loadActivities();
    }
  }, [field]);

  const loadInspections = async () => {
    try {
      setLoading(true);
      const data = await inspectionService.getByFieldId(field.Id);
      setInspections(data);
    } catch (error) {
      console.error("Error loading inspections:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadActivities = async () => {
    try {
      const data = await activityService.getByFieldId(field.Id);
      setActivities(data);
    } catch (error) {
      console.error("Error loading activities:", error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

try {
      const newInspection = {
        fieldId: field.Id,
        date: new Date().toISOString(),
        notes: newNote,
        status: field.status_c || field.status,
      };

      await inspectionService.create(newInspection);
      
      // Add activity log entry
      const activity = {
        fieldId: field.Id,
        type: "inspection",
        description: `Added inspection note: ${newNote.substring(0, 50)}...`,
        timestamp: new Date().toISOString()
      };
      
      await activityService.create(activity);
      
      setNewNote("");
      toast.success("Inspection note added successfully!");
      loadInspections();
      loadActivities();
    } catch (error) {
      toast.error("Failed to add inspection note");
      console.error("Error adding note:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' HH:mm");
    } catch {
      return "Invalid Date";
    }
  };

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

  const tabs = [
    { id: "details", label: "Details", icon: "Info" },
    { id: "notes", label: "Inspections", icon: "ClipboardList" },
    { id: "activity", label: "Activity Log", icon: "Activity" }
  ];

  if (!field) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-forest to-fresh p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <ApperIcon 
                  name={getCropIcon(field.cropType)} 
                  className="w-6 h-6 text-white" 
                />
              </div>
              <div>
<h2 className="text-2xl font-bold text-white font-display">{field.name_c || field.Name}</h2>
                <p className="text-white/90">{field.crop_type_c || field.cropType} • {field.size_c || field.size} acres</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
<StatusBadge status={field.status_c || field.status} />
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-forest text-forest bg-green-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "details" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Field Size</label>
                  <p className="text-lg font-semibold text-gray-900">{field.size_c || field.size} acres</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Crop Type</label>
                  <p className="text-lg font-semibold text-gray-900">{field.crop_type_c || field.cropType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Planting Date</label>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(field.planting_date_c || field.plantingDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Growth Stage</label>
                  <p className="text-lg font-semibold text-gray-900">{field.growth_stage_c || field.growthStage}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Inspection</label>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(field.last_inspection_c || field.lastInspection)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Status</label>
                  <div className="mt-1">
                    <StatusBadge status={field.status_c || field.status} />
                  </div>
                </div>
              </div>

{((field.notes_c && field.notes_c.trim()) || (field.notes && field.notes.length > 0)) && (
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">Field Notes</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {field.notes_c ? (
                      <p className="text-gray-700">{field.notes_c}</p>
                    ) : field.notes?.map((note, index) => (
<p key={index} className="text-gray-700 mb-2 last:mb-0">{note}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <FormField
                  type="textarea"
                  label="Add Inspection Note"
                  placeholder="Enter your inspection observations..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button 
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || loading}
                  className="w-full md:w-auto"
                >
                  Add Note
                </Button>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Inspections</h4>
                <div className="space-y-4">
                  {inspections.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No inspections recorded yet</p>
                  ) : (
                    inspections.map((inspection) => (
                      <div key={inspection.Id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(inspection.date)}
                          </span>
                          <StatusBadge status={inspection.status} showIcon={false} />
                        </div>
                        <p className="text-gray-700">{inspection.notes}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h4>
              {activities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No activities recorded yet</p>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.Id} className="flex items-start space-x-3 pb-4 border-b border-gray-200 last:border-b-0">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <ApperIcon 
                          name={activity.type === "inspection" ? "ClipboardList" : "Activity"} 
                          className="w-4 h-4 text-gray-600" 
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500">{formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldDetailModal;