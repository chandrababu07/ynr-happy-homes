import React, { useState, useMemo } from 'react';
import { Landmark, Search, MapPin, Send, AlertCircle, ChevronLeft, ChevronRight, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useProperties } from '../../hooks/useProperties';
import { Property, PropertyCategory } from '../../types';
import { ImagePlaceholder } from '../common/ImagePlaceholder';
import { EnquiryModal } from '../common/EnquiryModal';

export const RealEstateView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [enquiryProperty, setEnquiryProperty] = useState<Property | null>(null);
  const [generalEnquiryOpen, setGeneralEnquiryOpen] = useState(false);

  const categories: (PropertyCategory | 'ALL')[] = [
    'ALL',
    'Land',
    'Sites / Plots',
    'Apartments',
    'Individual Houses',
    'Commercial Land',
    'Commercial Properties',
  ];

  const queryFilters = useMemo(
    () => ({
      search: searchQuery,
      category: selectedCategory,
      status: selectedStatus,
      sort: selectedSort,
      page: currentPage,
      limit: 9,
    }),
    [searchQuery, selectedCategory, selectedStatus, selectedSort, currentPage]
  );

  const { properties, total, page, totalPages, loading, error, refresh } = useProperties(queryFilters);

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
    setSelectedStatus('ALL');
    setSelectedSort('newest');
    setCurrentPage(1);
  };

  const formatPrice = (price: string | number) => {
    if (typeof price === 'number') {
      return `₹ ${price.toLocaleString('en-IN')}`;
    }
    if (!price) return 'Price on Request';
    if (price.startsWith('₹')) return price;
    const numeric = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (!isNaN(numeric)) {
      return `₹ ${numeric.toLocaleString('en-IN')}`;
    }
    return price;
  };

  return (
    <div className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Landmark className="w-4 h-4 text-amber-400" />
          <span>DIVISION 02 • REAL ESTATE BROKERAGE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
          Real Estate & Property Advisory
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Trusted real estate brokerage connecting property sellers and buyers in Mangalagiri, Nambur, Guntur, and Vijayawada regions.
        </p>
      </div>

      {/* Discovery Search, Filter & Sort Controls */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          
          {/* Text Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search property title, area, city, or description..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE">Available Only</option>
                <option value="UNDER_OFFER">Under Offer</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>

            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="oldest">Oldest First</option>
            </select>

            {(selectedCategory !== 'ALL' || searchQuery || selectedStatus !== 'ALL' || selectedSort !== 'newest') && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Global API Error Alert */}
      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800/80 rounded-xl flex items-center space-x-3 text-red-200 text-xs">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-red-300">Property Discovery Issue</p>
            <p className="text-red-400/90">{error}</p>
          </div>
          <button
            onClick={() => refresh(queryFilters)}
            className="px-3 py-1.5 bg-red-900/60 hover:bg-red-800 text-red-100 rounded-lg text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Discovery Results Count Summary */}
      {!loading && !error && (
        <div className="flex justify-between items-center text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-white">{properties.length}</strong> of <strong className="text-amber-400">{total}</strong> properties
          </span>
          {totalPages > 1 && (
            <span>
              Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
            </span>
          )}
        </div>
      )}

      {/* Property Cards Grid or Premium Empty State */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-medium">Fetching properties matching your criteria...</div>
      ) : properties.length === 0 ? (
        /* PREMIUM EMPTY STATE */
        <div className="glass-panel p-12 sm:p-16 rounded-3xl text-center space-y-6 max-w-2xl mx-auto border border-slate-800">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Landmark className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              No matching properties found.
            </h3>
            <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
              Try adjusting your search criteria or contact YNR Happy Homes directly for upcoming unlisted properties.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs rounded-xl border border-slate-800 transition"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Reset Search Filters</span>
            </button>
            <button
              onClick={() => setGeneralEnquiryOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-600/20 transition"
            >
              <Send className="w-4 h-4" />
              <span>Submit General Requirement</span>
            </button>
          </div>
        </div>
      ) : (
        /* DYNAMIC REAL ESTATE PROPERTY CARDS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="glass-card rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition shadow-lg group"
            >
              <div className="relative">
                <ImagePlaceholder
                  type="PROPERTY"
                  title={property.title}
                  images={property.images}
                  aspectRatio="aspect-[16/10]"
                />
                <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-sm text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20">
                  {property.category}
                </div>
                <div
                  className={`absolute top-3 right-3 text-xs font-extrabold px-3 py-1 rounded-full shadow ${
                    property.status === 'SOLD'
                      ? 'bg-red-600 text-white'
                      : property.status === 'UNDER_OFFER'
                      ? 'bg-amber-600 text-slate-950'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {property.status}
                </div>
              </div>

              <div className="p-6 space-y-3 flex-1">
                <div className="flex items-center text-xs text-slate-400 space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="line-clamp-1">{property.location.area}, {property.location.city}</span>
                </div>

                <h4 className="text-xl font-bold text-white font-heading line-clamp-1 group-hover:text-amber-400 transition">
                  {property.title}
                </h4>
                
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{property.description}</p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Price</span>
                    <span className="text-lg font-bold text-amber-400 font-heading">
                      {formatPrice(property.price)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Area</span>
                    <span className="text-xs font-semibold text-slate-300">{property.location.area}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center gap-3">
                <button
                  onClick={() => setSelectedProperty(property)}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-slate-800 transition"
                >
                  View Details
                </button>
                <button
                  onClick={() => setEnquiryProperty(property)}
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-xl transition shadow-md shadow-amber-600/20"
                >
                  Enquire Now
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-3 pt-6 border-t border-slate-800">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold disabled:opacity-30 transition flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-slate-400 font-medium">
            Page <strong className="text-amber-400">{page}</strong> of <strong className="text-white">{totalPages}</strong>
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold disabled:opacity-30 transition flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-slate-100 shadow-2xl space-y-0">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div>
                <span className="text-xs font-semibold text-amber-500 uppercase">{selectedProperty.category}</span>
                <h3 className="text-2xl font-bold text-white font-heading">{selectedProperty.title}</h3>
              </div>
              <button onClick={() => setSelectedProperty(null)} className="text-slate-400 hover:text-white p-2">✕</button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <ImagePlaceholder type="PROPERTY" title={selectedProperty.title} images={selectedProperty.images} aspectRatio="aspect-[16/9]" />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block">Listed Price</span>
                  <span className="text-base font-bold text-amber-400 font-heading">
                    {formatPrice(selectedProperty.price)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Location</span>
                  <span className="font-semibold text-slate-200">{selectedProperty.location.area}, {selectedProperty.location.city}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Status</span>
                  <span className="font-semibold text-emerald-400">{selectedProperty.status}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{selectedProperty.description}</p>
              </div>

              {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Features & Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.amenities.map((item, idx) => (
                      <span key={idx} className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-300">
                        • {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end space-x-3 bg-slate-950">
              <button onClick={() => setSelectedProperty(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Close</button>
              <button
                onClick={() => {
                  const p = selectedProperty;
                  setSelectedProperty(null);
                  setEnquiryProperty(p);
                }}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-600/20"
              >
                Schedule Site Visit / Enquire
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Specific Enquiry Modal */}
      {enquiryProperty && (
        <EnquiryModal
          isOpen={true}
          onClose={() => setEnquiryProperty(null)}
          category="REAL_ESTATE"
          targetId={enquiryProperty.id}
          targetTitle={enquiryProperty.title}
        />
      )}

      {/* General Property Requirement Modal */}
      {generalEnquiryOpen && (
        <EnquiryModal
          isOpen={true}
          onClose={() => setGeneralEnquiryOpen(false)}
          category="REAL_ESTATE"
          targetTitle="General Real Estate Requirement"
        />
      )}

    </div>
  );
};
