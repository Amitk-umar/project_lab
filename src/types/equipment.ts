export interface Equipment {
  id: string;
  name: string;
  model: string;
  serial_number: string;
  manufacturer: string;
  category: string;
  subcategory?: string;
  location: string;
  room?: string;
  building?: string;
  status: 'active' | 'maintenance' | 'retired' | 'calibration' | 'repair';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  purchase_date: string;
  warranty_expiry: string;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  maintenance_interval: number; // in days
  qr_code: string;
  barcode?: string;
  rfid_tag?: string;
  specifications: string;
  notes?: string;
  cost: number;
  depreciation_rate?: number;
  current_value?: number;
  responsible_person: string;
  department: string;
  supplier?: string;
  supplier_contact?: string;
  manual_url?: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface MaintenanceRecord {
  id: string;
  equipment_id: string;
  date: string;
  type: 'routine' | 'repair' | 'calibration' | 'inspection' | 'emergency';
  description: string;
  technician_id: string;
  technician_name: string;
  cost: number;
  parts_replaced: string[];
  parts_cost: number;
  labor_hours: number;
  next_due_date: string;
  status: 'completed' | 'pending' | 'overdue' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  before_images: string[];
  after_images: string[];
  report_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface MaintenanceRequest {
  id: string;
  equipment_id: string;
  equipment_name: string;
  requested_by: string;
  requester_name: string;
  assigned_to?: string;
  assignee_name?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'routine' | 'repair' | 'calibration' | 'inspection';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  requested_date: string;
  due_date?: string;
  completed_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  notes?: string;
  attachments: string[];
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  equipment_id: string;
  equipment_name: string;
  type: 'maintenance_due' | 'warranty_expiry' | 'calibration_due' | 'equipment_issue' | 'stock_low';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  due_date?: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved: boolean;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface EquipmentUsage {
  id: string;
  equipment_id: string;
  user_id: string;
  user_name: string;
  start_time: string;
  end_time?: string;
  duration?: number; // in minutes
  purpose: string;
  notes?: string;
  created_at: string;
}

export interface InventoryStats {
  total: number;
  active: number;
  maintenance: number;
  retired: number;
  calibration: number;
  repair: number;
  totalValue: number;
  averageAge: number;
  maintenanceCosts: number;
  pendingRequests: number;
  overdueMaintenances: number;
  expiringWarranties: number;
}