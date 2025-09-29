import React, { useState } from 'react';
import { Alert } from '../types/equipment';
import { 
  AlertTriangle, 
  Bell, 
  Calendar, 
  Wrench, 
  Shield, 
  Clock,
  CheckCircle,
  X
} from 'lucide-react';

interface AlertCenterProps {
  alerts: Alert[];
  onAcknowledgeAlert?: (alertId: string) => void;
  onDismissAlert?: (alertId: string) => void;
}

export const AlertCenter: React.FC<AlertCenterProps> = ({ 
  alerts, 
  onAcknowledgeAlert, 
  onDismissAlert 
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  const filteredAlerts = alerts.filter(alert => {
    const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority;
    const matchesType = filterType === 'all' || alert.type === filterType;
    const matchesAcknowledged = showAcknowledged || !alert.acknowledged;
    
    return matchesPriority && matchesType && matchesAcknowledged;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance_due': return Wrench;
      case 'warranty_expiry': return Shield;
      case 'calibration_due': return Calendar;
      case 'equipment_issue': return AlertTriangle;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance_due': return 'text-orange-600';
      case 'warranty_expiry': return 'text-red-600';
      case 'calibration_due': return 'text-blue-600';
      case 'equipment_issue': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const pendingAlerts = alerts.filter(alert => !alert.acknowledged);
  const criticalAlerts = alerts.filter(alert => alert.priority === 'critical' && !alert.acknowledged);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alert Center</h2>
          <p className="text-gray-600">
            {pendingAlerts.length} pending alerts
            {criticalAlerts.length > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {criticalAlerts.length} critical
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Critical', count: alerts.filter(a => a.priority === 'critical' && !a.acknowledged).length, color: 'text-red-600 bg-red-50' },
          { label: 'High Priority', count: alerts.filter(a => a.priority === 'high' && !a.acknowledged).length, color: 'text-orange-600 bg-orange-50' },
          { label: 'Medium Priority', count: alerts.filter(a => a.priority === 'medium' && !a.acknowledged).length, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Low Priority', count: alerts.filter(a => a.priority === 'low' && !a.acknowledged).length, color: 'text-blue-600 bg-blue-50' }
        ].map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{item.count}</p>
            <p className="text-sm text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="maintenance_due">Maintenance Due</option>
              <option value="warranty_expiry">Warranty Expiry</option>
              <option value="calibration_due">Calibration Due</option>
              <option value="equipment_issue">Equipment Issue</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showAcknowledged}
                onChange={(e) => setShowAcknowledged(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Show acknowledged alerts</span>
            </label>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const TypeIcon = getTypeIcon(alert.type);
          return (
            <div
              key={alert.id}
              className={`bg-white rounded-xl shadow-sm border-2 p-6 ${
                alert.acknowledged ? 'border-gray-200 opacity-75' : 
                alert.priority === 'critical' ? 'border-red-200' :
                alert.priority === 'high' ? 'border-orange-200' :
                'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${
                    alert.priority === 'critical' ? 'bg-red-50' :
                    alert.priority === 'high' ? 'bg-orange-50' :
                    alert.priority === 'medium' ? 'bg-yellow-50' :
                    'bg-blue-50'
                  }`}>
                    <TypeIcon className={`w-6 h-6 ${getTypeColor(alert.type)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(alert.priority)}`}>
                        {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                      </span>
                      {alert.acknowledged && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Acknowledged
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-2">{alert.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(alert.date).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!alert.acknowledged && onAcknowledgeAlert && (
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Acknowledge
                    </button>
                  )}
                  
                  {onDismissAlert && (
                    <button
                      onClick={() => onDismissAlert(alert.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No alerts match your current filters.</p>
        </div>
      )}
    </div>
  );
};