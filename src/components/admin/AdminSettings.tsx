import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { storageService } from '../../services/storage';

export const AdminSettings: React.FC = () => {
  const [info, setInfo] = useState(storageService.getCompanyInfo());
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateCompanyInfo(info);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="border-b border-slate-800 pb-4">
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">BUSINESS CONFIGURATION</span>
        <h1 className="text-2xl font-bold text-white font-heading">Company Information & Contact</h1>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Business settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Company Name</label>
          <input
            type="text"
            required
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-bold"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Established Year</label>
          <input
            type="number"
            required
            value={info.establishedYear}
            onChange={(e) => setInfo({ ...info, establishedYear: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-bold"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Contact Phone Helpline</label>
          <input
            type="text"
            required
            value={info.phone}
            onChange={(e) => setInfo({ ...info, phone: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-400 font-bold"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Office Location Address</label>
          <textarea
            rows={3}
            required
            value={info.address}
            onChange={(e) => setInfo({ ...info, address: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-medium"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </form>
    </div>
  );
};
