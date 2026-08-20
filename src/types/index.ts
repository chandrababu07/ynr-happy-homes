export type UserRole = 'ADMIN' | 'CUSTOMER' | 'admin' | 'customer' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive?: boolean;
  savedProperties?: string[]; // Array of Property IDs
  createdAt?: string;
  updatedAt?: string;
}

export type EquipmentCategory = 
  | 'EXCAVATORS' 
  | 'BACKHOE_LOADERS' 
  | 'BULLDOZERS' 
  | 'CRANES' 
  | 'OTHER' 
  | 'Excavator' 
  | 'Backhoe Loader' 
  | 'Bulldozer';

export type EquipmentStatus = 'AVAILABLE' | 'ON_RENT' | 'MAINTENANCE' | 'INACTIVE';
export type EquipmentAvailability = EquipmentStatus;

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  model: string;
  brand?: string;
  operatorIncluded?: boolean;
  specifications: {
    operatingWeight?: string;
    enginePower?: string;
    bucketCapacity?: string;
    operatorIncluded?: boolean;
    [key: string]: any;
  };
  dailyRate?: number;
  monthlyRate?: number;
  status?: EquipmentStatus;
  availabilityStatus?: string;
  rentalBasis?: string;
  serviceArea?: string;
  images: string[];
  description: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type PropertyCategory = 
  | 'Land' 
  | 'Sites / Plots' 
  | 'Apartments' 
  | 'Individual Houses' 
  | 'Commercial Land' 
  | 'Commercial Properties';

export type PropertyStatus = 'AVAILABLE' | 'UNDER_OFFER' | 'SOLD' | 'ARCHIVED';

export interface Location {
  address: string;
  city: string;
  state: string;
  pincode?: string;
  area: string;
}

export interface Property {
  id: string;
  title: string;
  category: PropertyCategory;
  type: string;
  price: string;
  location: Location;
  description: string;
  amenities: string[];
  images: string[];
  status: PropertyStatus;
  mapCoordinates?: {
    lat: number;
    lng: number;
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
  createdAt?: string;
  updatedAt?: string;
}

export type UnitStatus = 'AVAILABLE' | 'BOOKED' | 'SOLD';

export interface ProjectUnit {
  id: string;
  projectId: string;
  blockId?: string | null;
  block?: string;
  unitNumber: string;
  unitType: string;
  floor: number;
  area: number;
  areaSqFt?: number;
  areaUnit?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  balcony?: boolean | null;
  facing?: string | null;
  price: string | number;
  status: UnitStatus;
  floorPlanImage?: string | null;
  createdAt?: string;
  updatedAt?: string;
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
  floorPlans?: FloorPlan[];
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

export interface CompanyInfo {
  name: string;
  tagline?: string;
  established?: number;
  establishedYear?: number;
  address: string;
  location?: string;
  phone: string;
  email: string;
  workingHours?: string;
  divisions?: any;
}

export interface MediaAsset {
  id: string;
  url: string;
  type: string;
  name: string;
  createdAt?: string;
}
