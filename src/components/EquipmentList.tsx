import React, { useState } from 'react';
import { Equipment } from '../types/equipment';
import { usePermissions } from '../hooks/usePermissions';
import { Search, Filter, QrCode, MapPin, Calendar, DollarSign, User, Eye, Plus, CreditCard as Edit, Trash2 } from 'lucide-react';

interface EquipmentListProps {
  equipment: Equipment[];
  onSelectEquipment: (equipment: Equipment) => void;
  onAddEquipment?: () => void;
  onEditEquipment?: (equipment: Equipment) => void;
  onDeleteEquipment?: (equipment: Equipment) => void;
}

export const EquipmentList: React.FC<EquipmentListProps> = ({ 
  equipment, 
  onSelectEquipment,
  onAddEquipment,
  onEditEquipment,
  onDeleteEquipment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const { hasPermission } = usePermissions();

  const categories = [...new Set(equipment.map(eq => eq.category))];

  const filteredEquipment = equipment
    .filter(eq => {
      const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           eq.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           eq.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           eq.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           eq.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || eq.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || eq.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'cost':
          return b.cost - a.cost;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'calibration': return 'bg-blue-100 text-blue-800';
      case 'repair': return 'bg-red-100 text-red-800';
      case 'retired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Equipment Inventory</h2>
          <p className="text-gray-600 mt-1">
            {filteredEquipment.length} of {equipment.length} items
          </p>
        </div>
        {hasPermission('equipment.create') && onAddEquipment && (
          <button
            onClick={onAddEquipment}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="calibration">Calibration</option>
              <option value="repair">Repair</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="cost">Sort by Cost</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEquipment.map((eq) => (
          <div
            key={eq.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{eq.name}</h3>
                  <p className="text-sm text-gray-600">{eq.model} | {eq.serial_number}</p>
                  <p className="text-xs text-gray-500">{eq.manufacturer}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(eq.status)}`}>
                    {eq.status.charAt(0).toUpperCase() + eq.status.slice(1)}
                  </span>
                  <span className={`text-xs font-medium ${getConditionColor(eq.condition)}`}>
                    {eq.condition.charAt(0).toUpperCase() + eq.condition.slice(1)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {eq.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  {eq.responsible_person}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Next maintenance: {eq.next_maintenance_date ? new Date(eq.next_maintenance_date).toLocaleDateString() : 'Not scheduled'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  ₹{eq.cost.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <QrCode className="w-4 h-4 mr-1" />
                    {eq.qr_code}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectEquipment(eq)}
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    {hasPermission('equipment.update') && onEditEquipment && (
                      <button
                        onClick={() => onEditEquipment(eq)}
                        className="inline-flex items-center text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    )}
                    {hasPermission('equipment.delete') && onDeleteEquipment && (
                      <button
                        onClick={() => onDeleteEquipment(eq)}
                        className="inline-flex items-center text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No equipment found matching your search criteria.</p>
          {hasPermission('equipment.create') && onAddEquipment && (
            <button
              onClick={onAddEquipment}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Equipment
            </button>
          )}
        </div>
      )}
    </div>
  );
};