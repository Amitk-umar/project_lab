export interface ReportFilter {
  dateRange: {
    start: string;
    end: string;
  };
  equipmentIds?: string[];
  categories?: string[];
  departments?: string[];
  status?: string[];
  locations?: string[];
}

export interface UsageReport {
  equipment_id: string;
  equipment_name: string;
  total_usage_hours: number;
  usage_sessions: number;
  average_session_duration: number;
  most_frequent_user: string;
  department: string;
  utilization_rate: number;
}

export interface MaintenanceCostReport {
  equipment_id: string;
  equipment_name: string;
  total_cost: number;
  routine_cost: number;
  repair_cost: number;
  parts_cost: number;
  labor_cost: number;
  maintenance_count: number;
  cost_per_maintenance: number;
  cost_trend: 'increasing' | 'decreasing' | 'stable';
}

export interface AgingReport {
  equipment_id: string;
  equipment_name: string;
  age_years: number;
  condition: string;
  depreciated_value: number;
  replacement_due_date?: string;
  maintenance_frequency: number;
  reliability_score: number;
}

export interface ComplianceReport {
  equipment_id: string;
  equipment_name: string;
  last_calibration: string;
  next_calibration: string;
  calibration_status: 'current' | 'due' | 'overdue';
  compliance_score: number;
  certifications: string[];
  audit_findings: string[];
}