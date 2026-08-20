import React, { useState } from 'react';
import { Phone, User as UserIcon, Menu, X, Building2, HardHat, Home, Info, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAuthModal }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'infra', label: 'Infra', icon: HardHat },
    { id: 'real-estate', label: 'Real Estate', icon: Building2 },
    { id: 'construction', label: 'Construction', icon: Building2 },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="font-heading font-extrabold text-slate-950 text-xl tracking-tighter">YNR</span>
            </div>
            <div>
              <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-white block leading-tight">
                YNR HAPPY HOMES
              </span>
              <span className="text-[10px] text-amber-400 tracking-widest font-semibold uppercase block">
                Infra • Real Estate • Construction
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href="tel:7385293949"
              className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/30 text-sm font-medium transition"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              <span>7385293949</span>
            </a>

            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('account')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold hover:bg-amber-500/20 transition"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{user?.name.split(' ')[0] || 'Account'}</span>
                </button>
                <button
                  onClick={logout}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 text-sm font-semibold hover:brightness-110 transition shadow-md shadow-amber-500/20"
              >
                <UserIcon className="w-4 h-4" />
                <span>Login / Account</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <a
              href="tel:7385293949"
              className="p-2 text-amber-400 bg-amber-500/10 rounded-lg"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-sm font-medium ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-5 h-5 text-amber-500" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-900 flex flex-col space-y-2">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setActiveTab('account');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold text-sm rounded-lg"
              >
                <UserIcon className="w-4 h-4" />
                <span>My Account</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuthModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-600 text-slate-950 font-semibold text-sm rounded-lg shadow-md"
              >
                <UserIcon className="w-4 h-4" />
                <span>Login / Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
