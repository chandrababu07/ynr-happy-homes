import React, { useState, useMemo } from 'react';
import { Building2, Send, MapPin, LayoutGrid, AlertCircle, Search, Layers, ChevronRight, RotateCcw, CheckCircle2, Lock, XCircle, FileText } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { ConstructionProject, ProjectUnit } from '../../types';
import { ImagePlaceholder } from '../common/ImagePlaceholder';
import { EnquiryModal } from '../common/EnquiryModal';

export const ConstructionView: React.FC = () => {
  const { projects, loading, error, refresh } = useProjects();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Active Project Detail & Flat Matrix Modal
  const [selectedProject, setSelectedProject] = useState<ConstructionProject | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<string>('ALL');

  // Selected Unit Modal for Specifications & Direct Enquiry
  const [selectedUnit, setSelectedUnit] = useState<{ unit: ProjectUnit; project: ConstructionProject } | null>(null);

  // Enquiry Modals
  const [enquiryTarget, setEnquiryTarget] = useState<{ id?: string; title: string } | null>(null);
  const [generalEnquiryOpen, setGeneralEnquiryOpen] = useState(false);

  // Filtered Projects List
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedType !== 'ALL' && p.projectType !== selectedType) return false;
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [projects, selectedType, selectedStatus, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedStatus('ALL');
  };

  // Group units by floor for active project and block
  const groupedUnitsByFloor = useMemo(() => {
    if (!selectedProject) return {};
    const unitsList = selectedProject.units || [];
    const filtered = unitsList.filter((u) => {
      if (activeBlockId !== 'ALL' && u.blockId !== activeBlockId) return false;
      return true;
    });

    const groups: Record<number, ProjectUnit[]> = {};
    filtered.forEach((u) => {
      const fl = u.floor || 1;
      if (!groups[fl]) groups[fl] = [];
      groups[fl].push(u);
    });

    return groups;
  }, [selectedProject, activeBlockId]);

  const sortedFloors = Object.keys(groupedUnitsByFloor)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>DIVISION 03 • BUILDING CONSTRUCTION</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
          Construction Projects & Unit Availability Matrix
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Developing modern residential apartments, gated individual houses, and commercial complexes with quality craftsmanship in Mangalagiri, Nambur, and Andhra Pradesh.
        </p>
      </div>

      {/* Discovery Search & Filter Toolbar */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          
          {/* Text Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search project name, location, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Filters & Status Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="UNDER_CONSTRUCTION">Under Construction</option>
              <option value="COMPLETED">Completed</option>
              <option value="PLANNING">Planning Phase</option>
            </select>

            {(searchQuery || selectedType !== 'ALL' || selectedStatus !== 'ALL') && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Project Type Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-3">
          {['ALL', 'Apartments', 'Individual Houses', 'Commercial Buildings', 'Gated Community'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedType === type
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Global API Error Alert */}
      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800/80 rounded-xl flex items-center space-x-3 text-red-200 text-xs">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-red-300">API Connection Issue</p>
            <p className="text-red-400/90">{error}</p>
          </div>
          <button
            onClick={() => refresh()}
            className="px-3 py-1.5 bg-red-900/60 hover:bg-red-800 text-red-100 rounded-lg text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {/* Projects List or Premium Empty State */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-medium">Fetching construction portfolio from REST API...</div>
      ) : filteredProjects.length === 0 ? (
        /* PREMIUM EMPTY STATE FOR CONSTRUCTION */
        <div className="glass-panel p-12 sm:p-16 rounded-3xl text-center space-y-6 max-w-2xl mx-auto border border-slate-800">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Building2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
              No matching construction projects found.
            </h3>
            <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
              Try adjusting your search criteria or contact YNR Happy Homes directly for upcoming unlisted developments.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-slate-900 text-slate-200 font-semibold text-xs rounded-xl border border-slate-800 hover:bg-slate-800 transition"
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
        /* DYNAMIC PROJECTS PORTFOLIO CARDS */
        <div className="space-y-8">
          {filteredProjects.map((project) => {
            return (
              <div
                key={project.id}
                className="glass-card rounded-2xl border border-slate-800 overflow-hidden space-y-0 hover:border-slate-700 transition shadow-xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
                  
                  {/* Left Media Container */}
                  <div className="lg:col-span-5 relative">
                    <ImagePlaceholder
                      type="PROJECT"
                      title={project.name}
                      images={project.mainImage ? [project.mainImage] : []}
                      aspectRatio="aspect-[16/10]"
                      className="h-full min-h-[240px] rounded-xl overflow-hidden"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-sm text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20">
                      {project.projectType}
                    </div>
                  </div>

                  {/* Right Details */}
                  <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {project.status}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 mr-1" />
                          {project.location}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-white font-heading mt-1">{project.name}</h3>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-2">{project.description}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 font-medium">Construction Progress</span>
                        <span className="text-amber-400 font-bold">{project.progressPercentage}% Complete</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${project.progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Summary Counters Driven by Backend API */}
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-500 block uppercase">Total</span>
                        <span className="font-extrabold text-white text-sm">{project.totalUnits}</span>
                      </div>
                      <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-emerald-400 block uppercase font-semibold">Available</span>
                        <span className="font-extrabold text-emerald-400 text-sm">{project.availableUnits}</span>
                      </div>
                      <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-amber-400 block uppercase font-semibold">Booked</span>
                        <span className="font-extrabold text-amber-400 text-sm">{project.bookedUnits}</span>
                      </div>
                      <div className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-red-400 block uppercase font-semibold">Sold</span>
                        <span className="font-extrabold text-red-400 text-sm">{project.soldUnits}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setActiveBlockId('ALL');
                        }}
                        className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-xl transition shadow-md shadow-amber-600/20 flex items-center justify-center space-x-1.5"
                      >
                        <LayoutGrid className="w-4 h-4" />
                        <span>Explore Flat Matrix & Specs</span>
                      </button>
                      <button
                        onClick={() => setEnquiryTarget({ id: project.id, title: project.name })}
                        className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-slate-800 transition"
                      >
                        Enquire Booking
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PROJECT DETAILS & INTERACTIVE FLAT MATRIX MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-slate-100 shadow-2xl space-y-0">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">{selectedProject.projectType} • {selectedProject.status}</span>
                <h3 className="text-2xl font-bold text-white font-heading">{selectedProject.name}</h3>
                <span className="text-xs text-slate-400 flex items-center mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 mr-1" />
                  {selectedProject.location}
                </span>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-white p-2">✕</button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Top Summary KPI Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Progress</span>
                  <span className="font-extrabold text-amber-400 text-base">{selectedProject.progressPercentage}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Total Flats</span>
                  <span className="font-bold text-white text-base">{selectedProject.totalUnits}</span>
                </div>
                <div>
                  <span className="text-emerald-400 block font-medium">Available</span>
                  <span className="font-extrabold text-emerald-400 text-base">{selectedProject.availableUnits}</span>
                </div>
                <div>
                  <span className="text-amber-400 block font-medium">Booked</span>
                  <span className="font-extrabold text-amber-400 text-base">{selectedProject.bookedUnits}</span>
                </div>
                <div>
                  <span className="text-red-400 block font-medium">Sold</span>
                  <span className="font-extrabold text-red-400 text-base">{selectedProject.soldUnits}</span>
                </div>
              </div>

              {/* Overview & Amenities */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Overview</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedProject.description}</p>
                
                {selectedProject.brochureUrl && (
                  <div className="pt-2">
                    <a
                      href={selectedProject.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs rounded-xl transition"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Download Official Project Brochure (PDF)</span>
                    </a>
                  </div>
                )}

                {selectedProject.amenities && selectedProject.amenities.length > 0 && (
                  <div className="pt-2">
                    <h5 className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2">Amenities & Specifications</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.amenities.map((item, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-md text-xs text-slate-300">
                          • {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* INTERACTIVE FLOOR-BY-FLOOR FLAT AVAILABILITY MATRIX */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-amber-500" />
                    <h4 className="text-sm font-bold text-white font-heading">Interactive Flat Matrix</h4>
                  </div>

                  {/* Block Tabs */}
                  {(selectedProject.blocks || []).length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      <button
                        onClick={() => setActiveBlockId('ALL')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                          activeBlockId === 'ALL'
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        All Blocks
                      </button>
                      {(selectedProject.blocks || []).map((b) => (
                        <button
                          key={b.id}
                          onClick={() => setActiveBlockId(b.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                            activeBlockId === b.id
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Legend */}
                <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Status Legend:</span>
                  <div className="flex items-center space-x-4 text-[11px]">
                    <span className="flex items-center font-semibold text-emerald-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5 shadow-sm shadow-emerald-500/50"></span>Available (Click to View/Enquire)
                    </span>
                    <span className="flex items-center font-semibold text-amber-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></span>Booked
                    </span>
                    <span className="flex items-center font-semibold text-red-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5"></span>Sold
                    </span>
                  </div>
                </div>

                {/* Floor Matrix Grid */}
                {sortedFloors.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs italic bg-slate-950 rounded-xl border border-slate-800">
                    No flats currently configured for this block selection.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedFloors.map((floorNum) => {
                      const floorUnits = groupedUnitsByFloor[floorNum] || [];
                      return (
                        <div key={floorNum} className="space-y-2">
                          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                            <span>Floor {floorNum}</span>
                            <span className="h-px bg-slate-800 flex-1"></span>
                          </div>

                          {/* Responsive Scroll Container for Large Unit Matrices */}
                          <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
                            <div className="flex gap-3 min-w-max">
                              {floorUnits.map((unit) => {
                                const isAvailable = unit.status === 'AVAILABLE';
                                const isBooked = unit.status === 'BOOKED';

                                return (
                                  <div
                                    key={unit.id}
                                    onClick={() => {
                                      if (isAvailable) {
                                        setSelectedUnit({ unit, project: selectedProject });
                                      }
                                    }}
                                    className={`w-44 p-3 rounded-xl border text-xs flex flex-col justify-between transition ${
                                      isAvailable
                                        ? 'bg-emerald-950/40 border-emerald-500/50 hover:border-emerald-400 text-emerald-200 cursor-pointer shadow-lg hover:scale-[1.02]'
                                        : isBooked
                                        ? 'bg-amber-950/20 border-amber-800/60 text-amber-300 opacity-75 cursor-not-allowed'
                                        : 'bg-slate-950 border-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
                                    }`}
                                  >
                                    <div className="flex justify-between items-center font-bold">
                                      <span className="text-white font-heading text-sm">{unit.unitNumber}</span>
                                      <span
                                        className={`px-2 py-0.5 rounded text-[9px] font-black ${
                                          isAvailable
                                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                            : isBooked
                                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        }`}
                                      >
                                        {unit.status}
                                      </span>
                                    </div>

                                    <div className="mt-2 space-y-1 text-[11px]">
                                      <div className="flex justify-between text-slate-300">
                                        <span>Type:</span>
                                        <span className="font-semibold text-amber-400">{unit.unitType}</span>
                                      </div>
                                      <div className="flex justify-between text-slate-400">
                                        <span>Area:</span>
                                        <span>{unit.area} {unit.areaUnit || 'sq.ft'}</span>
                                      </div>
                                      <div className="flex justify-between text-slate-400">
                                        <span>Price:</span>
                                        <span className="font-bold text-white">{unit.price}</span>
                                      </div>
                                    </div>

                                    <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-right">
                                      {isAvailable ? (
                                        <span className="text-emerald-400 font-bold hover:underline flex items-center justify-end">
                                          <span>View Specs & Enquire</span>
                                          <ChevronRight className="w-3 h-3 ml-0.5" />
                                        </span>
                                      ) : isBooked ? (
                                        <span className="text-amber-500 font-medium flex items-center justify-end">
                                          <Lock className="w-3 h-3 mr-1" />
                                          Booked
                                        </span>
                                      ) : (
                                        <span className="text-red-400 font-medium flex items-center justify-end">
                                          <XCircle className="w-3 h-3 mr-1" />
                                          Sold Out
                                        </span>
                                      )}
                                    </div>

                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end space-x-3 bg-slate-950">
              <button onClick={() => setSelectedProject(null)} className="px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Close</button>
              <button
                onClick={() => {
                  const p = selectedProject;
                  setSelectedProject(null);
                  setEnquiryTarget({ id: p.id, title: p.name });
                }}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-600/20"
              >
                Enquire General Project Booking
              </button>
            </div>

          </div>
        </div>
      )}

      {/* UNIT SPECIFICATIONS & DIRECT ENQUIRY DRAWER MODAL */}
      {selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden text-slate-100 shadow-2xl space-y-0">
            
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">{selectedUnit.project.name}</span>
                <h3 className="text-2xl font-bold text-white font-heading">{selectedUnit.unit.unitNumber} ({selectedUnit.unit.unitType})</h3>
              </div>
              <button onClick={() => setSelectedUnit(null)} className="text-slate-400 hover:text-white p-2">✕</button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Unit Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Floor</span>
                  <span className="font-bold text-white text-sm">Floor {selectedUnit.unit.floor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Unit Area</span>
                  <span className="font-bold text-white text-sm">{selectedUnit.unit.area} {selectedUnit.unit.areaUnit || 'sq.ft'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Facing</span>
                  <span className="font-bold text-amber-400 text-sm">{selectedUnit.unit.facing || 'East'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Bedrooms</span>
                  <span className="font-bold text-slate-200 text-sm">{selectedUnit.unit.bedrooms || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Bathrooms</span>
                  <span className="font-bold text-slate-200 text-sm">{selectedUnit.unit.bathrooms || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Listed Price</span>
                  <span className="font-extrabold text-amber-400 text-sm">{selectedUnit.unit.price}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center space-x-2 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Unit is currently AVAILABLE for booking & site visit scheduling.</span>
              </div>

              {/* Optional Floor Plan Media */}
              {selectedUnit.unit.floorPlanImage && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Unit Floor Plan</h4>
                  <img src={selectedUnit.unit.floorPlanImage} alt={`Floor plan for ${selectedUnit.unit.unitNumber}`} className="w-full h-auto rounded-xl border border-slate-800" />
                </div>
              )}

            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end space-x-3 bg-slate-950">
              <button onClick={() => setSelectedUnit(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold">Close</button>
              <button
                onClick={() => {
                  const targetUnit = selectedUnit.unit;
                  const targetProj = selectedUnit.project;
                  setSelectedUnit(null);
                  setSelectedProject(null);
                  setEnquiryTarget({
                    id: targetUnit.id,
                    title: `${targetProj.name} - Flat ${targetUnit.unitNumber} (${targetUnit.unitType}, ${targetUnit.area} sq.ft)`,
                  });
                }}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-600/20 flex items-center space-x-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Schedule Site Visit / Enquire About Flat</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Project/Unit Specific Enquiry Modal */}
      {enquiryTarget && (
        <EnquiryModal
          isOpen={true}
          onClose={() => setEnquiryTarget(null)}
          category="CONSTRUCTION"
          targetId={enquiryTarget.id}
          targetTitle={enquiryTarget.title}
        />
      )}

      {/* General Construction Project Requirement Modal */}
      {generalEnquiryOpen && (
        <EnquiryModal
          isOpen={true}
          onClose={() => setGeneralEnquiryOpen(false)}
          category="CONSTRUCTION"
          targetTitle="General Construction Project Enquiry"
        />
      )}

    </div>
  );
};
