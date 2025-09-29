import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string, metadata: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  return { data, error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Database helpers
export const getEquipment = async () => {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const getEquipmentById = async (id: string) => {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
};

export const createEquipment = async (equipment: any) => {
  const { data, error } = await supabase
    .from('equipment')
    .insert([equipment])
    .select()
    .single();
  return { data, error };
};

export const updateEquipment = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('equipment')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};

export const deleteEquipment = async (id: string) => {
  const { error } = await supabase
    .from('equipment')
    .delete()
    .eq('id', id);
  return { error };
};

export const getMaintenanceRecords = async (equipmentId?: string) => {
  let query = supabase
    .from('maintenance_records')
    .select('*')
    .order('date', { ascending: false });
  
  if (equipmentId) {
    query = query.eq('equipment_id', equipmentId);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const createMaintenanceRecord = async (record: any) => {
  const { data, error } = await supabase
    .from('maintenance_records')
    .insert([record])
    .select()
    .single();
  return { data, error };
};

export const getMaintenanceRequests = async () => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createMaintenanceRequest = async (request: any) => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .insert([request])
    .select()
    .single();
  return { data, error };
};

export const getAlerts = async () => {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
};

export const acknowledgeAlert = async (id: string, userId: string) => {
  const { data, error } = await supabase
    .from('alerts')
    .update({
      acknowledged: true,
      acknowledged_by: userId,
      acknowledged_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};