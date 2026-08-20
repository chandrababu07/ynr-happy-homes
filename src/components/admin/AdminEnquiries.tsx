import React, { useState, useMemo } from 'react';
import { Trash2, AlertCircle, Loader2, RefreshCw, Search, CheckCircle2, Clock, Filter, PhoneCall } from 'lucide-react';
import { useEnquiries } from '../../hooks/useEnquiries';
import { EnquiryStatus } from '../../types';

export const AdminEnquiries: React.FC = () => {
  const { enquiries, loading, error, refresh, updateStatus, deleteEnquiry } = useEnquiries();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter and Search Aggregation
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchCategory = filterCategory === 'ALL' || e.category === filterCategory;
      const matchStatus = filterStatus === 'ALL' || e.status === filterStatus;
      
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        (e.customerName && e.customerName.toLowerCase().includes(q)) ||
        (e.customerPhone && e.customerPhone.includes(q)) ||
        (e.customerEmail && e.customerEmail.toLowerCase().includes(q)) ||
        (e.customerLocation && e.customerLocation.toLowerCase().includes(q)) ||
        (e.targetTitle && e.targetTitle.toLowerCase().includes(q)) ||
        (e.message && e.message.toLowerCase().includes(q));

      return matchCategory && matchStatus && matchQuery;
    });
  }, [enquiries, filterCategory, filterStatus, searchQuery]);

  // Status Counts Summary
  const stats = useMemo(() => {
    const total = enquiries.length;
    const newLeads = enquiries.filter((e) => e.status === 'NEW').length;
    const inProgress = enquiries.filter((e) => e.status === 'CONTACTED' || e.status === 'IN_PROGRESS').length;
    const closed = enquiries.filter((e) => e.status === 'CLOSED').length;
    return { total, newLeads, inProgress, closed };
  }, [enquiries]);

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    try {
      await deleteEnquiry(confirmDeleteId);
      setConfirmDeleteId(null);
    } catch (err: any) {
      console.error('Error deleting enquiry:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">CUSTOMER LEADS & RENTALS</span>
          <h1 className="text-2xl font-bold text-white font-heading">Enquiry Inbox ({enquiries.length})</h1>
        </div>

        <button
          onClick={() => refresh()}
          disabled={loading}
          title="Refresh lead inquiries from backend API"
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center justify-center disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
        </button>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-medium">Total Leads</span>
            <p className="text-lg font-bold text-white font-mono">{stats.total}</p>
          </div>
          <PhoneCall className="w-5 h-5 text-amber-400" />
        </div>
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-emerald-400 font-medium">New Leads</span>
            <p className="text-lg font-bold text-emerald-300 font-mono">{stats.newLeads}</p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-amber-400 font-medium">In Follow-Up</span>
            <p className="text-lg font-bold text-amber-300 font-mono">{stats.inProgress}</p>
          </div>
          <Clock className="w-5 h-5 text-amber-400" />
        </div>
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-slate-400 font-medium">Closed / Won</span>
            <p className="text-lg font-bold text-slate-300 font-mono">{stats.closed}</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="space-y-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search leads by customer name, phone, location, target title, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category & Status Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1 text-xs">
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto w-full sm:w-auto">
            <span className="text-[10px] text-slate-500 font-semibold px-2">Category:</span>
            {['ALL', 'INFRA', 'REAL_ESTATE', 'CONSTRUCTION', 'GENERAL'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto w-full sm:w-auto">
            <span className="text-[10px] text-slate-500 font-semibold px-2 flex items-center space-x-1">
              <Filter className="w-3 h-3 text-amber-500" />
              <span>Status:</span>
            </span>
            {['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap ${
                  filterStatus === st
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
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
      {loading && enquiries.length === 0 ? (
        <div className="p-12 text-center glass-card rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Fetching customer lead inquiries from REST API...</p>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        /* Empty State */
        <div className="glass-panel p-12 text-center rounded-2xl text-slate-400 text-xs">
          No customer enquiries found in this category.
        </div>
      ) : (
        /* Enquiries List */
        <div className="space-y-4">
          {filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {enq.category}
                  </span>
                  <h3 className="text-lg font-bold text-white font-heading">
                    {enq.targetTitle || 'General Customer Inquiry'}
                  </h3>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-slate-400">Status:</span>
                  <select
                    value={enq.status}
                    onChange={(e) => updateStatus(enq.id, e.target.value as EnquiryStatus)}
                    className="bg-slate-950 text-amber-400 font-bold border border-slate-800 rounded-lg px-2.5 py-1 focus:border-amber-500 outline-none"
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                  <button
                    onClick={() => setConfirmDeleteId(enq.id)}
                    className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition ml-2"
                    title="Delete lead record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Customer Name</span>
                  <span className="font-bold text-white text-sm">{enq.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contact Phone</span>
                  <a href={`tel:${enq.customerPhone}`} className="font-bold text-amber-400 text-sm hover:underline">
                    {enq.customerPhone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block">Location</span>
                  <span className="font-semibold text-slate-200">{enq.customerLocation || 'N/A'}</span>
                </div>
              </div>

              {enq.dateRequired && (
                <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-xs text-emerald-300 font-semibold flex items-center justify-between">
                  <span>📅 Requested Site Visit Date:</span>
                  <span className="font-bold text-white bg-emerald-900/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/40">{enq.dateRequired}</span>
                </div>
              )}

              {enq.duration && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-amber-300">
                  Required Rental Duration: <strong>{enq.duration}</strong>
                </div>
              )}

              {enq.message && (
                <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 block mb-0.5">Message / Requirements:</span>
                  {enq.message}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                <span>Received: {new Date(enq.createdAt).toLocaleString()}</span>
                <a
                  href={`https://wa.me/91${enq.customerPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  Reply via WhatsApp →
                </a>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-heading">Confirm Delete Customer Lead</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete lead enquiry record <span className="font-mono text-amber-400 font-bold">{confirmDeleteId}</span> from PostgreSQL? This action cannot be undone.
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
    </div>
  );
};
