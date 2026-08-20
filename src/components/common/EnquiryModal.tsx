import React, { useState } from 'react';
import { X, Send, Phone, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { EnquiryCategory } from '../../types';
import { useEnquiries } from '../../hooks/useEnquiries';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: EnquiryCategory;
  targetId?: string;
  targetTitle?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  category,
  targetId,
  targetTitle,
}) => {
  const { submitEnquiry } = useEnquiries();
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerLocation: '',
    dateRequired: '',
    duration: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.customerName || formData.customerName.trim() === '') {
      setFormError('Your full name is required.');
      return;
    }
    if (!formData.customerPhone || formData.customerPhone.trim() === '') {
      setFormError('Your mobile phone number is required.');
      return;
    }
    if (!/^\+?[0-9\s\-]{10,15}$/.test(formData.customerPhone.trim())) {
      setFormError('Please enter a valid 10 to 15 digit mobile phone number.');
      return;
    }

    setSubmitting(true);
    try {
      await submitEnquiry({
        category,
        targetId,
        targetTitle,
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerEmail: formData.customerEmail.trim() || undefined,
        customerLocation: formData.customerLocation.trim() || undefined,
        dateRequired: formData.dateRequired || undefined,
        duration: formData.duration.trim() || undefined,
        message: formData.message.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit enquiry. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hello YNR Happy Homes,\n\nI want to enquire about ${category}: ${targetTitle || 'Services'}.\n` +
      `Name: ${formData.customerName}\nPhone: ${formData.customerPhone}\n` +
      (formData.customerLocation ? `Work Location: ${formData.customerLocation}\n` : '') +
      (formData.dateRequired ? `Preferred Site Visit Date: ${formData.dateRequired}\n` : '') +
      (formData.duration ? `Required Duration: ${formData.duration}\n` : '') +
      (formData.message ? `Message: ${formData.message}` : '')
    );
    return `https://wa.me/917385293949?text=${text}`;
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormError(null);
    setFormData({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerLocation: '',
      dateRequired: '',
      duration: '',
      message: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/40">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              YNR HAPPY HOMES • {category} ENQUIRY
            </span>
            <h3 className="text-xl font-bold text-slate-100 font-heading mt-0.5">
              {targetTitle ? `Enquire for ${targetTitle}` : 'Contact YNR Happy Homes'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-white font-heading">Enquiry Submitted!</h4>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                Thank you for contacting YNR Happy Homes. Our representative will reach out to you shortly at <span className="font-semibold text-amber-400">{formData.customerPhone}</span>.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp Now</span>
                </a>
                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Your Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Phone Number <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {category === 'INFRA' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Work / Project Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mangalagiri, Nambur, Guntur"
                      value={formData.customerLocation}
                      onChange={(e) => setFormData({ ...formData, customerLocation: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Required Duration / Hours
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 50 Hours / 10 Days"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {category === 'CONSTRUCTION' && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Preferred Site Visit Date <span className="text-amber-500 font-semibold">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dateRequired}
                    onChange={(e) => setFormData({ ...formData, dateRequired: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Email Address <span className="text-slate-500">(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Additional Details / Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide any specific requirements or details..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <a
                  href="tel:7385293949"
                  className="inline-flex items-center text-xs text-amber-400 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5 mr-1" />
                  Or Call Direct: 7385293949
                </a>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-sm rounded-lg transition shadow-lg shadow-amber-600/20 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Submit Enquiry'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
