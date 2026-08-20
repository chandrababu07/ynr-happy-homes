import React, { useState } from 'react';
import { HardHat, CheckCircle2, MapPin, Clock, Wrench, UserCheck, Send } from 'lucide-react';
import { useEquipment } from '../../hooks/useEquipment';
import { Equipment } from '../../types';
import { ImagePlaceholder } from '../common/ImagePlaceholder';
import { EnquiryModal } from '../common/EnquiryModal';

export const InfraView: React.FC = () => {
  const { equipmentList, loading } = useEquipment();
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [enquiryEquipment, setEnquiryEquipment] = useState<Equipment | null>(null);

  return (
    <div className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <HardHat className="w-4 h-4 text-amber-400" />
          <span>DIVISION 01 • INFRA & EQUIPMENT RENTAL</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
          Construction Equipment Rental
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          High-performance machinery supplied directly to your project site complete with skilled operators. Rental available on hourly or agreed duration contracts across Mangalagiri & Andhra Pradesh.
        </p>
      </div>

      {/* Trust Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-xl flex items-start space-x-4 border border-slate-800">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-heading">Experienced Operator Included</h4>
            <p className="text-xs text-slate-400 mt-1">Every equipment rental includes a professional, trained machine driver/operator.</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl flex items-start space-x-4 border border-slate-800">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-heading">Flexible Rental Terms</h4>
            <p className="text-xs text-slate-400 mt-1">Rent on hourly basis or custom agreed duration for short or long-term projects.</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl flex items-start space-x-4 border border-slate-800">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-heading">Site Delivery Service</h4>
            <p className="text-xs text-slate-400 mt-1">Direct equipment mobilization to your assigned work location in AP region.</p>
          </div>
        </div>
      </div>

      {/* Equipment Catalog */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-2xl font-bold text-white font-heading">Available Fleet</h3>
          <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {equipmentList.length} Machine Available
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">Loading equipment inventory...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {equipmentList.map((item) => (
              <div 
                key={item.id}
                className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between"
              >
                {/* Equipment Image Placeholder (No fake image used!) */}
                <div className="relative">
                  <ImagePlaceholder 
                    type="EQUIPMENT" 
                    title={`${item.brand} ${item.model}`}
                    images={item.images}
                    aspectRatio="aspect-[16/9]"
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {item.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.availabilityStatus}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 space-y-4 flex-1">
                  <div>
                    <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase block">
                      {item.brand}
                    </span>
                    <h4 className="text-2xl font-bold text-white font-heading">{item.name}</h4>
                    <p className="text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Badges & Key Features */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="inline-flex items-center text-xs px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                      <UserCheck className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
                      Operator Included
                    </span>
                    <span className="inline-flex items-center text-xs px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
                      {item.rentalBasis}
                    </span>
                  </div>

                  {/* Specifications Summary */}
                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-2">
                    <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center">
                      <Wrench className="w-3.5 h-3.5 mr-1" />
                      Key Specifications
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(item.specifications).slice(0, 4).map(([key, val]) => (
                        <div key={key} className="flex justify-between border-b border-slate-800/50 pb-1">
                          <span className="text-slate-400">{key}:</span>
                          <span className="font-semibold text-slate-200">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer CTAs */}
                <div className="p-6 pt-0 flex items-center justify-between gap-4">
                  <button
                    onClick={() => setSelectedEquipment(item)}
                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-lg border border-slate-700 transition text-center"
                  >
                    View Specs
                  </button>
                  <button
                    onClick={() => setEnquiryEquipment(item)}
                    className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-sm rounded-lg transition shadow-md shadow-amber-600/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Rental Enquiry</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Equipment Specs Detail Modal */}
      {selectedEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-slate-100 shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div>
                <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">EQUIPMENT SPECIFICATIONS</span>
                <h3 className="text-2xl font-bold text-white font-heading">{selectedEquipment.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedEquipment(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <ImagePlaceholder 
                type="EQUIPMENT"
                title={selectedEquipment.name}
                images={selectedEquipment.images}
                aspectRatio="aspect-[16/9]"
              />

              <div>
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedEquipment.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">Full Technical Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(selectedEquipment.specifications).map(([key, val]) => (
                    <div key={key} className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-slate-400 font-medium">{key}</span>
                      <span className="font-bold text-amber-300">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Service Area & Availability</span>
                </div>
                <p className="text-xs text-slate-300">{selectedEquipment.serviceArea}</p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end space-x-3 bg-slate-950/50">
              <button
                onClick={() => setSelectedEquipment(null)}
                className="px-5 py-2.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-sm font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const eq = selectedEquipment;
                  setSelectedEquipment(null);
                  setEnquiryEquipment(eq);
                }}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-sm rounded-lg shadow-md"
              >
                Request Rental Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      {enquiryEquipment && (
        <EnquiryModal
          isOpen={true}
          onClose={() => setEnquiryEquipment(null)}
          category="INFRA"
          targetId={enquiryEquipment.id}
          targetTitle={enquiryEquipment.name}
        />
      )}

    </div>
  );
};
