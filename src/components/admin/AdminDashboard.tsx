import React from 'react';
import { HardHat, Landmark, Building2, MessageSquare, Users, Plus, RefreshCw, AlertCircle, Loader2, ArrowRight, Activity } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { summary, loading, error, refresh } = useDashboard();
  const { properties, projects, equipment, enquiries, users, recentActivity } = summary;

  return (
    <div className="space-y-8">
      
      {/* Header & Quick Action CTAs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">EXECUTIVE CONTROL PANEL</span>
          <h1 className="text-3xl font-extrabold text-white font-heading">Platform Overview</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => refresh()}
            disabled={loading}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center justify-center disabled:opacity-50"
            title="Refresh Dashboard Stats"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => onNavigate('real-estate')}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-lg shadow-amber-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>

          <button
            onClick={() => onNavigate('construction')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4 text-amber-500" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800/80 rounded-xl flex items-center space-x-3 text-red-200 text-xs">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-red-300">Dashboard Analytics Error</p>
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

      {/* Primary KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Real Estate KPI */}
        <div 
          onClick={() => onNavigate('real-estate')}
          className="glass-panel p-5 rounded-2xl border border-slate-800 cursor-pointer hover:border-amber-500/40 transition space-y-2 group"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Real Estate</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{properties.total}</p>
          <p className="text-xs text-amber-400 font-semibold">{properties.available} Available for Sale</p>
        </div>

        {/* Construction KPI */}
        <div 
          onClick={() => onNavigate('construction')}
          className="glass-panel p-5 rounded-2xl border border-slate-800 cursor-pointer hover:border-amber-500/40 transition space-y-2 group"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Projects</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{projects.total}</p>
          <p className="text-xs text-blue-400 font-semibold">{projects.averageProgress}% Avg Completion</p>
        </div>

        {/* Infra Fleet KPI */}
        <div 
          onClick={() => onNavigate('infra')}
          className="glass-panel p-5 rounded-2xl border border-slate-800 cursor-pointer hover:border-amber-500/40 transition space-y-2 group"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Infra Fleet</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{equipment.total}</p>
          <p className="text-xs text-emerald-400 font-semibold">{equipment.available} Ready for Rental</p>
        </div>

        {/* Customer Enquiries KPI */}
        <div 
          onClick={() => onNavigate('enquiries')}
          className="glass-panel p-5 rounded-2xl border border-slate-800 cursor-pointer hover:border-amber-500/40 transition space-y-2 group"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Customer Leads</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{enquiries.total}</p>
          <p className="text-xs text-amber-400 font-bold">{enquiries.new} New Unhandled Leads</p>
        </div>

        {/* User Directory KPI */}
        <div 
          onClick={() => onNavigate('users')}
          className="glass-panel p-5 rounded-2xl border border-slate-800 cursor-pointer hover:border-amber-500/40 transition space-y-2 group"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">Users & Access</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-heading">{users.total}</p>
          <p className="text-xs text-emerald-400 font-semibold">{users.active} Active Accounts</p>
        </div>
      </div>

      {/* Division Analytics & Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real Estate Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>Real Estate Portfolio</span>
            </h3>
            <button onClick={() => onNavigate('real-estate')} className="text-xs text-amber-400 hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Available Listings</span>
              <span className="font-bold text-emerald-400">{properties.available}</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${properties.total ? (properties.available / properties.total) * 100 : 0}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                <span className="block text-slate-400 text-[10px]">Under Offer</span>
                <span className="font-bold text-amber-400">{properties.underOffer}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                <span className="block text-slate-400 text-[10px]">Sold</span>
                <span className="font-bold text-slate-200">{properties.sold}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                <span className="block text-slate-400 text-[10px]">Archived</span>
                <span className="font-bold text-slate-500">{properties.archived}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Construction Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Construction Projects</span>
            </h3>
            <button onClick={() => onNavigate('construction')} className="text-xs text-amber-400 hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Average Completion Rate</span>
              <span className="font-bold text-amber-400">{projects.averageProgress}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${projects.averageProgress}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                <span className="block text-slate-400 text-[10px]">Planning</span>
                <span className="font-bold text-blue-400">{projects.planning}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                <span className="block text-slate-400 text-[10px]">Building</span>
                <span className="font-bold text-amber-400">{projects.underConstruction}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                <span className="block text-slate-400 text-[10px]">Completed</span>
                <span className="font-bold text-emerald-400">{projects.completed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Infra Fleet Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white font-heading flex items-center space-x-2">
              <HardHat className="w-4 h-4 text-amber-400" />
              <span>Infra Machinery Fleet</span>
            </h3>
            <button onClick={() => onNavigate('infra')} className="text-xs text-amber-400 hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Rental Availability</span>
              <span className="font-bold text-emerald-400">{equipment.available} / {equipment.total}</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${equipment.total ? (equipment.available / equipment.total) * 100 : 0}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                <span className="block text-slate-400 text-[10px]">On Rent</span>
                <span className="font-bold text-blue-400">{equipment.onRent}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                <span className="block text-slate-400 text-[10px]">Maintenance</span>
                <span className="font-bold text-amber-400">{equipment.maintenance}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                <span className="block text-slate-400 text-[10px]">Inactive</span>
                <span className="font-bold text-slate-500">{equipment.inactive}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Unified Recent Activity Timeline */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white font-heading flex items-center space-x-2">
            <Activity className="w-5 h-5 text-amber-400" />
            <span>Recent Platform Activity Timeline</span>
          </h3>
          <span className="text-xs text-slate-400">10 Most Recent Events</span>
        </div>

        {loading && recentActivity.length === 0 ? (
          <div className="p-8 text-center flex items-center justify-center space-x-2 text-slate-400 text-xs">
            <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
            <span>Compiling live platform activity...</span>
          </div>
        ) : recentActivity.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No platform activity recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((act) => (
              <div
                key={act.id}
                className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between hover:bg-slate-900 transition text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      act.type === 'ENQUIRY'
                        ? 'bg-amber-400 shadow-sm shadow-amber-400/50'
                        : act.type === 'PROPERTY'
                        ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                        : act.type === 'PROJECT'
                        ? 'bg-blue-400 shadow-sm shadow-blue-400/50'
                        : act.type === 'EQUIPMENT'
                        ? 'bg-purple-400 shadow-sm shadow-purple-400/50'
                        : 'bg-slate-400'
                    }`}
                  />
                  <div>
                    <p className="font-bold text-white text-xs">{act.title}</p>
                    <p className="text-[11px] text-slate-400">{act.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-amber-400 border border-slate-700">
                    {act.badge}
                  </span>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
