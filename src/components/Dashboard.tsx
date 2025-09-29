import React from 'react';
import { Equipment, Alert } from '../types/equipment';
import { BarChart3, AlertTriangle, Wrench, CheckCircle, Clock, DollarSign } from 'lucide-react';

interface DashboardProps {
  equipment: Equipment[];
  alerts: Alert[];
}

export const Dashboard: React.FC<DashboardProps> = ({ equipment, alerts }) => {
  const stats = {
    total: equipment.length,
    active: equipment.filter(eq => eq.status === 'active').length,
    maintenance: equipment.filter(eq => eq.status === 'maintenance').length,
    calibration: equipment.filter(eq => eq.status === 'calibration').length,
    retired: equipment.filter(eq => eq.status === 'retired').length,
    totalValue: equipment.reduce((sum, eq) => sum + eq.cost, 0),
    pendingAlerts: alerts.filter(alert => !alert.acknowledged).length,
    criticalAlerts: alerts.filter(alert => alert.priority === 'critical' && !alert.acknowledged).length
  };

  const recentAlerts = alerts.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Lab Equipment Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Equipment</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Equipment</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Under Maintenance</p>
              <p className="text-3xl font-bold text-orange-600">{stats.maintenance + stats.calibration}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Alerts</p>
              <p className="text-3xl font-bold text-red-600">{stats.pendingAlerts}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-gray-600" />
            Equipment Value
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Portfolio Value</span>
              <span className="text-lg font-bold text-gray-900">
                ₹{stats.totalValue.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Equipment Value</span>
              <span className="text-sm font-medium text-gray-700">
                ₹{Math.round(stats.totalValue / stats.total).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-600" />
            Recent Alerts
          </h3>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.priority === 'critical' ? 'bg-red-500' :
                  alert.priority === 'high' ? 'bg-orange-500' :
                  alert.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{alert.title}</p>
                  <p className="text-xs text-gray-500 truncate">{alert.description}</p>
                </div>
                {!alert.acknowledged && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    New
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};