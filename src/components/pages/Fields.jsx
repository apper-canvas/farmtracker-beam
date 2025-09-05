import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FieldCard from "@/components/organisms/FieldCard";
import FieldDetailModal from "@/components/organisms/FieldDetailModal";
import AddFieldModal from "@/components/organisms/AddFieldModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import fieldService from "@/services/api/fieldService";
import { toast } from "react-toastify";

const Fields = () => {
  const [fields, setFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadFields();
  }, []);

  useEffect(() => {
    filterFields();
  }, [fields, searchTerm]);

  const loadFields = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fieldService.getAll();
      setFields(data);
    } catch (err) {
      setError("Failed to load fields");
      console.error("Fields loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterFields = () => {
    let filtered = fields;

if (searchTerm.trim()) {
      filtered = filtered.filter(field =>
        (field.name_c || field.Name || field.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (field.crop_type_c || field.cropType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (field.status_c || field.status || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFields(filtered);
  };

  const handleAddField = async (fieldData) => {
    try {
      const newField = await fieldService.create(fieldData);
      setFields(prev => [...prev, newField]);
      toast.success("Field added successfully!");
    } catch (error) {
      console.error("Error adding field:", error);
      throw error;
    }
  };

  const handleViewField = (field) => {
    setSelectedField(field);
    setShowDetailModal(true);
  };

  const handleEditField = (field) => {
    setSelectedField(field);
    setShowDetailModal(true);
  };

  if (loading) return <Loading type="grid" />;
  if (error) return <Error message={error} onRetry={loadFields} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-display gradient-text">Field Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all your agricultural fields</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            icon="Plus" 
            onClick={() => setShowAddModal(true)}
            className="btn-hover"
          >
            Add New Field
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            onSearch={setSearchTerm}
            placeholder="Search fields by name, crop type, or status..."
            immediate={true}
          />
        </div>
      </div>

      {/* Stats Bar */}
      {fields.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
<div className="text-2xl font-bold text-forest">{fields.length}</div>
              <div className="text-sm text-gray-600">Total Fields</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {fields.filter(f => (f.status_c || f.status) === "healthy").length}
              </div>
              <div className="text-sm text-gray-600">Healthy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">
                {fields.filter(f => (f.status_c || f.status) === "needs attention").length}
              </div>
              <div className="text-sm text-gray-600">Need Attention</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">
                {fields.filter(f => (f.status_c || f.status) === "ready to harvest").length}
              </div>
              <div className="text-sm text-gray-600">Ready to Harvest</div>
            </div>
          </div>
        </div>
      )}

      {/* Fields Grid */}
      {filteredFields.length === 0 ? (
        <Empty
          type="fields"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFields.map((field) => (
            <FieldCard
              key={field.Id}
              field={field}
              onView={handleViewField}
              onEdit={handleEditField}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddFieldModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddField}
        />
      )}

      {showDetailModal && selectedField && (
        <FieldDetailModal
          field={selectedField}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedField(null);
          }}
          onUpdate={loadFields}
        />
      )}
    </div>
  );
};

export default Fields;