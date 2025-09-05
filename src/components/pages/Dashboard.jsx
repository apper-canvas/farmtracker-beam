import React, { useState, useEffect } from "react";
import MetricCard from "@/components/molecules/MetricCard";
import WeatherWidget from "@/components/organisms/WeatherWidget";
import { Card, CardHeader, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { Link } from "react-router-dom";
import fieldService from "@/services/api/fieldService";
import activityService from "@/services/api/activityService";
import { format } from "date-fns";

const Dashboard = () => {
  const [fields, setFields] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [fieldsData, activitiesData] = await Promise.all([
        fieldService.getAll(),
        activityService.getAll()
      ]);
      
      setFields(fieldsData);
      setActivities(activitiesData.slice(0, 5)); // Get recent activities
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  // Calculate metrics
const totalFields = fields.length;
  const activeFields = fields.filter(field => (field.status_c || field.status) !== "inactive").length;
  const healthyFields = fields.filter(field => (field.status_c || field.status) === "healthy").length;
  const fieldsNeedingAttention = fields.filter(field => (field.status_c || field.status) === "needs attention").length;
  const readyToHarvest = fields.filter(field => (field.status_c || field.status) === "ready to harvest").length;

  const healthPercentage = totalFields > 0 ? Math.round((healthyFields / totalFields) * 100) : 0;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, HH:mm");
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display gradient-text">Farm Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your farm operations and field status</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button as={Link} to="/fields" icon="Plus" className="btn-hover">
            Add New Field
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Fields"
          value={totalFields}
          icon="MapPin"
          color="forest"
          description="Across your farm"
        />
        <MetricCard
          title="Active Fields"
          value={activeFields}
          icon="Sprout"
          color="fresh"
          description="Currently planted"
        />
        <MetricCard
          title="Health Rate"
          value={`${healthPercentage}%`}
          icon="Heart"
          color="blue"
          trend={healthPercentage >= 80 ? "up" : healthPercentage <= 60 ? "down" : "stable"}
          trendValue={`${healthyFields}/${totalFields}`}
          description="Fields in good health"
        />
        <MetricCard
          title="Ready to Harvest"
          value={readyToHarvest}
          icon="Package"
          color="amber"
          description="Fields ready for harvest"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Field Status Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 font-display">Field Status Overview</h3>
                <Button 
                  as={Link} 
                  to="/fields" 
                  variant="outline" 
                  size="sm"
                >
                  View All Fields
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="MapPin" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Fields Added</h4>
                  <p className="text-gray-600 mb-4">Start by adding your first field to track crop progress</p>
                  <Button as={Link} to="/fields" icon="Plus">
                    Add Your First Field
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{healthyFields}</div>
                      <div className="text-sm text-gray-600">Healthy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">{fieldsNeedingAttention}</div>
                      <div className="text-sm text-gray-600">Need Attention</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">{readyToHarvest}</div>
                      <div className="text-sm text-gray-600">Ready to Harvest</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{totalFields - activeFields}</div>
                      <div className="text-sm text-gray-600">Inactive</div>
                    </div>
                  </div>

                  <div className="space-y-3">
{fields.slice(0, 5).map((field) => (
                      <div key={field.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white rounded-lg">
                            <ApperIcon name="Sprout" className="w-4 h-4 text-fresh" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{field.name_c || field.Name}</p>
                            <p className="text-sm text-gray-600">{field.crop_type_c} • {field.size_c} acres</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <StatusBadge status={field.status} showIcon={false} />
                          <Button 
                            as={Link} 
                            to="/fields" 
                            variant="ghost" 
                            size="sm" 
                            icon="Eye"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {fields.length > 5 && (
                    <div className="text-center pt-4">
                      <Button as={Link} to="/fields" variant="outline">
                        View All {fields.length} Fields
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Weather Widget */}
        <div>
          <WeatherWidget />
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 font-display">Recent Activity</h3>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Activity" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h4>
              <p className="text-gray-600">Activity will appear here as you manage your fields</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.Id} className="flex items-start space-x-3">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;