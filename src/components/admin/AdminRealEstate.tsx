import React, { useState } from 'react';
import { Plus, Trash2, Edit, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useProperties } from '../../hooks/useProperties';
import { Property, PropertyCategory, PropertyStatus } from '../../types';
import { ImagePlaceholder } from '../common/ImagePlaceholder';
import { FileUploadPicker } from './FileUploadPicker';

export const AdminRealEstate: React.FC = () => {
  const { properties, loading, error, refresh, saveProperty, deleteProperty } = useProperties();
  const [editingProperty, setEditingProperty] = useState<Partial<Property> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setFormError(null);
    setEditingProperty({
      title: '',
      category: 'Sites / Plots',
      type: 'Open Plot',
      price: '',
      location: {
        address: '',
        area: 'Mangalagiri',
        city: 'Guntur District',
        state: 'Andhra Pradesh',
      },
      description: '',
      amenities: ['APCRDA Approved', 'Clear Title', '40ft Road'],
      images: [],
      status: 'AVAILABLE',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (property: Property) => {
    setFormError(null);
    setEditingProperty({ ...property });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!editingProperty?.title || editingProperty.title.trim() === '') {
      setFormError('Property title is required.');
      return;
    }
    if (!editingProperty?.price || String(editingProperty.price).trim() === '') {
      setFormError('Property price is required.');
      return;
    }
    if (!editingProperty?.location?.area || editingProperty.location.area.trim() === '') {
      setFormError('Area / Location is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveProperty({
        id: editingProperty.id || `prop-temp-${Date.now()}`,
        title: editingProperty.title.trim(),
        category: (editingProperty.category as PropertyCategory) || 'Sites / Plots',
        type: editingProperty.type || 'Open Plot',
        price: String(editingProperty.price).trim(),
        location: {
          address: editingProperty.location?.address?.trim() || editingProperty.location?.area?.trim() || 'Mangalagiri',
          area: editingProperty.location?.area?.trim() || 'Mangalagiri',
          city: editingProperty.location?.city?.trim() || 'Guntur District',
          state: editingProperty.location?.state?.trim() || 'Andhra Pradesh',
          pincode: editingProperty.location?.pincode,
        },
        description: editingProperty.description?.trim() || '',
        amenities: editingProperty.amenities || ['APCRDA Approved', 'Clear Title'],
        images: editingProperty.images || [],
        status: (editingProperty.status as PropertyStatus) || 'AVAILABLE',
        createdAt: editingProperty.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setIsModalOpen(false);
      setEditingProperty(null);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save property listing. Please check connection and inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    try {
      await deleteProperty(confirmDeleteId);
      setConfirmDeleteId(null);
    } catch (err: any) {
      console.error('Error deleting property:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkSold = async (property: Property) => {
    try {
      await saveProperty({
        ...property,
        status: property.status === 'SOLD' ? 'AVAILABLE' : 'SOLD',
      });
    } catch (err: any) {
      console.error('Error updating property status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">REAL ESTATE MANAGEMENT</span>
          <h1 className="text-2xl font-bold text-white font-heading">Property Listings Engine</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => refresh()}
            disabled={loading}
            title="Refresh listings from backend API"
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center justify-center disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Property</span>
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
      {loading && properties.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Fetching real estate listings from REST API...</p>
        </div>
      ) : properties.length === 0 ? (
        /* Empty State */
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
          <p className="text-white font-bold text-base">No real estate properties currently published.</p>
          <p className="text-slate-400 text-xs max-w-md mx-auto">
            Click "Publish New Property" above to create real estate listings for sales in Mangalagiri/AP.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition"
          >
            Publish First Property
          </button>
        </div>
      ) : (
        /* Property Listings Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((p) => (
            <div key={p.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase">{p.category}</span>
                    <h3 className="text-xl font-bold text-white font-heading">{p.title}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    p.status === 'SOLD' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <ImagePlaceholder type="PROPERTY" title={p.title} images={p.images} aspectRatio="aspect-[16/10]" />

                <div className="flex justify-between text-xs font-bold text-amber-300">
                  <span>Price: ₹ {p.price}</span>
                  <span>Area: {p.location?.area || p.location?.address}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <button
                  onClick={() => handleMarkSold(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    p.status === 'SOLD' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}
                >
                  {p.status === 'SOLD' ? 'Mark Available' : 'Mark SOLD'}
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center space-x-1"
                  >
                    <Edit className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(p.id)}
                    className="px-3 py-1.5 bg-red-950/40 text-red-400 rounded-lg flex items-center space-x-1 hover:bg-red-900/60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-heading">Confirm Delete Property</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete property record <span className="font-mono text-amber-400 font-bold">{confirmDeleteId}</span> from PostgreSQL? This action cannot be undone.
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

      {/* Property Creator / Edit Modal */}
      {isModalOpen && editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-bold text-white font-heading">
              {editingProperty.id && !editingProperty.id.startsWith('prop-temp-') ? 'Edit Property' : 'Publish Property'}
            </h3>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Property Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 200 Sq.Yds Open Plot in Rain Tree Park"
                  value={editingProperty.title || ''}
                  onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Category</label>
                  <select
                    value={editingProperty.category || 'Sites / Plots'}
                    onChange={(e) => setEditingProperty({ ...editingProperty, category: e.target.value as PropertyCategory })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                  >
                    <option value="Land">Land</option>
                    <option value="Sites / Plots">Sites / Plots</option>
                    <option value="Apartments">Apartments</option>
                    <option value="Individual Houses">Individual Houses</option>
                    <option value="Commercial Land">Commercial Land</option>
                    <option value="Commercial Properties">Commercial Properties</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Price *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 45,00,000"
                    value={editingProperty.price || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Area / Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mangalagiri, Nambur"
                  value={editingProperty.location?.area || ''}
                  onChange={(e) => setEditingProperty({
                    ...editingProperty,
                    location: {
                      address: e.target.value,
                      area: e.target.value,
                      city: 'Guntur District',
                      state: 'Andhra Pradesh'
                    }
                  })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <FileUploadPicker
                label="Property Photograph (Optional)"
                category="PROPERTY"
                entityType="property"
                entityId={editingProperty.id}
                value={editingProperty.images?.[0] || ''}
                onChange={(url) => setEditingProperty({ ...editingProperty, images: url ? [url] : [] })}
                placeholderText="Drag & drop property photograph or click to browse"
              />

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe property features, approval authority, road width..."
                  value={editingProperty.description || ''}
                  onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
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
                  <span>{isSubmitting ? 'Saving...' : 'Save Property'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
