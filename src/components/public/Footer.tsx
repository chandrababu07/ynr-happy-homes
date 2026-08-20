import React from 'react';
import { Phone, MapPin, HardHat, Landmark, Building2, ShieldCheck } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg font-heading shadow-md">
                YNR
              </div>
              <span className="font-bold text-lg text-white font-heading">YNR HAPPY HOMES</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Leading Infrastructure Equipment Rental, Real Estate Brokerage, and Building Construction company operating from Mangalagiri, Andhra Pradesh.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-400 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ESTABLISHED 2025</span>
            </div>
          </div>

          {/* Col 2: Business Divisions */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs font-heading">Divisions</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setActiveTab('infra')} className="hover:text-amber-400 flex items-center space-x-1.5 transition">
                  <HardHat className="w-3.5 h-3.5 text-amber-500" />
                  <span>Infra Equipment Rental</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('real-estate')} className="hover:text-amber-400 flex items-center space-x-1.5 transition">
                  <Landmark className="w-3.5 h-3.5 text-amber-500" />
                  <span>Real Estate Brokerage</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('construction')} className="hover:text-amber-400 flex items-center space-x-1.5 transition">
                  <Building2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Building Construction</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs font-heading">Quick Navigation</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-amber-400">Home</button></li>
              <li><button onClick={() => setActiveTab('about')} className="hover:text-amber-400">About Us</button></li>
              <li><button onClick={() => setActiveTab('contact')} className="hover:text-amber-400">Contact Us</button></li>
              <li><button onClick={() => setActiveTab('account')} className="hover:text-amber-400">Customer Account</button></li>
            </ul>
          </div>

          {/* Col 4: Verified Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs font-heading">Office Headquarters</h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>IJM Rain Tree Park, Nambur, Mangalagiri, Guntur District, Andhra Pradesh – 522510</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="tel:7385293949" className="text-amber-400 hover:underline font-bold text-sm">
                  7385293949
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
          <span>© 2025 YNR Happy Homes. All rights reserved.</span>
          <span>Mangalagiri, Guntur District, Andhra Pradesh</span>
        </div>

      </div>
    </footer>
  );
};
