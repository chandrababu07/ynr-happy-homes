import { Equipment, Property, ConstructionProject, ProjectBlock, ProjectUnit, Enquiry, User, CompanyInfo } from '../types';

export interface PropertyQueryFilters {
  search?: string;
  category?: string;
  status?: string;
  city?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProperties {
  items: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardActivityItem {
  id: string;
  type: 'ENQUIRY' | 'PROPERTY' | 'PROJECT' | 'EQUIPMENT' | 'USER';
  title: string;
  subtitle: string;
  timestamp: string;
  badge: string;
}

export interface DashboardSummary {
  properties: {
    total: number;
    available: number;
    underOffer: number;
    sold: number;
    archived: number;
    byCategory: Record<string, number>;
  };
  projects: {
    total: number;
    planning: number;
    underConstruction: number;
    completed: number;
    byType: Record<string, number>;
    averageProgress: number;
  };
  equipment: {
    total: number;
    available: number;
    onRent: number;
    maintenance: number;
    inactive: number;
    byCategory: Record<string, number>;
  };
  enquiries: {
    total: number;
    new: number;
    contacted: number;
    inProgress: number;
    closed: number;
    byCategory: Record<string, number>;
  };
  users: {
    total: number;
    active: number;
    disabled: number;
    admins: number;
    staff: number;
    customers: number;
  };
  recentActivity: DashboardActivityItem[];
}

export interface IDashboardRepository {
  getSummary(): Promise<DashboardSummary>;
}

export interface IEquipmentRepository {
  getAll(): Promise<Equipment[]>;
  getById(id: string): Promise<Equipment | undefined>;
  save(equipment: Equipment): Promise<Equipment>;
  delete(id: string): Promise<boolean>;
}

export interface IPropertyRepository {
  getAll(filters?: PropertyQueryFilters): Promise<PaginatedProperties>;
  getById(id: string): Promise<Property | undefined>;
  save(property: Property): Promise<Property>;
  delete(id: string): Promise<boolean>;
}

export interface IProjectRepository {
  getAll(): Promise<ConstructionProject[]>;
  getById(id: string): Promise<ConstructionProject | undefined>;
  save(project: ConstructionProject): Promise<ConstructionProject>;
  delete(id: string): Promise<boolean>;
  
  // Block Management
  saveBlock(projectId: string, block: { id?: string; name: string; description?: string }): Promise<ProjectBlock>;
  deleteBlock(projectId: string, blockId: string): Promise<boolean>;

  // Unit Management
  getUnits(projectId?: string): Promise<ProjectUnit[]>;
  saveUnit(projectId: string, unit: Partial<ProjectUnit>): Promise<ProjectUnit>;
  batchCreateUnits(projectId: string, units: Partial<ProjectUnit>[]): Promise<ProjectUnit[]>;
  deleteUnit(projectId: string, unitId: string): Promise<boolean>;
}

export interface IEnquiryRepository {
  getAll(): Promise<Enquiry[]>;
  create(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<Enquiry>;
  updateStatus(id: string, status: Enquiry['status']): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

export interface IUserRepository {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | undefined>;
  create(user: Partial<User> & { password?: string }): Promise<User>;
  update(id: string, user: Partial<User> & { password?: string }): Promise<User>;
  delete(id: string): Promise<boolean>;
}

export interface IAuthRepository {
  getCurrentUser(): User | null;
  setCurrentUser(user: User | null): void;
  loginCustomer(email: string, phone: string): Promise<User>;
  loginAdmin(email?: string, password?: string): Promise<User>;
  loginAdminDev(): Promise<User>;
  verifySession?(): Promise<User | null>;
  logout(): Promise<void>;
  toggleSaveProperty(propertyId: string): User | null;
  getCompanyInfo(): CompanyInfo;
  updateCompanyInfo(info: CompanyInfo): CompanyInfo;
}
