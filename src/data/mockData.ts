import { Equipment, MaintenanceRecord, Alert } from '../types/equipment';

export const mockEquipment: Equipment[] = [
  {
    id: 'eq-001',
    name: 'Centrifuge CF-15R',
    model: 'CF-15R',
    serialNumber: 'SN123456789',
    manufacturer: 'LabTech Solutions',
    category: 'Centrifuge',
    location: 'Lab Room A-101',
    status: 'active',
    condition: 'excellent',
    purchaseDate: '2023-01-15',
    warrantyExpiry: '2025-01-15',
    lastMaintenanceDate: '2024-11-01',
    nextMaintenanceDate: '2025-02-01',
    maintenanceInterval: 90,
    qrCode: 'QR-001-CF15R',
    specifications: 'Max Speed: 15,000 RPM, Capacity: 24 tubes, Temperature Range: -10°C to +40°C',
    notes: 'Recently serviced. Operating normally.',
    cost: 1250000,
    responsible: 'Dr. Priya Sharma'
  },
  {
    id: 'eq-002',
    name: 'PCR Thermal Cycler',
    model: 'TC-96',
    serialNumber: 'SN987654321',
    manufacturer: 'BioLab Systems',
    category: 'PCR',
    location: 'Lab Room B-205',
    status: 'maintenance',
    condition: 'good',
    purchaseDate: '2022-08-20',
    warrantyExpiry: '2024-08-20',
    lastMaintenanceDate: '2024-10-15',
    nextMaintenanceDate: '2025-01-15',
    maintenanceInterval: 120,
    qrCode: 'QR-002-TC96',
    specifications: '96-well format, Temperature accuracy: ±0.1°C, Ramp rate: 5°C/s',
    notes: 'Currently under maintenance - heating block replacement',
    cost: 2340000,
    responsible: 'Dr. Rajesh Kumar'
  },
  {
    id: 'eq-003',
    name: 'Spectrophotometer UV-2600',
    model: 'UV-2600',
    serialNumber: 'SN456789123',
    manufacturer: 'Shimadzu Corp',
    category: 'Spectrophotometer',
    location: 'Lab Room C-301',
    status: 'active',
    condition: 'excellent',
    purchaseDate: '2023-03-10',
    warrantyExpiry: '2026-03-10',
    lastMaintenanceDate: '2024-12-01',
    nextMaintenanceDate: '2025-03-01',
    maintenanceInterval: 90,
    qrCode: 'QR-003-UV2600',
    specifications: 'Wavelength Range: 185-900nm, Bandwidth: 0.1nm, Accuracy: ±0.3nm',
    notes: 'Excellent condition. Calibrated last week.',
    cost: 3750000,
    responsible: 'Dr. Anita Patel'
  },
  {
    id: 'eq-004',
    name: 'Microscope DM3000',
    model: 'DM3000',
    serialNumber: 'SN789123456',
    manufacturer: 'Leica Microsystems',
    category: 'Microscope',
    location: 'Lab Room A-102',
    status: 'calibration',
    condition: 'good',
    purchaseDate: '2021-11-05',
    warrantyExpiry: '2023-11-05',
    lastMaintenanceDate: '2024-11-20',
    nextMaintenanceDate: '2025-05-20',
    maintenanceInterval: 180,
    qrCode: 'QR-004-DM3000',
    specifications: 'Magnification: 40x-1000x, LED illumination, Camera ready',
    notes: 'Scheduled for optical calibration this week.',
    cost: 2920000,
    responsible: 'Dr. Vikram Singh'
  }
];

export const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'mr-001',
    equipmentId: 'eq-001',
    date: '2024-11-01',
    type: 'routine',
    description: 'Quarterly maintenance - cleaning, lubrication, and safety check',
    technician: 'Ramesh Gupta',
    cost: 20800,
    partsReplaced: ['Air filter', 'Rotor gaskets'],
    nextDueDate: '2025-02-01',
    status: 'completed'
  },
  {
    id: 'mr-002',
    equipmentId: 'eq-002',
    date: '2024-10-15',
    type: 'repair',
    description: 'Heating block replacement due to temperature inconsistencies',
    technician: 'Sunita Verma',
    cost: 70900,
    partsReplaced: ['Heating block assembly', 'Temperature sensor'],
    nextDueDate: '2025-01-15',
    status: 'completed'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    equipmentId: 'eq-002',
    type: 'warranty_expiry',
    title: 'Warranty Expiring Soon',
    description: 'PCR Thermal Cycler warranty expires in 30 days',
    priority: 'medium',
    date: '2024-12-15',
    acknowledged: false
  },
  {
    id: 'alert-002',
    equipmentId: 'eq-001',
    type: 'maintenance_due',
    title: 'Maintenance Due',
    description: 'Centrifuge CF-15R routine maintenance due in 7 days',
    priority: 'high',
    date: '2024-12-25',
    acknowledged: false
  },
  {
    id: 'alert-003',
    equipmentId: 'eq-004',
    type: 'calibration_due',
    title: 'Calibration Required',
    description: 'Microscope DM3000 calibration scheduled for this week',
    priority: 'medium',
    date: '2024-12-28',
    acknowledged: true
  }
];