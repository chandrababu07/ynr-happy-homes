import React, { useState } from 'react';
import { Plus, Trash2, Edit, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useEquipment } from '../../hooks/useEquipment';
import { Equipment, EquipmentAvailability } from '../../types';
import { ImagePlaceholder } from '../common/ImagePlaceholder';
import { FileUploadPicker } from './FileUploadPicker';

export const AdminInfra: React.FC = () => {
  const { equipmentList, loading, error, refresh, saveEquipment, deleteEquipment } = useEquipment();
  const [editingItem, setEditingItem] = useState<Partial<Equipment> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setFormError(null);
    setEditingItem({
      name: '',
      category: 'Excavator',
      brand: 'Hyundai',
      model: '',
      description: '',
      images: [],
      specifications: {
        'Operating Weight': '21,200 kg',
        'Engine Power': '148 HP',
        'Bucket Capacity': '0.92 m³',
        'Operator': 'Provided by YNR Happy Homes',
      },
      operatorIncluded: true,
      rentalBasis: 'Hourly / Agreed duration',
      availabilityStatus: 'AVAILABLE',
      serviceArea: 'Mangalagiri, Guntur District, AP',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Equipment) => {
    setFormError(null);
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!editingItem?.name || editingItem.name.trim() === '') {
      setFormError('Equipment name is required.');
      return;
    }
    if (!editingItem?.brand || editingItem.brand.trim() === '') {
      setFormError('Brand is required.');
      return;
    }
    if (!editingItem?.model || editingItem.model.trim() === '') {
      setFormError('Model is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveEquipment({
        id: editingItem.id || `temp-${Date.now()}`,
        name: editingItem.name.trim(),
        category: editingItem.category || 'Excavator',
        brand: editingItem.brand.trim(),
        model: editingItem.model.trim(),
        description: editingItem.description?.trim() || '',
        images: editingItem.images || [],
        specifications: editingItem.specifications || {},
        operatorIncluded: editingItem.operatorIncluded ?? true,
        rentalBasis: editingItem.rentalBasis || 'Hourly / Agreed duration',
        availabilityStatus: (editingItem.availabilityStatus as EquipmentAvailability) || 'AVAILABLE',
        serviceArea: editingItem.serviceArea || 'Mangalagiri, AP',
        createdAt: editingItem.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setIsModalOpen(false);
      setEditingItem(null);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save equipment. Please check connection and inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    try {
      await deleteEquipment(confirmDeleteId);
      setConfirmDeleteId(null);
    } catch (err: any) {
      console.error('Error deleting equipment:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">INFRA DIVISION MANAGEMENT</span>
          <h1 className="text-2xl font-bold text-white font-heading">Equipment Fleet Catalog</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => refresh()}
            disabled={loading}
            title="Refresh list from backend API"
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center justify-center disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Equipment</span>
          </button>
        </div>
      </div>

      {/* Global API Error Alert */}
      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800/80 rounded-xl flex items-center space-x-3 text-red-200 text-xs">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-red-300">API Connection Issue</p>
            <p className="text-red-400/90">{error}</p>
          </div>
          <button
            onClick={() => refresh()}
            className="px-3 py-1.5 bg-red-900/60 hover:bg-red-800 text-red-100 rounded-lg text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && equipmentList.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Fetching equipment catalog from REST API...</p>
        </div>
      ) : equipmentList.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center glass-card rounded-2xl border border-slate-800 space-y-3">
          <p className="text-slate-300 text-base font-semibold">No Equipment Found</p>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            The equipment fleet catalog is currently empty. Click "Add New Equipment" to register equipment into PostgreSQL.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition"
          >
            Add First Equipment
          </button>
        </div>
      ) : (
        /* Equipment List Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {equipmentList.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase">{item.brand} • {item.category}</span>
                    <h3 className="text-xl font-bold text-white font-heading">{item.name}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    item.availabilityStatus === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {item.availabilityStatus}
                  </span>
                </div>

                <ImagePlaceholder type="EQUIPMENT" title={item.name} images={item.images} aspectRatio="aspect-[16/9]" />

                <p className="text-xs text-slate-300 line-clamp-2">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center space-x-1"
                >
                  <Edit className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit / Details</span>
                </button>
                <button
                  onClick={() => setConfirmDeleteId(item.id)}
                  className="px-3 py-1.5 bg-red-950/40 text-red-400 rounded-lg flex items-center space-x-1 hover:bg-red-900/60"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-heading">Confirm Delete Equipment</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete equipment record <span className="font-mono text-amber-400 font-bold">{confirmDeleteId}</span> from the database? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-bold text-white font-heading">
              {editingItem.id && !editingItem.id.startsWith('temp-') ? 'Edit Equipment' : 'Add New Equipment'}
            </h3>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Equipment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyundai Smart Plus 210 Excavator"
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyundai"
                    value={editingItem.brand || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Plus 210"
                    value={editingItem.model || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, model: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <FileUploadPicker
                label="Equipment Photograph (Optional)"
                category="EQUIPMENT"
                entityType="equipment"
                entityId={editingItem.id}
                value={editingItem.images?.[0] || ''}
                onChange={(url) => setEditingItem({ ...editingItem, images: url ? [url] : [] })}
                placeholderText="Drag & drop equipment photograph or click to browse"
              />

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Availability Status</label>
                <select
                  value={editingItem.availabilityStatus || 'AVAILABLE'}
                  onChange={(e) => setEditingItem({ ...editingItem, availabilityStatus: e.target.value as EquipmentAvailability })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="ON_RENT">ON RENT</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Enter equipment operational details, specs, or rental basis..."
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition flex items-center space-x-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : null}
                  <span>{isSubmitting ? 'Saving...' : 'Save Equipment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
