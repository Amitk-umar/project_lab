import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Equipment } from '../../types/equipment';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Save, 
  X, 
  Upload, 
  QrCode, 
  AlertCircle,
  Calendar,
  DollarSign,
  MapPin,
  User,
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

const equipmentSchema = z.object({
  name: z.string().min(1, 'Equipment name is required'),
  model: z.string().min(1, 'Model is required'),
  serial_number: z.string().min(1, 'Serial number is required'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  room: z.string().optional(),
  building: z.string().optional(),
  status: z.enum(['active', 'maintenance', 'retired', 'calibration', 'repair']),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']),
  purchase_date: z.string().min(1, 'Purchase date is required'),
  warranty_expiry: z.string().min(1, 'Warranty expiry is required'),
  maintenance_interval: z.number().min(1, 'Maintenance interval must be at least 1 day'),
  specifications: z.string().min(1, 'Specifications are required'),
  notes: z.string().optional(),
  cost: z.number().min(0, 'Cost must be positive'),
  depreciation_rate: z.number().min(0).max(100).optional(),
  responsible_person: z.string().min(1, 'Responsible person is required'),
  department: z.string().min(1, 'Department is required'),
  supplier: z.string().optional(),
  supplier_contact: z.string().optional(),
  manual_url: z.string().url().optional().or(z.literal(''))
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

interface EquipmentFormProps {
  equipment?: Equipment;
  onSave: (equipment: Partial<Equipment>) => Promise<void>;
  onCancel: () => void;
}

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
  equipment,
  onSave,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: equipment ? {
      name: equipment.name,
      model: equipment.model,
      serial_number: equipment.serial_number,
      manufacturer: equipment.manufacturer,
      category: equipment.category,
      subcategory: equipment.subcategory || '',
      location: equipment.location,
      room: equipment.room || '',
      building: equipment.building || '',
      status: equipment.status,
      condition: equipment.condition,
      purchase_date: equipment.purchase_date,
      warranty_expiry: equipment.warranty_expiry,
      maintenance_interval: equipment.maintenance_interval,
      specifications: equipment.specifications,
      notes: equipment.notes || '',
      cost: equipment.cost,
      depreciation_rate: equipment.depreciation_rate || 0,
      responsible_person: equipment.responsible_person,
      department: equipment.department,
      supplier: equipment.supplier || '',
      supplier_contact: equipment.supplier_contact || '',
      manual_url: equipment.manual_url || ''
    } : {
      status: 'active',
      condition: 'excellent',
      maintenance_interval: 90,
      cost: 0,
      depreciation_rate: 10,
      department: user?.department || '',
      responsible_person: user?.full_name || ''
    }
  });

  const categories = [
    'Centrifuge',
    'Microscope',
    'Spectrophotometer',
    'PCR Machine',
    'Incubator',
    'Autoclave',
    'Balance',
    'pH Meter',
    'Chromatography',
    'Electrophoresis',
    'Other'
  ];

  const departments = [
    'Chemistry',
    'Biology',
    'Physics',
    'Microbiology',
    'Pathology',
    'Biochemistry',
    'Pharmacology',
    'Research & Development',
    'Quality Control',
    'Other'
  ];

  const generateQRCode = async () => {
    const serialNumber = watch('serial_number');
    if (!serialNumber) {
      toast.error('Please enter a serial number first');
      return;
    }

    try {
      const qrCode = `QR-${Date.now()}-${serialNumber}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrCode);
      setQrCodeUrl(qrCodeDataUrl);
      setValue('qr_code' as any, qrCode);
      toast.success('QR Code generated successfully');
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  const onSubmit = async (data: EquipmentFormData) => {
    setLoading(true);
    try {
      const equipmentData = {
        ...data,
        qr_code: equipment?.qr_code || `QR-${Date.now()}-${data.serial_number}`,
        current_value: data.cost * (1 - (data.depreciation_rate || 0) / 100),
        image_urls: equipment?.image_urls || [],
        created_by: equipment?.created_by || user?.id || '',
        updated_by: user?.id || '',
        created_at: equipment?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await onSave(equipmentData);
      toast.success(equipment ? 'Equipment updated successfully' : 'Equipment created successfully');
    } catch (error) {
      toast.error('Failed to save equipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {equipment ? 'Edit Equipment' : 'Add New Equipment'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipment Name *
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                {...register('name')}
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter equipment name"
              />
            </div>
            {errors.name && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name.message}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model *
            </label>
            <input
              {...register('model')}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter model number"
            />
            {errors.model && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.model.message}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Serial Number *
            </label>
            <div className="flex space-x-2">
              <input
                {...register('serial_number')}
                type="text"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter serial number"
              />
              <button
                type="button"
                onClick={generateQRCode}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <QrCode className="w-5 h-5" />
              </button>
            </div>
            {errors.serial_number && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.serial_number.message}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manufacturer *
            </label>
            <input
              {...register('manufacturer')}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter manufacturer"
            />
            {errors.manufacturer && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.manufacturer.message}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              {...register('category')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.category.message}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory
            </label>
            <input
              {...register('subcategory')}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter subcategory (optional)"
            />
          </div>
        </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                {...register('location')}
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Lab Room A-101"
              />
            </div>
            {errors.location && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.location.message}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room
            </label>
            <input
              {...register('room')}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Room number (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Building
            </label>
            <input
              {...register('building')}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Building name (optional)"
            />
          </div>
        </div>

        {/* Status and Condition */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              {...register('status')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="maintenance">Under Maintenance</option>
              <option value="calibration">Calibration</option>
              <option value="repair">Under Repair</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition *
            </label>
            <select
              {...register('condition')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
          </div>
        </div>

        {/* Dates and Financial */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                {...register('purchase_date')}
                type="date"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {errors.purchase_date && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.purchase_date.message}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Warranty Expiry *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                {...register('warranty_expiry')}
                type="date"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {errors.warranty_expiry && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.warranty_expiry.message}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Cost (₹) *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                {...register('cost', { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            {errors.cost && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.cost.message}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maintenance Interval (days) *
            </label>
            <input
              {...register('maintenance_interval', { valueAsNumber: true })}
              type="number"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="90"
            />
            {errors.maintenance_interval && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.maintenance_interval.message}
              </div>
            )}
          </div>
        </div>

        {/* Responsibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsible Person *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                {...register('responsible_person')}
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Dr. Priya Sharma"
              />
            </div>
            {errors.responsible_person && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.responsible_person.message}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <select
              {...register('department')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.department.message}
              </div>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specifications *
          </label>
          <textarea
            {...register('specifications')}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter detailed specifications..."
          />
          {errors.specifications && (
            <div className="flex items-center mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.specifications.message}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Additional notes (optional)..."
          />
        </div>

        {/* QR Code Preview */}
        {qrCodeUrl && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Generated QR Code</h3>
            <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : equipment ? 'Update Equipment' : 'Create Equipment'}
          </button>
        </div>
      </form>
    </div>
  );
};