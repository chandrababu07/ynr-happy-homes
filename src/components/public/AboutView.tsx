import React from 'react';
import { Building2, HardHat, Landmark, ShieldCheck, MapPin, Phone, Calendar } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>ABOUT YNR HAPPY HOMES</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
          Committed to Excellence in Infrastructure & Housing
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Established in 2025 in Mangalagiri, Andhra Pradesh, YNR Happy Homes operates across three core business divisions: Infrastructure Equipment Rental, Real Estate Brokerage, and Building Construction.
        </p>
      </div>

      {/* Verified Business Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
          <Calendar className="w-8 h-8 text-amber-500" />
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Established</span>
          <p className="text-2xl font-bold text-white font-heading">Year 2025</p>
          <p className="text-xs text-slate-400">Founded with a vision for modern development</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
          <MapPin className="w-8 h-8 text-amber-500" />
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Headquarters</span>
          <p className="text-xl font-bold text-white font-heading">Mangalagiri, AP</p>
          <p className="text-xs text-slate-400">IJM Rain Tree Park, Nambur, Guntur District</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
          <Phone className="w-8 h-8 text-amber-500" />
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Direct Contact</span>
          <p className="text-xl font-bold text-white font-heading">7385293949</p>
          <p className="text-xs text-slate-400">Customer helpline & rental bookings</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
          <Building2 className="w-8 h-8 text-amber-500" />
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Divisions</span>
          <p className="text-xl font-bold text-white font-heading">3 Key Pillars</p>
          <p className="text-xs text-slate-400">Infra, Real Estate, Construction</p>
        </div>
      </div>

      {/* 3 Business Pillars Overview */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white font-heading border-b border-slate-800 pb-3">
          Our Business Divisions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <HardHat className="w-5 h-5" />
            </div>
            <h4 className="text-xl font-bold text-white font-heading">1. INFRA</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Provides heavy construction machinery for rental on hourly or agreed duration contracts. Supplied with trained machine drivers/operators. Featuring Hyundai Smart Plus 210 excavators and upcoming equipment fleet.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <h4 className="text-xl font-bold text-white font-heading">2. REAL ESTATE</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Acts as a trusted broker bridging property owners and buyers for Land, Sites/Plots, Apartments, Individual Houses, Commercial Land, and Commercial Properties in Andhra Pradesh.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-xl font-bold text-white font-heading">3. CONSTRUCTION</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Constructs high-quality residential apartments, individual houses, and commercial complexes. Features interactive unit matrices, floor plans, and construction progress tracking.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
