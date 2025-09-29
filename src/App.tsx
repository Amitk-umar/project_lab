import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/Dashboard';
import { EquipmentList } from './components/EquipmentList';
import { EquipmentDetail } from './components/EquipmentDetail';
import { QRScanner } from './components/qr/QRScanner';
import { AlertCenter } from './components/AlertCenter';
import { EquipmentForm } from './components/equipment/EquipmentForm';
import { Equipment, MaintenanceRecord, Alert } from './types/equipment';
import { mockEquipment, mockMaintenanceRecords, mockAlerts } from './data/mockData';
import { Menu, Microscope } from 'lucide-react';

type View = 'dashboard' | 'equipment' | 'scanner' | 'alerts' | 'maintenance' | 'reports' | 'users' | 'settings';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
  const [maintenanceRecords] = useState<MaintenanceRecord[]>(mockMaintenanceRecords);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  useEffect(() => {
    // Load data from localStorage or API
    const savedEquipment = localStorage.getItem('lab-equipment');
    if (savedEquipment) {
      setEquipment(JSON.parse(savedEquipment));
    }
  }, []);

  useEffect(() => {
    // Save equipment to localStorage
    localStorage.setItem('lab-equipment', JSON.stringify(equipment));
  }, [equipment]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Microscope className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleSelectEquipment = (eq: Equipment) => {
    setSelectedEquipment(eq);
    setCurrentView('equipment');
  };

  const handleBackFromDetail = () => {
    setSelectedEquipment(null);
    setShowEquipmentForm(false);
    setEditingEquipment(null);
    setCurrentView('equipment');
  };

  const handleAddEquipment = () => {
    setEditingEquipment(null);
    setShowEquipmentForm(true);
    setSelectedEquipment(null);
  };

  const handleEditEquipment = (eq: Equipment) => {
    setEditingEquipment(eq);
    setShowEquipmentForm(true);
    setSelectedEquipment(null);
  };

  const handleSaveEquipment = async (equipmentData: Partial<Equipment>) => {
    if (editingEquipment) {
      // Update existing equipment
      setEquipment(prev => prev.map(eq => 
        eq.id === editingEquipment.id 
          ? { ...eq, ...equipmentData, updated_at: new Date().toISOString() }
          : eq
      ));
    } else {
      // Add new equipment
      const newEquipment: Equipment = {
        id: `eq-${Date.now()}`,
        ...equipmentData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Equipment;
      setEquipment(prev => [newEquipment, ...prev]);
    }
    setShowEquipmentForm(false);
    setEditingEquipment(null);
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            acknowledged: true, 
            acknowledged_by: user.id,
            acknowledged_at: new Date().toISOString()
          } 
        : alert
    ));
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const pendingAlertsCount = alerts.filter(alert => !alert.acknowledged).length;

  const renderContent = () => {
    if (showEquipmentForm) {
      return (
        <EquipmentForm
          equipment={editingEquipment || undefined}
          onSave={handleSaveEquipment}
          onCancel={handleBackFromDetail}
        />
      );
    }

    if (selectedEquipment && currentView === 'equipment') {
      return (
        <EquipmentDetail
          equipment={selectedEquipment}
          maintenanceRecords={maintenanceRecords}
          onBack={handleBackFromDetail}
          onEdit={handleEditEquipment}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard equipment={equipment} alerts={alerts} />;
      case 'equipment':
        return (
          <EquipmentList 
            equipment={equipment} 
            onSelectEquipment={handleSelectEquipment}
            onAddEquipment={handleAddEquipment}
          />
        );
      case 'scanner':
        return <QRScanner equipment={equipment} onEquipmentFound={handleSelectEquipment} />;
      case 'alerts':
        return (
          <AlertCenter
            alerts={alerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onDismissAlert={handleDismissAlert}
          />
        );
      case 'maintenance':
        return <div className="p-6 text-center text-gray-500">Maintenance module coming soon...</div>;
      case 'reports':
        return <div className="p-6 text-center text-gray-500">Reports module coming soon...</div>;
      case 'users':
        return <div className="p-6 text-center text-gray-500">User management coming soon...</div>;
      case 'settings':
        return <div className="p-6 text-center text-gray-500">Settings coming soon...</div>;
      default:
        return <Dashboard equipment={equipment} alerts={alerts} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        pendingAlertsCount={pendingAlertsCount}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Microscope className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-gray-900">LabTracker Pro</span>
            </div>
            <div className="w-9" />
          </div>
        </div>

        {/* Content Area */}
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;