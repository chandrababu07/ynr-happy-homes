import React from 'react';
import { LayoutDashboard, HardHat, Landmark, Building2, MessageSquare, Users, Settings, LogOut, ExternalLink } from 'lucide-react';

interface AdminLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onExitAdmin: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  onExitAdmin,
  children,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'infra', label: 'Infra Equipment', icon: HardHat },
    { id: 'real-estate', label: 'Real Estate Listings', icon: Landmark },
    { id: 'construction', label: 'Construction Projects', icon: Building2 },
    { id: 'enquiries', label: 'Customer Enquiries', icon: MessageSquare },
    { id: 'users', label: 'User & Role Directory', icon: Users },
    { id: 'settings', label: 'Business Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg font-heading shadow-md">
              YNR
            </div>
            <div>
              <span className="font-bold text-base text-white font-heading block">Admin Portal</span>
              <span className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase block">
                YNR Happy Homes
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

        </div>

        {/* Footer CTAs */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          <button
            onClick={onExitAdmin}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>View Public Site</span>
          </button>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 text-red-400 text-xs font-medium rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>

      </aside>

      {/* Main Admin Body Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {children}
      </main>

    </div>
  );
};
