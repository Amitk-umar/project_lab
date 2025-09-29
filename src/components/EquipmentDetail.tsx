import React, { useState } from 'react';
import { Equipment, MaintenanceRecord } from '../types/equipment';
import { 
  ArrowLeft, 
  QrCode, 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  FileText, 
  Wrench, 
  AlertTriangle,
  Edit,
  Trash2
} from 'lucide-react';

interface EquipmentDetailProps {
  equipment: Equipment;
  maintenanceRecords: MaintenanceRecord[];
  onBack: () => void;
  onEdit?: (equipment: Equipment) => void;
}

export const EquipmentDetail: React.FC<EquipmentDetailProps> = ({ 
  equipment, 
  maintenanceRecords, 
  onBack,
  onEdit 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'maintenance' | 'documents'>('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'calibration': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'retired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const equipmentMaintenanceRecords = maintenanceRecords.filter(
    record => record.equipmentId === equipment.id
  );

  const isMaintenanceDue = () => {
    const nextMaintenanceDate = new Date(equipment.nextMaintenanceDate);
    const today = new Date();
    const daysUntilMaintenance = Math.ceil((nextMaintenanceDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilMaintenance <= 7;
  };

  const isWarrantyExpiring = () => {
    const warrantyDate = new Date(equipment.warrantyExpiry);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((warrantyDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 30;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{equipment.name}</h1>
            <p className="text-gray-600">{equipment.model} | SN: {equipment.serialNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(equipment.status)}`}>
            {equipment.status.charAt(0).toUpperCase() + equipment.status.slice(1)}
          </span>
          {onEdit && (
            <button
              onClick={() => onEdit(equipment)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {(isMaintenanceDue() || isWarrantyExpiring()) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">Attention Required</h3>
              <div className="mt-1 text-sm text-amber-700">
                {isMaintenanceDue() && <p>• Maintenance due within 7 days</p>}
                {isWarrantyExpiring() && <p>• Warranty expires within 30 days</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'maintenance', label: 'Maintenance History', icon: Wrench },
            { id: 'documents', label: 'Documents', icon: FileText }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Manufacturer</label>
                  <p className="text-sm text-gray-900 mt-1">{equipment.manufacturer}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Category</label>
                  <p className="text-sm text-gray-900 mt-1">{equipment.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">QR Code</label>
                  <div className="flex items-center mt-1">
                    <QrCode className="w-4 h-4 mr-1 text-gray-400" />
                    <p className="text-sm text-gray-900">{equipment.qrCode}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <div className="flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    <p className="text-sm text-gray-900">{equipment.location}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Responsible Person</label>
                  <div className="flex items-center mt-1">
                    <User className="w-4 h-4 mr-1 text-gray-400" />
                    <p className="text-sm text-gray-900">{equipment.responsible}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Specifications</label>
                <p className="text-sm text-gray-900 mt-1">{equipment.specifications}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Notes</label>
                <p className="text-sm text-gray-900 mt-1">{equipment.notes}</p>
              </div>
            </div>
          </div>

          {/* Financial & Dates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial & Dates</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Purchase Cost</label>
                <div className="flex items-center mt-1">
                  <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                  <p className="text-lg font-semibold text-gray-900">₹{equipment.cost.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Purchase Date</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    <p className="text-sm text-gray-900">
                      {new Date(equipment.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Warranty Expiry</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    <p className={`text-sm ${isWarrantyExpiring() ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {new Date(equipment.warrantyExpiry).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Maintenance</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    <p className="text-sm text-gray-900">
                      {new Date(equipment.lastMaintenanceDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Next Maintenance</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    <p className={`text-sm ${isMaintenanceDue() ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {new Date(equipment.nextMaintenanceDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Maintenance Interval</label>
                <p className="text-sm text-gray-900 mt-1">{equipment.maintenanceInterval} days</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Maintenance History</h3>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Wrench className="w-4 h-4 mr-2" />
              Schedule Maintenance
            </button>
          </div>

          {equipmentMaintenanceRecords.length > 0 ? (
            <div className="space-y-4">
              {equipmentMaintenanceRecords.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900 capitalize">{record.type} Maintenance</h4>
                      <p className="text-sm text-gray-600">{new Date(record.date).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === 'completed' ? 'bg-green-100 text-green-800' :
                      record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{record.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Technician:</span>
                      <p className="text-gray-900">{record.technician}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Cost:</span>
                      <p className="text-gray-900">₹{record.cost.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Next Due:</span>
                      <p className="text-gray-900">{new Date(record.nextDueDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {record.partsReplaced.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="font-medium text-gray-600 text-sm">Parts Replaced:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {record.partsReplaced.map((part, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs text-gray-700">
                            {part}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No maintenance records found for this equipment.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Documents & Manuals</h3>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FileText className="w-4 h-4 mr-2" />
              Upload Document
            </button>
          </div>

          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No documents uploaded yet.</p>
            <p className="text-sm text-gray-400 mt-1">Upload manuals, warranties, and other documents for this equipment.</p>
          </div>
        </div>
      )}
    </div>
  );
};