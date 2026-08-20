import { CompanyInfo, Equipment, Property, ConstructionProject, ProjectUnit, Enquiry, User, MediaAsset } from '../types';

const STORAGE_KEYS = {
  COMPANY: 'ynr_company_info',
  EQUIPMENT: 'ynr_infra_equipment',
  PROPERTIES: 'ynr_real_estate_properties',
  PROJECTS: 'ynr_construction_projects',
  UNITS: 'ynr_project_units',
  ENQUIRIES: 'ynr_customer_enquiries',
  USERS: 'ynr_users',
  CURRENT_USER: 'ynr_current_user',
  MEDIA: 'ynr_media_assets',
};

// Official Business Metadata
export const INITIAL_COMPANY_INFO: CompanyInfo = {
  name: 'YNR Happy Homes',
  establishedYear: 2025,
  location: 'IJM Rain Tree Park, Nambur, Mangalagiri, Guntur District, AP – 522510',
  address: 'IJM Rain Tree Park, Nambur, Mangalagiri, Guntur District, Andhra Pradesh – 522510',
  phone: '7385293949',
  email: 'info@ynrhappyhomes.com',
  divisions: ['INFRA', 'REAL ESTATE', 'CONSTRUCTION'],
};

// Initial Confirmed Equipment - Hyundai Smart Plus 210 Excavator with images: []
export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-hyundai-210',
    name: 'Hyundai Smart Plus 210 Excavator',
    category: 'Excavator',
    brand: 'Hyundai',
    model: 'Smart Plus 210',
    description: 'Heavy-duty hydraulic crawler excavator engineered for high productivity earthmoving, site clearance, foundation trenching, and infrastructure development. Supplied with an experienced driver/operator.',
    images: [], // Strictly no stock/fake photos. Neutral "Photograph Coming Soon" placeholder rendered in UI.
    specifications: {
      'Operating Weight': '21,200 kg',
      'Engine Power': '148 HP @ 1900 rpm',
      'Bucket Capacity': '0.92 m³',
      'Max Digging Depth': '6,730 mm',
      'Hydraulic System': 'Smart Plus Hydro-Control',
      'Operator': 'Provided by YNR Happy Homes'
    },
    operatorIncluded: true,
    rentalBasis: 'Hourly / Agreed duration',
    availabilityStatus: 'AVAILABLE',
    serviceArea: 'Mangalagiri, Guntur District, Amaravati & Andhra Pradesh',
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2025-01-15T00:00:00.000Z',
  }
];

// Real Estate: Zero fake properties
export const INITIAL_PROPERTIES: Property[] = [];

// Construction: Zero fake projects
export const INITIAL_PROJECTS: ConstructionProject[] = [];

export const INITIAL_UNITS: ProjectUnit[] = [];

export const INITIAL_ENQUIRIES: Enquiry[] = [];

export const INITIAL_MEDIA: MediaAsset[] = [];

class LocalStorageService {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.error(`Error reading ${key} from localStorage`, e);
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to localStorage`, e);
    }
  }

  // Initialize store if empty
  public initStore(): void {
    if (!localStorage.getItem(STORAGE_KEYS.COMPANY)) {
      this.setItem(STORAGE_KEYS.COMPANY, INITIAL_COMPANY_INFO);
    }
    if (!localStorage.getItem(STORAGE_KEYS.EQUIPMENT)) {
      this.setItem(STORAGE_KEYS.EQUIPMENT, INITIAL_EQUIPMENT);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROPERTIES)) {
      this.setItem(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      this.setItem(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.UNITS)) {
      this.setItem(STORAGE_KEYS.UNITS, INITIAL_UNITS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) {
      this.setItem(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MEDIA)) {
      this.setItem(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
    }
  }

  // Company Info
  public getCompanyInfo(): CompanyInfo {
    return this.getItem(STORAGE_KEYS.COMPANY, INITIAL_COMPANY_INFO);
  }

  public updateCompanyInfo(info: CompanyInfo): CompanyInfo {
    this.setItem(STORAGE_KEYS.COMPANY, info);
    return info;
  }

  // Equipment (Infra)
  public getEquipment(): Equipment[] {
    return this.getItem(STORAGE_KEYS.EQUIPMENT, INITIAL_EQUIPMENT);
  }

  public getEquipmentById(id: string): Equipment | undefined {
    return this.getEquipment().find(item => item.id === id);
  }

  public saveEquipment(equipment: Equipment): Equipment {
    const list = this.getEquipment();
    const index = list.findIndex(item => item.id === equipment.id);
    if (index >= 0) {
      list[index] = { ...equipment, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...equipment, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.setItem(STORAGE_KEYS.EQUIPMENT, list);
    return equipment;
  }

  public deleteEquipment(id: string): boolean {
    const list = this.getEquipment();
    const filtered = list.filter(item => item.id !== id);
    this.setItem(STORAGE_KEYS.EQUIPMENT, filtered);
    return true;
  }

  // Properties (Real Estate)
  public getProperties(): Property[] {
    return this.getItem(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
  }

  public getPropertyById(id: string): Property | undefined {
    return this.getProperties().find(p => p.id === id);
  }

  public saveProperty(property: Property): Property {
    const list = this.getProperties();
    const index = list.findIndex(p => p.id === property.id);
    if (index >= 0) {
      list[index] = { ...property, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...property, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.setItem(STORAGE_KEYS.PROPERTIES, list);
    return property;
  }

  public deleteProperty(id: string): boolean {
    const list = this.getProperties();
    const filtered = list.filter(p => p.id !== id);
    this.setItem(STORAGE_KEYS.PROPERTIES, filtered);
    return true;
  }

  // Construction Projects
  public getProjects(): ConstructionProject[] {
    return this.getItem(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  }

  public getProjectById(id: string): ConstructionProject | undefined {
    return this.getProjects().find(p => p.id === id);
  }

  public saveProject(project: ConstructionProject): ConstructionProject {
    const list = this.getProjects();
    const index = list.findIndex(p => p.id === project.id);
    if (index >= 0) {
      list[index] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.setItem(STORAGE_KEYS.PROJECTS, list);
    return project;
  }

  public deleteProject(id: string): boolean {
    const list = this.getProjects();
    const filtered = list.filter(p => p.id !== id);
    this.setItem(STORAGE_KEYS.PROJECTS, filtered);
    return true;
  }

  // Project Units
  public getUnits(projectId?: string): ProjectUnit[] {
    const units = this.getItem(STORAGE_KEYS.UNITS, INITIAL_UNITS);
    if (projectId) {
      return units.filter(u => u.projectId === projectId);
    }
    return units;
  }

  public saveUnit(unit: ProjectUnit): ProjectUnit {
    const list = this.getUnits();
    const index = list.findIndex(u => u.id === unit.id);
    if (index >= 0) {
      list[index] = unit;
    } else {
      list.push(unit);
    }
    this.setItem(STORAGE_KEYS.UNITS, list);
    return unit;
  }

  public deleteUnit(id: string): boolean {
    const list = this.getUnits();
    const filtered = list.filter(u => u.id !== id);
    this.setItem(STORAGE_KEYS.UNITS, filtered);
    return true;
  }

  // Customer Enquiries
  public getEnquiries(): Enquiry[] {
    return this.getItem(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
  }

  public saveEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Enquiry {
    const list = this.getEnquiries();
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: 'enq-' + Date.now(),
      status: 'NEW',
      createdAt: new Date().toISOString()
    };
    list.unshift(newEnquiry);
    this.setItem(STORAGE_KEYS.ENQUIRIES, list);
    return newEnquiry;
  }

  public updateEnquiryStatus(id: string, status: Enquiry['status']): boolean {
    const list = this.getEnquiries();
    const index = list.findIndex(e => e.id === id);
    if (index >= 0) {
      list[index].status = status;
      this.setItem(STORAGE_KEYS.ENQUIRIES, list);
      return true;
    }
    return false;
  }

  public deleteEnquiry(id: string): boolean {
    const list = this.getEnquiries();
    const filtered = list.filter(e => e.id !== id);
    this.setItem(STORAGE_KEYS.ENQUIRIES, filtered);
    return true;
  }

  // Users & Auth
  public getCurrentUser(): User | null {
    return this.getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  public setCurrentUser(user: User | null): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
  }

  // Media Assets
  public getMediaAssets(): MediaAsset[] {
    return this.getItem(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
  }

  public saveMediaAsset(asset: Omit<MediaAsset, 'id' | 'createdAt'>): MediaAsset {
    const list = this.getMediaAssets();
    const newAsset: MediaAsset = {
      ...asset,
      id: 'med-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    list.unshift(newAsset);
    this.setItem(STORAGE_KEYS.MEDIA, list);
    return newAsset;
  }
}

export const storageService = new LocalStorageService();
// Auto-initialize store
storageService.initStore();
