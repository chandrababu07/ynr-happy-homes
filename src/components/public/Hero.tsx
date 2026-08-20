import React from 'react';
import { HardHat, Building2, Landmark, ArrowRight, ShieldCheck, MapPin, Phone } from 'lucide-react';

interface HeroProps {
  onNavigate: (tab: string) => void;
  onOpenEnquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onOpenEnquiry }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/60 hero-glow">
      {/* Background Architectural Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Established Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase shadow-inner">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>ESTABLISHED 2025 • MANGALAGIRI, ANDHRA PRADESH</span>
          </div>
        </div>

        {/* Main Headline & Lead Text */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight font-heading leading-tight">
            Building Infrastructure, <br />
            <span className="gold-gradient-text">Fulfilling Living Aspirations.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            YNR Happy Homes is a premier infrastructure, real estate, and construction company operating from Mangalagiri, Andhra Pradesh. Dedicated to excellence, transparency, and high-performance equipment rental.
          </p>

          {/* Call to Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('infra')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-bold text-base rounded-xl transition shadow-xl shadow-amber-600/20 transform hover:-translate-y-0.5"
            >
              <HardHat className="w-5 h-5" />
              <span>Explore Infra Equipment</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenEnquiry}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base rounded-xl border border-slate-700 hover:border-amber-500/40 transition shadow-lg"
            >
              <Phone className="w-5 h-5 text-amber-400" />
              <span>General Enquiry</span>
            </button>
          </div>
        </div>

        {/* 3 Business Division Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: INFRA */}
          <div 
            onClick={() => onNavigate('infra')}
            className="glass-card p-6 rounded-2xl cursor-pointer group hover:border-amber-500/50"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
              <HardHat className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 block mb-1">DIVISION 01</span>
            <h3 className="text-2xl font-bold text-white font-heading group-hover:text-amber-400 transition">
              INFRA & EQUIPMENT
            </h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Construction equipment rental with experienced drivers/operators. Available for earthmoving, excavation, and site work.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-amber-400">
              <span>Hyundai Smart Plus 210 & More</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: REAL ESTATE */}
          <div 
            onClick={() => onNavigate('real-estate')}
            className="glass-card p-6 rounded-2xl cursor-pointer group hover:border-amber-500/50"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
              <Landmark className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 block mb-1">DIVISION 02</span>
            <h3 className="text-2xl font-bold text-white font-heading group-hover:text-amber-400 transition">
              REAL ESTATE
            </h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Trusted brokerage bridging property owners and buyers for Land, Plots, Apartments, Houses, and Commercial properties.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-amber-400">
              <span>Explore Property Listings</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: CONSTRUCTION */}
          <div 
            onClick={() => onNavigate('construction')}
            className="glass-card p-6 rounded-2xl cursor-pointer group hover:border-amber-500/50"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 block mb-1">DIVISION 03</span>
            <h3 className="text-2xl font-bold text-white font-heading group-hover:text-amber-400 transition">
              CONSTRUCTION
            </h3>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Developing premium residential apartments, individual houses, and commercial complexes with floor plans and progress updates.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-amber-400">
              <span>View Building Projects</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </div>
          </div>

        </div>

        {/* Location Footer Bar */}
        <div className="mt-12 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span>IJM Rain Tree Park, Nambur, Mangalagiri, Guntur District, Andhra Pradesh – 522510</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Direct Call: <strong className="text-slate-200">7385293949</strong></span>
            <span>Est: <strong className="text-slate-200">2025</strong></span>
          </div>
        </div>

      </div>
    </section>
  );
};
