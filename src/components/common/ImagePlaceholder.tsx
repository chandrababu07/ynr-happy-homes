import React from 'react';
import { Wrench, Building2, Landmark, ImageOff } from 'lucide-react';

interface ImagePlaceholderProps {
  type?: 'EQUIPMENT' | 'PROPERTY' | 'PROJECT' | 'GENERAL';
  title?: string;
  className?: string;
  images?: string[] | null;
  aspectRatio?: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  type = 'GENERAL',
  title,
  className = '',
  images,
  aspectRatio = 'aspect-[16/10]'
}) => {
  // If real images exist and are non-empty, render the first image
  if (images && images.length > 0 && images[0] && images[0].trim() !== '') {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-slate-900 ${aspectRatio} ${className}`}>
        <img
          src={images[0]}
          alt={title || 'Item image'}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            // Fallback to placeholder if link fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Professional Neutral Architectural Placeholder State
  const getIcon = () => {
    switch (type) {
      case 'EQUIPMENT':
        return <Wrench className="w-12 h-12 text-amber-500/60 stroke-[1.5]" />;
      case 'PROPERTY':
        return <Landmark className="w-12 h-12 text-amber-500/60 stroke-[1.5]" />;
      case 'PROJECT':
        return <Building2 className="w-12 h-12 text-amber-500/60 stroke-[1.5]" />;
      default:
        return <ImageOff className="w-12 h-12 text-slate-500 stroke-[1.5]" />;
    }
  };

  const getSubtext = () => {
    switch (type) {
      case 'EQUIPMENT':
        return 'Equipment photograph coming soon';
      case 'PROPERTY':
        return 'Property photograph coming soon';
      case 'PROJECT':
        return 'Project photograph coming soon';
      default:
        return 'Photograph coming soon';
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 bg-slate-900/80 border border-slate-800 rounded-xl text-center select-none overflow-hidden ${aspectRatio} ${className}`}>
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col items-center space-y-3">
        <div className="p-3 bg-slate-800/80 rounded-full border border-slate-700/60 shadow-inner">
          {getIcon()}
        </div>
        <div>
          {title && <p className="text-xs uppercase tracking-wider text-amber-500/80 font-semibold mb-1">{title}</p>}
          <p className="text-sm font-medium text-slate-300">{getSubtext()}</p>
          <p className="text-xs text-slate-500 mt-1 font-sans">Photographs will be published upon verification</p>
        </div>
      </div>

      <div className="absolute bottom-2 right-3 text-[10px] text-slate-600 font-mono">
        YNR HAPPY HOMES
      </div>
    </div>
  );
};
