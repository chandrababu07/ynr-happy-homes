import React, { useState } from 'react';
import { User as UserIcon, Heart, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useEnquiries } from '../../hooks/useEnquiries';
import { useProperties } from '../../hooks/useProperties';
import { ImagePlaceholder } from '../common/ImagePlaceholder';

export const CustomerPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const { enquiries } = useEnquiries();
  const { properties } = useProperties();
  const [activeTab, setActiveTab] = useState<'ENQUIRIES' | 'SAVED' | 'PROFILE'>('ENQUIRIES');

  const myEnquiries = enquiries.filter(
    (e) => e.customerPhone === user?.phone || e.customerEmail === user?.email
  );

  const savedPropertiesList = properties.filter((p) =>
    user?.savedProperties?.includes(p.id)
  );

  return (
    <div className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Profile Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-2xl font-heading shadow-inner">
            {user?.name.charAt(0).toUpperCase() || 'C'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-white font-heading">{user?.name || 'Valued Customer'}</h2>
              <span className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full uppercase font-semibold">
                Customer
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email} • {user?.phone}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-red-400 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('ENQUIRIES')}
          className={`pb-3 transition flex items-center space-x-2 ${
            activeTab === 'ENQUIRIES'
              ? 'text-amber-400 border-b-2 border-amber-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>My Enquiries ({myEnquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SAVED')}
          className={`pb-3 transition flex items-center space-x-2 ${
            activeTab === 'SAVED'
              ? 'text-amber-400 border-b-2 border-amber-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Properties ({savedPropertiesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PROFILE')}
          className={`pb-3 transition flex items-center space-x-2 ${
            activeTab === 'PROFILE'
              ? 'text-amber-400 border-b-2 border-amber-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile Info</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'ENQUIRIES' && (
        <div className="space-y-4">
          {myEnquiries.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl text-slate-400 text-sm space-y-2">
              <p className="text-slate-300 font-semibold text-base">No enquiries submitted yet.</p>
              <p>Explore our Infra equipment catalog or property section to submit enquiries.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myEnquiries.map((enq) => (
                <div key={enq.id} className="glass-panel p-5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-amber-400 font-bold uppercase block">{enq.category}</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{enq.targetTitle || 'General Enquiry'}</h4>
                    <p className="text-slate-400 mt-1">{enq.message || 'No details provided'}</p>
                    <span className="text-[10px] text-slate-500 mt-2 block">Submitted on: {new Date(enq.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-bold">
                    {enq.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'SAVED' && (
        <div className="space-y-4">
          {savedPropertiesList.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl text-slate-400 text-sm space-y-2">
              <p className="text-slate-300 font-semibold text-base">No saved properties.</p>
              <p>Browse the Real Estate section and click the heart icon to save properties here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPropertiesList.map((p) => (
                <div key={p.id} className="glass-card p-4 rounded-xl border border-slate-800 flex space-x-4">
                  <ImagePlaceholder type="PROPERTY" title={p.title} images={p.images} className="w-28 h-20 shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white">{p.title}</h4>
                    <span className="text-xs text-amber-400 font-bold block mt-1">₹ {p.price}</span>
                    <span className="text-xs text-slate-400 block mt-1">{p.location.area}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'PROFILE' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 max-w-lg">
          <h3 className="text-lg font-bold text-white font-heading">Account Profile</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">Name</span>
              <span className="font-semibold text-white">{user?.name}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Email Address</span>
              <span className="font-semibold text-white">{user?.email}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Mobile Phone</span>
              <span className="font-semibold text-white">{user?.phone}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Role</span>
              <span className="font-semibold text-amber-400 uppercase">{user?.role}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
