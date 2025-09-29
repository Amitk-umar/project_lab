import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { 
  LayoutDashboard, 
  Package, 
  QrCode, 
  Bell, 
  Wrench,
  FileText,
  Users,
  Settings,
  LogOut,
  Microscope,
  X
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  pendingAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  sidebarOpen,
  setSidebarOpen,
  pendingAlertsCount
}) => {
  const { user, signOut } = useAuth();
  const { hasPermission, canAccess } = usePermissions();

  const navigation = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: LayoutDashboard,
      permission: null
    },
    { 
      id: 'equipment', 
      name: 'Equipment', 
      icon: Package,
      permission: 'equipment.read'
    },
    { 
      id: 'scanner', 
      name: 'QR Scanner', 
      icon: QrCode,
      permission: 'equipment.read'
    },
    { 
      id: 'maintenance', 
      name: 'Maintenance', 
      icon: Wrench,
      permission: 'maintenance.read'
    },
    { 
      id: 'alerts', 
      name: 'Alerts', 
      icon: Bell,
      permission: null
    },
    { 
      id: 'reports', 
      name: 'Reports', 
      icon: FileText,
      permission: 'reports.view'
    },
    { 
      id: 'users', 
      name: 'Users', 
      icon: Users,
      permission: 'users.manage'
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: Settings,
      permission: 'settings.manage'
    }
  ];

  const filteredNavigation = navigation.filter(item => 
    !item.permission || hasPermission(item.permission as any)
  );

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Microscope className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">LabTracker Pro</h1>
            <p className="text-xs text-gray-500">Equipment Management</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1 rounded-md text-gray-400 hover:text-gray-500 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="px-4 py-6 flex-1">
        <ul className="space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onViewChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`mr-3 w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {item.name}
                  {item.id === 'alerts' && pendingAlertsCount > 0 && (
                    <span className="ml-auto inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {pendingAlertsCount}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile & Sign Out */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {user?.full_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.full_name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role} • {user?.department}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleSignOut}
          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
};