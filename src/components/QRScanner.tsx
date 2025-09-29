import React, { useState } from 'react';
import { Equipment } from '../types/equipment';
import { QrCode, Search, Camera, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  equipment: Equipment[];
  onEquipmentFound: (equipment: Equipment) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ equipment, onEquipmentFound }) => {
  const [scannerActive, setScannerActive] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<Equipment | null>(null);
  const [error, setError] = useState<string>('');

  const handleManualSearch = () => {
    setError('');
    const foundEquipment = equipment.find(eq => 
      eq.qrCode.toLowerCase() === manualCode.toLowerCase() ||
      eq.serialNumber.toLowerCase() === manualCode.toLowerCase() ||
      eq.id.toLowerCase() === manualCode.toLowerCase()
    );

    if (foundEquipment) {
      setScanResult(foundEquipment);
      onEquipmentFound(foundEquipment);
    } else {
      setError('No equipment found with that code');
      setScanResult(null);
    }
  };

  const simulateQRScan = (qrCode: string) => {
    const foundEquipment = equipment.find(eq => eq.qrCode === qrCode);
    if (foundEquipment) {
      setScanResult(foundEquipment);
      onEquipmentFound(foundEquipment);
      setScannerActive(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">QR Code Scanner</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner Interface */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            Camera Scanner
          </h3>

          {!scannerActive ? (
            <div className="text-center py-12">
              <div className="w-32 h-32 mx-auto mb-6 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <QrCode className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">Click to activate camera and scan QR codes</p>
              <button
                onClick={() => setScannerActive(true)}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Scanner
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-64 h-64 mx-auto mb-6 bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-4 border-2 border-blue-500 rounded-lg"></div>
                <div className="text-white text-sm">Camera Active</div>
              </div>
              <p className="text-gray-600 mb-4">Position the QR code within the frame</p>
              <div className="space-x-3">
                <button
                  onClick={() => setScannerActive(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Stop Scanner
                </button>
                {/* Simulate scanning different QR codes for Indian lab equipment */}
                <button
                  onClick={() => simulateQRScan('QR-001-CF15R')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  Simulate Scan (सेंट्रिफ्यूज)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Manual Entry */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Manual Code Entry
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter QR Code or Serial Number
              </label>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="e.g., QR-001-CF15R or SN123456789"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
              />
            </div>

            {error && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <button
              onClick={handleManualSearch}
              disabled={!manualCode.trim()}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Equipment
            </button>
          </div>

          {/* Quick Access Codes */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Access</h4>
            <div className="space-y-2">
              {equipment.slice(0, 3).map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => {
                    setManualCode(eq.qrCode);
                    simulateQRScan(eq.qrCode);
                  }}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded border border-gray-200 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">{eq.name}</div>
                  <div className="text-xs text-gray-500">{eq.qrCode}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scan Result */}
      {scanResult && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Equipment Found!</h3>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{scanResult.name}</h4>
                <p className="text-sm text-gray-600">{scanResult.model} | {scanResult.serialNumber}</p>
                <p className="text-sm text-gray-600">{scanResult.location}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                scanResult.status === 'active' ? 'bg-green-100 text-green-800' :
                scanResult.status === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {scanResult.status}
              </span>
            </div>
            <div className="mt-4">
              <button
                onClick={() => onEquipmentFound(scanResult)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};