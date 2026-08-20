import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { useUsers } from '../../hooks/useUsers';
import { useAuth } from '../../hooks/useAuth';
import { UserPlus, Edit, Trash2, AlertCircle, Loader2, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { users, loading, error, refresh, createUser, updateUser, deleteUser } = useUsers();
  const { user: currentUser } = useAuth();
  
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer' as UserRole,
    isActive: true,
  });

  const filteredUsers = users.filter((u) => {
    const matchesRole = filterRole === 'ALL' || u.role.toUpperCase() === filterRole;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    return matchesRole && matchesSearch;
  });

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'customer',
      isActive: true,
    });
    setFormError(null);
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: '',
      role: user.role,
      isActive: user.isActive !== undefined ? user.isActive : true,
    });
    setFormError(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setFormError('Name, email, and phone number are required.');
      return;
    }

    setSubmitting(true);
    try {
      await createUser(formData);
      setIsCreateOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create user account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setFormError(null);

    setSubmitting(true);
    try {
      await updateUser(editUser.id, formData);
      setEditUser(null);
    } catch (err: any) {
      setFormError(err.message || 'Failed to update user account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (user: User) => {
    if (currentUser && currentUser.id === user.id) {
      alert('Security Violation: You cannot disable your own active user session account.');
      return;
    }

    try {
      await updateUser(user.id, { isActive: !user.isActive });
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;
    if (currentUser && currentUser.id === confirmDeleteId) {
      alert('Security Violation: You cannot delete your own active user account.');
      setConfirmDeleteId(null);
      return;
    }

    setSubmitting(true);
    try {
      await deleteUser(confirmDeleteId);
      setConfirmDeleteId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete user account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">SECURITY & ACCESS MANAGEMENT</span>
          <h1 className="text-2xl font-bold text-white font-heading">User Directory ({users.length})</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => refresh()}
            disabled={loading}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center justify-center disabled:opacity-50"
            title="Refresh Users"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-amber-600/20 flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Global API Error Alert */}
      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800/80 rounded-xl flex items-center space-x-3 text-red-200 text-xs">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-red-300">User Management Error</p>
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

      {/* Search & Role Filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500 max-w-sm"
        />

        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
          {['ALL', 'ADMIN', 'STAFF', 'CUSTOMER'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterRole === role
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Directory Listing */}
      {loading && users.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading user accounts directory...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl text-slate-400 text-xs">
          No user accounts found matching criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((u) => {
            const isSelf = currentUser?.id === u.id;
            return (
              <div
                key={u.id}
                className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-white text-base font-heading">{u.name}</h3>
                      {isSelf && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{u.email}</p>
                    <p className="text-xs text-slate-500">{u.phone}</p>
                  </div>

                  <div className="flex flex-col items-end space-y-1.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        u.role === 'admin'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : u.role === 'staff'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>

                    <button
                      onClick={() => handleToggleActive(u)}
                      disabled={isSelf}
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.isActive !== false
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      } disabled:opacity-50`}
                      title={isSelf ? 'Cannot disable own account' : 'Toggle status'}
                    >
                      {u.isActive !== false ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>ACTIVE</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>DISABLED</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Registered: {new Date(u.createdAt || Date.now()).toLocaleDateString()}</span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                      title="Edit user profile & role"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setConfirmDeleteId(u.id)}
                      disabled={isSelf}
                      className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition disabled:opacity-30"
                      title={isSelf ? 'Cannot delete own account' : 'Delete user'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit User Modal */}
      {(isCreateOpen || editUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white font-heading">
                {isCreateOpen ? 'Create New User Account' : `Edit User: ${editUser?.name}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditUser(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-200 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={isCreateOpen ? handleCreateSubmit : handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">System Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
                  >
                    <option value="customer">CUSTOMER</option>
                    <option value="staff">STAFF</option>
                    <option value="admin">ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Account Status</label>
                  <select
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
                  >
                    <option value="true">ACTIVE</option>
                    <option value="false">DISABLED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Password {isCreateOpen ? '(Optional)' : '(Leave blank to keep unchanged)'}
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditUser(null);
                  }}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : isCreateOpen ? 'Create Account' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-heading">Confirm Delete User Account</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete user account <span className="font-mono text-amber-400 font-bold">{confirmDeleteId}</span> from PostgreSQL? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>{submitting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
