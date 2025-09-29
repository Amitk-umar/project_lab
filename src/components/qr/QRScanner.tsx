import React, { useState, useRef } from 'react';
import { Equipment } from '../../types/equipment';
import { QrCode, Search, Camera, AlertCircle, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRScannerProps {
  equipment: Equipment[];
  onEquipmentFound: (equipment: Equipment) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ equipment, onEquipmentFound }) => {
  const [scannerActive, setScannerActive] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<Equipment | null>(null);
  const [error, setError] = useState<string>('');
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleManualSearch = () => {
    setError('');
    const foundEquipment = equipment.find(eq => 
      eq.qr_code.toLowerCase() === manualCode.toLowerCase() ||
      eq.serial_number.toLowerCase() === manualCode.toLowerCase() ||
      eq.id.toLowerCase() === manualCode.toLowerCase()
    );

    if (foundEquipment) {
      setScanResult(foundEquipment);
      toast.success('Equipment found!');
    } else {
      setError('No equipment found with that code');
      setScanResult(null);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScannerActive(true);
        setScanning(true);
      }
    } catch (error) {
      toast.error('Unable to access camera. Please check permissions.');
      console.error('Camera access error:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScannerActive(false);
    setScanning(false);
  };

  const simulateQRScan = (qrCode: string) => {
    const foundEquipment = equipment.find(eq => eq.qr_code === qrCode);
    if (foundEquipment) {
      setScanResult(foundEquipment);
      toast.success('Equipment scanned successfully!');
      stopCamera();
    }
  };

  const clearResult = () => {
    setScanResult(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">QR Code Scanner</h2>
        <div className="text-sm text-gray-500">
          Scan equipment QR codes for quick access
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera Scanner */}
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
                onClick={startCamera}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Camera
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="relative w-full max-w-sm mx-auto mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                />
                <div className="absolute inset-4 border-2 border-blue-500 rounded-lg pointer-events-none">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500"></div>
                </div>
                {scanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                      Scanning...
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-4">Position the QR code within the frame</p>
              
              <div className="space-y-3">
                <div className="flex justify-center space-x-3">
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Stop Camera
                  </button>
                </div>
                
                {/* Demo buttons for testing */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Demo - Click to simulate scan:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {equipment.slice(0, 3).map((eq) => (
                      <button
                        key={eq.id}
                        onClick={() => simulateQRScan(eq.qr_code)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200 transition-colors"
                      >
                        {eq.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Equipment
            </button>
          </div>

          {/* Quick Access */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Access</h4>
            <div className="space-y-2">
              {equipment.slice(0, 4).map((eq) => (
                <button
                  key={eq.id}
                  onClick={() => {
                    setManualCode(eq.qr_code);
                    setScanResult(eq);
                    setError('');
                  }}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{eq.name}</div>
                      <div className="text-xs text-gray-500">{eq.qr_code}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      eq.status === 'active' ? 'bg-green-100 text-green-800' :
                      eq.status === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {eq.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scan Result */}
      {scanResult && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-green-800">Equipment Found!</h3>
            </div>
            <button
              onClick={clearResult}
              className="text-green-600 hover:text-green-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{scanResult.name}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Model:</span> {scanResult.model}</p>
                  <p><span className="font-medium">Serial:</span> {scanResult.serial_number}</p>
                  <p><span className="font-medium">Location:</span> {scanResult.location}</p>
                  <p><span className="font-medium">Department:</span> {scanResult.department}</p>
                </div>
              </div>
              
              <div className="flex flex-col justify-between">
                <div className="mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    scanResult.status === 'active' ? 'bg-green-100 text-green-800' :
                    scanResult.status === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                    scanResult.status === 'repair' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {scanResult.status.charAt(0).toUpperCase() + scanResult.status.slice(1)}
                  </span>
                </div>
                
                <button
                  onClick={() => onEquipmentFound(scanResult)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};