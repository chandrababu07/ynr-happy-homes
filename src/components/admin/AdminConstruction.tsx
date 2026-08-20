import React, { useState } from 'react';
import { Plus, Trash2, Edit, AlertCircle, Loader2, RefreshCw, Layers, Grid, ChevronRight, ArrowLeft, Wand2 } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { ConstructionProject, ProjectUnit, ProjectStatus } from '../../types';
import { ImagePlaceholder } from '../common/ImagePlaceholder';
import { FileUploadPicker } from './FileUploadPicker';

export const AdminConstruction: React.FC = () => {
  const {
    projects,
    loading,
    error,
    refresh,
    saveProject,
    deleteProject,
    saveBlock,
    deleteBlock,
    saveUnit,
    batchCreateUnits,
    deleteUnit,
  } = useProjects();

  // Active view state
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Project Modal State
  const [editingProject, setEditingProject] = useState<Partial<ConstructionProject> | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Block Modal State
  const [editingBlock, setEditingBlock] = useState<{ id?: string; name: string; description?: string } | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // Unit Modal State
  const [editingUnit, setEditingUnit] = useState<Partial<ProjectUnit> | null>(null);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);

  // Batch Generator Modal State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchForm, setBatchForm] = useState({
    blockId: '',
    floor: 1,
    startUnitNumber: 101,
    count: 4,
    unitType: '2BHK',
    area: 1200,
    bedrooms: 2,
    bathrooms: 2,
    facing: 'East',
    price: '₹42,00,000',
  });

  // Action states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<{ type: 'PROJECT' | 'BLOCK' | 'UNIT'; id: string; name?: string; unitCount?: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Active Project Reference
  const activeProject = projects.find((p) => p.id === selectedProjectId) || null;

  // Unit Filter State in Matrix View
  const [filterBlockId, setFilterBlockId] = useState<string>('ALL');
  const [filterFloor, setFilterFloor] = useState<string>('ALL');

  // --- PROJECT CRUD HANDLERS ---

  const handleOpenAddProject = () => {
    setFormError(null);
    setEditingProject({
      name: '',
      projectType: 'Apartments',
      status: 'UNDER_CONSTRUCTION',
      location: 'Mangalagiri, AP',
      description: '',
      progressPercentage: 25,
      amenities: ['Power Backup', 'Lift', 'Car Parking'],
    });
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (project: ConstructionProject) => {
    setFormError(null);
    setEditingProject({ ...project });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!editingProject?.name || editingProject.name.trim() === '') {
      setFormError('Project name is required.');
      return;
    }
    if (!editingProject?.projectType || editingProject.projectType.trim() === '') {
      setFormError('Project type is required.');
      return;
    }
    if (!editingProject?.location || editingProject.location.trim() === '') {
      setFormError('Project location is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveProject({
        id: editingProject.id || `proj-temp-${Date.now()}`,
        name: editingProject.name.trim(),
        projectType: editingProject.projectType.trim(),
        status: (editingProject.status as ProjectStatus) || 'UNDER_CONSTRUCTION',
        location: editingProject.location.trim(),
        description: editingProject.description?.trim() || '',
        mainImage: editingProject.mainImage || null,
        galleryImages: editingProject.galleryImages || [],
        brochureUrl: editingProject.brochureUrl || null,
        floorPlans: editingProject.floorPlans || [],
        amenities: editingProject.amenities || ['Power Backup', 'Lift'],
        progressPercentage: Number(editingProject.progressPercentage) || 0,
        totalUnits: Number(editingProject.totalUnits) || 0,
        availableUnits: Number(editingProject.availableUnits) || 0,
        bookedUnits: Number(editingProject.bookedUnits) || 0,
        soldUnits: Number(editingProject.soldUnits) || 0,
        createdAt: editingProject.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setIsProjectModalOpen(false);
      setEditingProject(null);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save construction project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- BLOCK CRUD HANDLERS ---

  const handleOpenAddBlock = () => {
    setFormError(null);
    setEditingBlock({ name: '', description: '' });
    setIsBlockModalOpen(true);
  };

  const handleSaveBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !editingBlock?.name) return;

    setIsSubmitting(true);
    setFormError(null);
    try {
      await saveBlock(selectedProjectId, {
        id: editingBlock.id,
        name: editingBlock.name.trim(),
        description: editingBlock.description?.trim(),
      });
      setIsBlockModalOpen(false);
      setEditingBlock(null);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save block.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UNIT CRUD HANDLERS ---

  const handleOpenAddUnit = () => {
    setFormError(null);
    setEditingUnit({
      blockId: activeProject?.blocks?.[0]?.id || '',
      unitNumber: 'Flat 101',
      unitType: '2BHK',
      floor: 1,
      area: 1200,
      bedrooms: 2,
      bathrooms: 2,
      facing: 'East',
      price: '₹42,00,000',
      status: 'AVAILABLE',
    });
    setIsUnitModalOpen(true);
  };

  const handleSaveUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !editingUnit?.unitNumber) return;

    setIsSubmitting(true);
    setFormError(null);
    try {
      await saveUnit(selectedProjectId, {
        id: editingUnit.id,
        blockId: editingUnit.blockId || undefined,
        unitNumber: editingUnit.unitNumber.trim(),
        unitType: editingUnit.unitType || '2BHK',
        floor: Number(editingUnit.floor) || 1,
        area: Number(editingUnit.area) || 1200,
        bedrooms: Number(editingUnit.bedrooms) || 2,
        bathrooms: Number(editingUnit.bathrooms) || 2,
        facing: editingUnit.facing || 'East',
        price: editingUnit.price || '₹42,00,000',
        status: (editingUnit.status as any) || 'AVAILABLE',
      });
      setIsUnitModalOpen(false);
      setEditingUnit(null);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save unit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUnitStatus = async (unit: ProjectUnit, newStatus: 'AVAILABLE' | 'BOOKED' | 'SOLD') => {
    if (!selectedProjectId) return;
    try {
      await saveUnit(selectedProjectId, {
        id: unit.id,
        status: newStatus as any,
      });
    } catch (err: any) {
      alert(`Failed to update unit status: ${err.message}`);
    }
  };

  // --- BATCH UNIT GENERATOR ---

  const handleGenerateBatchUnits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    setIsSubmitting(true);
    setFormError(null);
    try {
      const generatedPayload = [];
      const startNum = Number(batchForm.startUnitNumber) || 101;
      const count = Number(batchForm.count) || 4;

      for (let i = 0; i < count; i++) {
        const num = startNum + i;
        generatedPayload.push({
          blockId: batchForm.blockId || undefined,
          unitNumber: `Flat ${num}`,
          unitType: batchForm.unitType,
          floor: Number(batchForm.floor),
          area: Number(batchForm.area),
          bedrooms: Number(batchForm.bedrooms),
          bathrooms: Number(batchForm.bathrooms),
          facing: batchForm.facing,
          price: batchForm.price,
          status: 'AVAILABLE' as const,
        });
      }

      await batchCreateUnits(selectedProjectId, generatedPayload);
      setIsBatchModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to batch generate units.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DELETE CONFIRMATION HANDLER ---

  const handleDeleteConfirm = async () => {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    try {
      if (confirmDeleteId.type === 'PROJECT') {
        await deleteProject(confirmDeleteId.id);
        if (selectedProjectId === confirmDeleteId.id) {
          setSelectedProjectId(null);
        }
      } else if (confirmDeleteId.type === 'BLOCK' && selectedProjectId) {
        await deleteBlock(selectedProjectId, confirmDeleteId.id);
      } else if (confirmDeleteId.type === 'UNIT' && selectedProjectId) {
        await deleteUnit(selectedProjectId, confirmDeleteId.id);
      }
      setConfirmDeleteId(null);
    } catch (err: any) {
      console.error('Error during deletion:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered units list for active project matrix
  const projectUnits = activeProject?.units || [];
  const filteredUnits = projectUnits.filter((u) => {
    if (filterBlockId !== 'ALL' && u.blockId !== filterBlockId) return false;
    if (filterFloor !== 'ALL' && String(u.floor) !== filterFloor) return false;
    return true;
  });

  const availableFloors = Array.from(new Set(projectUnits.map((u) => u.floor))).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">CONSTRUCTION PLATFORM ADMIN</span>
          <h1 className="text-2xl font-bold text-white font-heading">
            {activeProject ? activeProject.name : 'Own Construction Projects'}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          {activeProject && (
            <button
              onClick={() => setSelectedProjectId(null)}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Back to All Projects</span>
            </button>
          )}
          <button
            onClick={() => refresh()}
            disabled={loading}
            title="Refresh projects & units from API"
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center justify-center disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          {!activeProject && (
            <button
              onClick={handleOpenAddProject}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </button>
          )}
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

      {/* VIEW 1: PROJECTS GRID LISTING (When no project is selected) */}
      {!activeProject && (
        <>
          {loading && projects.length === 0 ? (
            <div className="p-12 text-center glass-card rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-slate-400 text-sm font-medium">Fetching construction projects from REST API...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
              <p className="text-white font-bold text-base">No construction projects currently published.</p>
              <p className="text-slate-400 text-xs max-w-md mx-auto">
                Click "Create New Project" above to add new residential or commercial developments.
              </p>
              <button
                onClick={handleOpenAddProject}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition"
              >
                Create First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((p) => (
                <div key={p.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between hover:border-slate-700 transition">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-amber-400 uppercase">{p.projectType}</span>
                        <h3 className="text-xl font-bold text-white font-heading">{p.name}</h3>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {p.progressPercentage}% Complete
                      </span>
                    </div>

                    <ImagePlaceholder type="PROJECT" title={p.name} images={p.mainImage ? [p.mainImage] : []} aspectRatio="aspect-[16/10]" />

                    <p className="text-xs text-slate-300 line-clamp-2">{p.description}</p>

                    {/* Summary Counters Driven by Backend */}
                    <div className="grid grid-cols-4 gap-2 text-center p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">TOTAL</span>
                        <span className="font-extrabold text-white font-heading">{p.totalUnits}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-400 block">AVAIL</span>
                        <span className="font-extrabold text-emerald-400 font-heading">{p.availableUnits}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-400 block">BOOKED</span>
                        <span className="font-extrabold text-amber-400 font-heading">{p.bookedUnits}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-red-400 block">SOLD</span>
                        <span className="font-extrabold text-red-400 font-heading">{p.soldUnits}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedProjectId(p.id)}
                      className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-1"
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>Manage Blocks & Units</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEditProject(p)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl"
                      title="Edit Project Details"
                    >
                      <Edit className="w-4 h-4 text-amber-400" />
                    </button>
                    <button
                      onClick={() =>
                        setConfirmDeleteId({
                          type: 'PROJECT',
                          id: p.id,
                          name: p.name,
                          unitCount: p.totalUnits,
                        })
                      }
                      className="p-2 bg-red-950/40 text-red-400 rounded-xl hover:bg-red-900/60"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* VIEW 2: SELECTED PROJECT BLOCK & UNIT MATRIX MANAGEMENT */}
      {activeProject && (
        <div className="space-y-8">
          
          {/* Project Summary KPI Banner */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
            <div>
              <span className="text-xs text-slate-400 block">Project Status</span>
              <span className="text-sm font-bold text-amber-400">{activeProject.status}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Total Units</span>
              <span className="text-2xl font-black text-white font-heading">{activeProject.totalUnits}</span>
            </div>
            <div>
              <span className="text-xs text-emerald-400 block font-medium">Available Units</span>
              <span className="text-2xl font-black text-emerald-400 font-heading">{activeProject.availableUnits}</span>
            </div>
            <div>
              <span className="text-xs text-amber-400 block font-medium">Booked Units</span>
              <span className="text-2xl font-black text-amber-400 font-heading">{activeProject.bookedUnits}</span>
            </div>
            <div>
              <span className="text-xs text-red-400 block font-medium">Sold Units</span>
              <span className="text-2xl font-black text-red-400 font-heading">{activeProject.soldUnits}</span>
            </div>
          </div>

          {/* SECTION A: BLOCK MANAGEMENT */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-bold text-white font-heading">Project Blocks / Towers</h3>
              </div>
              <button
                onClick={handleOpenAddBlock}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Block</span>
              </button>
            </div>

            {activeProject.blocks && activeProject.blocks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {activeProject.blocks.map((blk) => {
                  const blockUnitsCount = (activeProject.units || []).filter((u) => u.blockId === blk.id).length;
                  return (
                    <div key={blk.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-base font-bold text-white font-heading">{blk.name}</h4>
                          <span className="px-2 py-0.5 bg-slate-800 text-amber-400 text-[10px] font-bold rounded-md">
                            {blockUnitsCount} Units
                          </span>
                        </div>
                        {blk.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{blk.description}</p>}
                      </div>
                      <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => {
                            setEditingBlock({ id: blk.id, name: blk.name, description: blk.description || undefined });
                            setIsBlockModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            setConfirmDeleteId({
                              type: 'BLOCK',
                              id: blk.id,
                              name: blk.name,
                              unitCount: blockUnitsCount,
                            })
                          }
                          className="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs rounded-lg font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No blocks created for this project yet. Add Block A, Block B, or Tower 1 above.</p>
            )}
          </div>

          {/* SECTION B: UNIT / FLAT MATRIX MANAGEMENT */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            
            {/* Header & Generator Toolbar */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Grid className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Flat & Unit Matrix</h3>
                  <span className="text-xs text-slate-400">Manage individual unit status, floor matrix, and availability</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsBatchModalOpen(true)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Batch Unit Generator</span>
                </button>

                <button
                  onClick={handleOpenAddUnit}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Single Flat</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800/80">
              <div className="flex items-center space-x-3 text-xs">
                <span className="text-slate-400 font-semibold">Filter Matrix:</span>
                
                {/* Block Filter */}
                <select
                  value={filterBlockId}
                  onChange={(e) => setFilterBlockId(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">All Blocks</option>
                  {(activeProject.blocks || []).map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>

                {/* Floor Filter */}
                <select
                  value={filterFloor}
                  onChange={(e) => setFilterFloor(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="ALL">All Floors</option>
                  {availableFloors.map((fl) => (
                    <option key={fl} value={String(fl)}>Floor {fl}</option>
                  ))}
                </select>
              </div>

              <span className="text-xs text-slate-400">
                Showing <strong className="text-white">{filteredUnits.length}</strong> of <strong className="text-amber-400">{projectUnits.length}</strong> units
              </span>
            </div>

            {/* Units Matrix Table */}
            {filteredUnits.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs italic">
                No units match your filter or no units added yet. Use "Batch Unit Generator" above to quickly create 10–20 flats!
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                      <th className="p-3">Unit Number</th>
                      <th className="p-3">Block</th>
                      <th className="p-3">Floor</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Area</th>
                      <th className="p-3">Facing</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredUnits.map((u) => {
                      const blk = (activeProject.blocks || []).find((b) => b.id === u.blockId);
                      return (
                        <tr key={u.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-3 font-bold text-white font-heading">{u.unitNumber}</td>
                          <td className="p-3 text-slate-300">{blk ? blk.name : '-'}</td>
                          <td className="p-3 text-slate-300">Floor {u.floor}</td>
                          <td className="p-3 text-amber-400 font-semibold">{u.unitType}</td>
                          <td className="p-3 text-slate-300">{u.area} {u.areaUnit || 'sq.ft'}</td>
                          <td className="p-3 text-slate-400">{u.facing || 'East'}</td>
                          <td className="p-3 font-bold text-amber-400">{u.price}</td>
                          <td className="p-3">
                            <select
                              value={u.status}
                              onChange={(e) => handleUpdateUnitStatus(u, e.target.value as any)}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold border focus:outline-none cursor-pointer ${
                                u.status === 'SOLD'
                                  ? 'bg-red-950/80 text-red-300 border-red-800'
                                  : u.status === 'BOOKED'
                                  ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                              }`}
                            >
                              <option value="AVAILABLE">AVAILABLE</option>
                              <option value="BOOKED">BOOKED</option>
                              <option value="SOLD">SOLD</option>
                            </select>
                          </td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => {
                                setEditingUnit(u);
                                setIsUnitModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-white"
                              title="Edit Unit"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setConfirmDeleteId({
                                  type: 'UNIT',
                                  id: u.id,
                                  name: u.unitNumber,
                                })
                              }
                              className="p-1.5 text-red-400 hover:text-red-300"
                              title="Delete Unit"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: DELETE CONFIRMATION MODAL */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-heading">
              Confirm Delete {confirmDeleteId.type}
            </h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to delete {confirmDeleteId.type.toLowerCase()}{' '}
              <span className="font-mono text-amber-400 font-bold">{confirmDeleteId.name || confirmDeleteId.id}</span>?
            </p>
            {confirmDeleteId.type === 'BLOCK' && confirmDeleteId.unitCount! > 0 && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-xs font-semibold">
                ⚠️ Warning: This block currently contains {confirmDeleteId.unitCount} units. Deleting this block will remove its association from associated units.
              </div>
            )}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>{isDeleting ? 'Deleting...' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE / EDIT PROJECT MODAL */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-bold text-white font-heading">
              {editingProject.id && !editingProject.id.startsWith('proj-temp-') ? 'Edit Construction Project' : 'Create Construction Project'}
            </h3>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-xs">{formError}</div>
            )}

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. YNR Heights"
                  value={editingProject.name || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Type *</label>
                  <select
                    value={editingProject.projectType || 'Apartments'}
                    onChange={(e) => setEditingProject({ ...editingProject, projectType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                  >
                    <option value="Apartments">Apartments</option>
                    <option value="Individual Houses">Individual Houses</option>
                    <option value="Commercial Buildings">Commercial Buildings</option>
                    <option value="Gated Community">Gated Community</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Progress %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingProject.progressPercentage || 0}
                    onChange={(e) => setEditingProject({ ...editingProject, progressPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mangalagiri, AP"
                  value={editingProject.location || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe development highlights..."
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <FileUploadPicker
                label="Project Main Photograph (Optional)"
                category="PROJECT"
                entityType="project"
                entityId={editingProject.id}
                value={editingProject.mainImage || ''}
                onChange={(url) => setEditingProject({ ...editingProject, mainImage: url })}
                placeholderText="Drag & drop project main photo or click to browse"
              />

              <FileUploadPicker
                label="Project Brochure PDF (Optional)"
                accept="application/pdf"
                category="PROJECT"
                type="BROCHURE"
                entityType="project"
                entityId={editingProject.id}
                maxSizeMB={25}
                value={editingProject.brochureUrl || ''}
                onChange={(url) => setEditingProject({ ...editingProject, brochureUrl: url })}
                placeholderText="Drag & drop project brochure PDF (max 25MB)"
              />

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition flex items-center space-x-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREATE / EDIT BLOCK MODAL */}
      {isBlockModalOpen && editingBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-heading">
              {editingBlock.id ? 'Edit Block' : 'Add Project Block'}
            </h3>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-xs">{formError}</div>
            )}

            <form onSubmit={handleSaveBlock} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Block Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block A, Tower 1"
                  value={editingBlock.name || ''}
                  onChange={(e) => setEditingBlock({ ...editingBlock, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. East Wing Residential Tower"
                  value={editingBlock.description || ''}
                  onChange={(e) => setEditingBlock({ ...editingBlock, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsBlockModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition flex items-center space-x-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : null}
                  <span>Save Block</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: SINGLE UNIT CREATOR & EDITOR */}
      {isUnitModalOpen && editingUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-lg font-bold text-white font-heading">
              {editingUnit.id ? 'Edit Flat / Unit' : 'Add Single Flat'}
            </h3>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-xs">{formError}</div>
            )}

            <form onSubmit={handleSaveUnit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Block</label>
                  <select
                    value={editingUnit.blockId || ''}
                    onChange={(e) => setEditingUnit({ ...editingUnit, blockId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                  >
                    <option value="">No Block</option>
                    {(activeProject?.blocks || []).map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Flat Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 101"
                    value={editingUnit.unitNumber || ''}
                    onChange={(e) => setEditingUnit({ ...editingUnit, unitNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Floor Number *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editingUnit.floor || 1}
                    onChange={(e) => setEditingUnit({ ...editingUnit, floor: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Unit Type *</label>
                  <select
                    value={editingUnit.unitType || '2BHK'}
                    onChange={(e) => setEditingUnit({ ...editingUnit, unitType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                  >
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="4BHK / Penthouse">4BHK / Penthouse</option>
                    <option value="Commercial Shop">Commercial Shop</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Area (sq.ft) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={editingUnit.area || 1200}
                    onChange={(e) => setEditingUnit({ ...editingUnit, area: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Facing</label>
                  <select
                    value={editingUnit.facing || 'East'}
                    onChange={(e) => setEditingUnit({ ...editingUnit, facing: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                  >
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Price *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹42,00,000"
                    value={editingUnit.price || ''}
                    onChange={(e) => setEditingUnit({ ...editingUnit, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Status</label>
                  <select
                    value={editingUnit.status || 'AVAILABLE'}
                    onChange={(e) => setEditingUnit({ ...editingUnit, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-amber-500 outline-none font-bold"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="BOOKED">BOOKED</option>
                    <option value="SOLD">SOLD</option>
                  </select>
                </div>
              </div>

              <FileUploadPicker
                label="Unit Floor Plan Image (Optional)"
                category="PROJECT"
                entityType="unit"
                entityId={editingUnit.id}
                value={editingUnit.floorPlanImage || ''}
                onChange={(url) => setEditingUnit({ ...editingUnit, floorPlanImage: url })}
                placeholderText="Drag & drop floor plan diagram or click to browse"
              />

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsUnitModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition flex items-center space-x-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : null}
                  <span>Save Flat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: BATCH UNIT GENERATOR MODAL */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-indigo-900/60 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center space-x-2 text-indigo-400 border-b border-slate-800 pb-3">
              <Wand2 className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white font-heading">Batch Flat Generator</h3>
            </div>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-200 text-xs">{formError}</div>
            )}

            <form onSubmit={handleGenerateBatchUnits} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Select Block</label>
                  <select
                    value={batchForm.blockId}
                    onChange={(e) => setBatchForm({ ...batchForm, blockId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-indigo-500 outline-none"
                  >
                    <option value="">No Block / Default</option>
                    {(activeProject?.blocks || []).map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Floor Number *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={batchForm.floor}
                    onChange={(e) => setBatchForm({ ...batchForm, floor: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Start Unit Number *</label>
                  <input
                    type="number"
                    required
                    value={batchForm.startUnitNumber}
                    onChange={(e) => setBatchForm({ ...batchForm, startUnitNumber: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-indigo-500 outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-500">e.g. 101 creates 101, 102, 103...</span>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Number of Units to Generate *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={batchForm.count}
                    onChange={(e) => setBatchForm({ ...batchForm, count: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Unit Type</label>
                  <select
                    value={batchForm.unitType}
                    onChange={(e) => setBatchForm({ ...batchForm, unitType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-indigo-500 outline-none"
                  >
                    <option value="1BHK">1BHK</option>
                    <option value="2BHK">2BHK</option>
                    <option value="3BHK">3BHK</option>
                    <option value="4BHK / Penthouse">4BHK / Penthouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Area (sq.ft)</label>
                  <input
                    type="number"
                    required
                    value={batchForm.area}
                    onChange={(e) => setBatchForm({ ...batchForm, area: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Facing</label>
                  <select
                    value={batchForm.facing}
                    onChange={(e) => setBatchForm({ ...batchForm, facing: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-indigo-500 outline-none"
                  >
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Price per Flat</label>
                  <input
                    type="text"
                    required
                    value={batchForm.price}
                    onChange={(e) => setBatchForm({ ...batchForm, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsBatchModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition flex items-center space-x-1.5 shadow"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  <span>{isSubmitting ? 'Generating...' : `Generate ${batchForm.count} Flats`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
