export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  savedProperties: string[];
  createdAt: string;
}

export interface CompanyInfo {
  name: string;
  establishedYear: number;
  location: string;
  address: string;
  phone: string;
  email: string;
  divisions: string[];
}

export type EquipmentAvailability = 'AVAILABLE' | 'ON_RENT' | 'MAINTENANCE' | 'INACTIVE';

export interface Equipment {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  description: string;
  images?: string[] | null;
  specifications: Record<string, string>;
  operatorIncluded: boolean;
  rentalBasis: string;
  availabilityStatus: EquipmentAvailability;
  serviceArea: string;
  createdAt: string;
  updatedAt: string;
}

export type PropertyCategory = 
  | 'Land' 
  | 'Sites / Plots' 
  | 'Apartments' 
  | 'Individual Houses' 
  | 'Commercial Land' 
  | 'Commercial Properties' 
  | 'Other';

export type PropertyStatus = 'AVAILABLE' | 'UNDER_OFFER' | 'SOLD' | 'ARCHIVED';

export interface Property {
  id: string;
  title: string;
  category: PropertyCategory;
  type: string;
  price: number | string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode?: string;
    area: string;
  };
  description: string;
  amenities: string[];
  images?: string[] | null;
  status: PropertyStatus;
  mapCoordinates?: {
    lat: number;
    lng: number;
    label: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'PLANNING' | 'UNDER_CONSTRUCTION' | 'COMPLETED';

export interface FloorPlan {
  id: string;
  title: string;
  imageUrl?: string | null;
  specs: string;
}

export interface ProjectBlock {
  id: string;
  projectId: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UnitStatus = 'AVAILABLE' | 'BOOKED' | 'SOLD';

export interface ProjectUnit {
  id: string;
  projectId: string;
  blockId?: string | null;
  unitNumber: string;
  unitType: string;
  floor: number;
  area: number;
  areaUnit: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  balcony?: boolean | null;
  facing?: string | null;
  price: number | string;
  status: UnitStatus;
  floorPlanImage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConstructionProject {
  id: string;
  name: string;
  projectType: string;
  status: ProjectStatus;
  location: string;
  description: string;
  mainImage?: string | null;
  galleryImages?: string[] | null;
  brochureUrl?: string | null;
  floorPlans: FloorPlan[];
  amenities: string[];
  progressPercentage: number;
  totalUnits: number;
  availableUnits: number;
  bookedUnits: number;
  soldUnits: number;
  blocks?: ProjectBlock[];
  units?: ProjectUnit[];
  createdAt: string;
  updatedAt: string;
}

export type EnquiryCategory = 'INFRA' | 'REAL_ESTATE' | 'CONSTRUCTION' | 'GENERAL';
export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CLOSED';

export interface Enquiry {
  id: string;
  category: EnquiryCategory;
  targetId?: string;
  targetTitle?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerLocation?: string;
  dateRequired?: string;
  duration?: string;
  message?: string;
  status: EnquiryStatus;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  type: 'IMAGE' | 'DOCUMENT' | 'BROCHURE';
  category: 'EQUIPMENT' | 'PROPERTY' | 'PROJECT' | 'OTHER';
  createdAt: string;
}
