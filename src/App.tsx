import { useState, useEffect } from 'react';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { InfraView } from './components/public/InfraView';
import { RealEstateView } from './components/public/RealEstateView';
import { ConstructionView } from './components/public/ConstructionView';
import { AboutView } from './components/public/AboutView';
import { ContactView } from './components/public/ContactView';
import { Footer } from './components/public/Footer';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { CustomerAuthModal } from './components/customer/CustomerAuthModal';
import { EnquiryModal } from './components/common/EnquiryModal';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminInfra } from './components/admin/AdminInfra';
import { AdminRealEstate } from './components/admin/AdminRealEstate';
import { AdminConstruction } from './components/admin/AdminConstruction';
import { AdminEnquiries } from './components/admin/AdminEnquiries';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminSettings } from './components/admin/AdminSettings';
import { useAuth } from './hooks/useAuth';

export function App() {
  const { isAdmin, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [generalEnquiryOpen, setGeneralEnquiryOpen] = useState(false);

  // Check URL hash for direct /admin route access & enforce protected route security
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/admin')) {
        if (isAdmin) {
          setActiveTab('admin-panel');
        } else {
          setActiveTab('admin-login');
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isAdmin]);

  // Handle Tab Scroll to top
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Admin Login View
  if (activeTab === 'admin-login') {
    return (
      <AdminLogin
        onSuccess={() => {
          setActiveTab('admin-panel');
          window.location.hash = '#/admin';
        }}
        onCancel={() => {
          setActiveTab('home');
          window.location.hash = '';
        }}
      />
    );
  }

  // Protected Admin View (Requires Valid JWT Session & Admin Role)
  if (activeTab === 'admin-panel') {
    if (!isAdmin && !loading) {
      return (
        <AdminLogin
          onSuccess={() => {
            setActiveTab('admin-panel');
            window.location.hash = '#/admin';
          }}
          onCancel={() => {
            setActiveTab('home');
            window.location.hash = '';
          }}
        />
      );
    }

    return (
      <AdminLayout
        activeTab={adminTab}
        setActiveTab={setAdminTab}
        onLogout={() => {
          logout();
          setActiveTab('home');
          window.location.hash = '';
        }}
        onExitAdmin={() => {
          setActiveTab('home');
          window.location.hash = '';
        }}
      >
        {adminTab === 'dashboard' && <AdminDashboard onNavigate={setAdminTab} />}
        {adminTab === 'infra' && <AdminInfra />}
        {adminTab === 'real-estate' && <AdminRealEstate />}
        {adminTab === 'construction' && <AdminConstruction />}
        {adminTab === 'enquiries' && <AdminEnquiries />}
        {adminTab === 'users' && <AdminUsers />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // Render Public & Customer Experience
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      
      <div>
        <Navbar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onOpenAuthModal={() => setAuthModalOpen(true)}
        />

        <main>
          {activeTab === 'home' && (
            <>
              <Hero
                onNavigate={handleTabChange}
                onOpenEnquiry={() => setGeneralEnquiryOpen(true)}
              />
              <InfraView />
              <RealEstateView />
              <ConstructionView />
            </>
          )}

          {activeTab === 'infra' && <InfraView />}
          {activeTab === 'real-estate' && <RealEstateView />}
          {activeTab === 'construction' && <ConstructionView />}
          {activeTab === 'about' && <AboutView />}
          {activeTab === 'contact' && <ContactView />}
          {activeTab === 'account' && <CustomerPortal />}
        </main>
      </div>

      <Footer setActiveTab={handleTabChange} />

      {/* Customer Login / Signup Modal */}
      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* General Business Enquiry Modal */}
      <EnquiryModal
        isOpen={generalEnquiryOpen}
        onClose={() => setGeneralEnquiryOpen(false)}
        category="GENERAL"
        targetTitle="YNR Happy Homes General Services"
      />

    </div>
  );
}

export default App;
