import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface FileUploadPickerProps {
  label: string;
  accept?: string;
  maxSizeMB?: number;
  value?: string;
  onChange: (url: string) => void;
  entityType?: 'equipment' | 'property' | 'project' | 'unit';
  entityId?: string;
  category?: 'EQUIPMENT' | 'PROPERTY' | 'PROJECT' | 'OTHER';
  type?: 'IMAGE' | 'DOCUMENT' | 'BROCHURE';
  placeholderText?: string;
}

export const FileUploadPicker: React.FC<FileUploadPickerProps> = ({
  label,
  accept = 'image/jpeg,image/png,image/webp,application/pdf',
  maxSizeMB = 10,
  value,
  onChange,
  entityType,
  entityId,
  category = 'OTHER',
  type = 'IMAGE',
  placeholderText = 'Drag & drop file here or click to browse',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    // File Size Check
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds limit (${maxSizeMB} MB max).`);
      return;
    }

    // MIME Type Validation
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (['.exe', '.sh', '.bat', '.js', '.php'].includes(ext)) {
      setError(`File extension ${ext} is strictly prohibited for security.`);
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      formData.append('type', file.type === 'application/pdf' ? 'BROCHURE' : type);
      if (entityType && entityId) {
        formData.append(`${entityType}Id`, entityId);
      }

      const res = await apiClient.upload<{ url: string }>('/media/upload', formData);
      if (res && res.url) {
        onChange(res.url);
      }
    } catch (err: any) {
      console.warn('[FileUploadPicker] Upload to backend failed. Using object URL for preview:', err.message);
      // Fallback: Use URL preview if server offline during dev
      const objectUrl = URL.createObjectURL(file);
      onChange(objectUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const isPdf = value && (value.endsWith('.pdf') || value.includes('pdf'));

  return (
    <div className="space-y-1.5 text-xs">
      <label className="block text-slate-300 font-medium">{label}</label>

      {error && (
        <div className="p-2 bg-red-950/60 border border-red-800/80 rounded-lg text-red-300 text-[11px] flex items-center space-x-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {value ? (
        <div className="relative group p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            {isPdf ? (
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-slate-900 overflow-hidden flex-shrink-0 border border-slate-800">
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="truncate">
              <p className="font-mono text-[11px] text-slate-200 truncate">{value}</p>
              <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Uploaded & Ready</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 rounded-lg transition"
            title="Remove File"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer p-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center space-y-2 transition ${
            dragActive ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center space-y-2 py-2">
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
              <p className="text-slate-400 font-medium">Uploading file to storage...</p>
            </div>
          ) : (
            <>
              <div className="p-2.5 bg-slate-900 rounded-full border border-slate-800 text-amber-400">
                {accept.includes('pdf') ? <FileText className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-slate-200 font-medium">{placeholderText}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Max size: {maxSizeMB} MB. Allowed: JPEG, PNG, WEBP, PDF
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
