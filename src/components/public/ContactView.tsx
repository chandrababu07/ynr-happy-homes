import React, { useState } from 'react';
import { Phone, MapPin, MessageSquare, Send, CheckCircle2, Clock } from 'lucide-react';
import { useEnquiries } from '../../hooks/useEnquiries';
import { EnquiryCategory } from '../../types';

export const ContactView: React.FC = () => {
  const { submitEnquiry } = useEnquiries();
  const [formData, setFormData] = useState({
    category: 'GENERAL' as EnquiryCategory,
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerLocation: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerPhone) return;

    setSubmitting(true);
    try {
      await submitEnquiry({
        category: formData.category,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        customerLocation: formData.customerLocation,
        message: formData.message,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hello YNR Happy Homes,\n\nName: ${formData.customerName}\nPhone: ${formData.customerPhone}\nCategory: ${formData.category}\nMessage: ${formData.message}`
    );
    return `https://wa.me/917385293949?text=${text}`;
  };

  return (
    <div className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Phone className="w-4 h-4 text-amber-400" />
          <span>CONTACT US</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
          Get in Touch with YNR Happy Homes
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Reach out for equipment rental quotes, property enquiries, or building project details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <h3 className="text-xl font-bold text-white font-heading border-b border-slate-800 pb-3">
              Office & Business Information
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Address</strong>
                  <span className="text-slate-300">
                    IJM Rain Tree Park, Nambur, Mangalagiri, Guntur District, Andhra Pradesh – 522510
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Phone Helpline</strong>
                  <a href="tel:7385293949" className="text-amber-400 hover:underline font-bold text-base">
                    7385293949
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Business Hours</strong>
                  <span className="text-slate-300">Monday – Saturday: 9:00 AM – 7:00 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center space-x-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Connect via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Visual Placeholder */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Location Map</h4>
            <div className="w-full h-48 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] opacity-30"></div>
              <MapPin className="w-8 h-8 text-amber-500 mb-2 relative z-10 animate-bounce" />
              <span className="text-xs font-bold text-slate-200 relative z-10">IJM Rain Tree Park, Nambur</span>
              <span className="text-[11px] text-slate-400 relative z-10">Mangalagiri, AP – 522510</span>
            </div>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white font-heading">Enquiry Received!</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Thank you for reaching out to YNR Happy Homes. Our representative will contact you shortly at <span className="text-amber-400 font-semibold">{formData.customerPhone}</span>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      category: 'GENERAL',
                      customerName: '',
                      customerPhone: '',
                      customerEmail: '',
                      customerLocation: '',
                      message: '',
                    });
                  }}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-lg"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-bold text-white font-heading border-b border-slate-800 pb-3">
                  Send Us an Enquiry Message
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Enquiry Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['INFRA', 'REAL_ESTATE', 'CONSTRUCTION', 'GENERAL'] as EnquiryCategory[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`py-2 text-xs font-semibold rounded-lg border transition ${
                          formData.category === cat
                            ? 'bg-amber-500 text-slate-950 border-amber-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {cat.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Full Name <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Phone Number <span className="text-amber-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Mobile number"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Location / Area
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mangalagiri, Guntur"
                      value={formData.customerLocation}
                      onChange={(e) => setFormData({ ...formData, customerLocation: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Email Address <span className="text-slate-500">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Your Message / Requirements
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your machinery rental needs, property requirements, or construction questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-600/20 transition disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Submit Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
