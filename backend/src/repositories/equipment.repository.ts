import { EquipmentStatus } from '@prisma/client';
import prisma from '../utils/prisma.js';

export interface CreateEquipmentData {
  name: string;
  category: string;
  brand: string;
  model: string;
  description: string;
  images?: string[];
  specifications: Record<string, any>;
  operatorIncluded?: boolean;
  rentalBasis: string;
  availabilityStatus?: EquipmentStatus;
  serviceArea: string;
}

export interface UpdateEquipmentData {
  name?: string;
  category?: string;
  brand?: string;
  model?: string;
  description?: string;
  images?: string[];
  specifications?: Record<string, any>;
  operatorIncluded?: boolean;
  rentalBasis?: string;
  availabilityStatus?: EquipmentStatus;
  serviceArea?: string;
}

// Confirmed Seed Equipment Record (Used as fallback when PostgreSQL server is offline)
const SEED_HYUNDAI_EQUIPMENT: any = {
  id: 'eq-hyundai-210',
  name: 'Hyundai Smart Plus 210 Excavator',
  category: 'Excavator',
  brand: 'Hyundai',
  model: 'Smart Plus 210',
  description: 'Heavy-duty hydraulic crawler excavator engineered for high productivity earthmoving, site clearance, foundation trenching, and infrastructure development. Supplied with an experienced driver/operator.',
  images: [], // Strictly no stock/fake photos
  specifications: {
    'Operating Weight': '21,200 kg',
    'Engine Power': '148 HP @ 1900 rpm',
    'Bucket Capacity': '0.92 m³',
    'Max Digging Depth': '6,730 mm',
    'Hydraulic System': 'Smart Plus Hydro-Control',
    'Operator': 'Provided by YNR Happy Homes',
  },
  operatorIncluded: true,
  rentalBasis: 'Hourly / Agreed duration',
  availabilityStatus: EquipmentStatus.AVAILABLE,
  serviceArea: 'Mangalagiri, Guntur District, Amaravati & Andhra Pradesh',
  createdAt: new Date('2025-01-15T00:00:00.000Z'),
  updatedAt: new Date('2025-01-15T00:00:00.000Z'),
};

// In-Memory store fallback
let mockEquipmentStore: any[] = [SEED_HYUNDAI_EQUIPMENT];

export class EquipmentRepository {
  async findAll() {
    try {
      return await prisma.equipment.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.warn('[EquipmentRepository] Serving fallback equipment inventory.');
      return mockEquipmentStore;
    }
  }

  async findById(id: string) {
    try {
      return await prisma.equipment.findUnique({
        where: { id },
      });
    } catch (error) {
      return mockEquipmentStore.find(item => item.id === id) || null;
    }
  }

  async create(data: CreateEquipmentData) {
    try {
      return await prisma.equipment.create({
        data: {
          name: data.name,
          category: data.category,
          brand: data.brand,
          model: data.model,
          description: data.description,
          images: data.images || [],
          specifications: data.specifications || {},
          operatorIncluded: data.operatorIncluded ?? true,
          rentalBasis: data.rentalBasis,
          availabilityStatus: data.availabilityStatus || EquipmentStatus.AVAILABLE,
          serviceArea: data.serviceArea,
        },
      });
    } catch (error) {
      const newItem: any = {
        id: 'eq-' + Date.now(),
        ...data,
        images: data.images || [],
        operatorIncluded: data.operatorIncluded ?? true,
        availabilityStatus: data.availabilityStatus || EquipmentStatus.AVAILABLE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockEquipmentStore.unshift(newItem);
      return newItem;
    }
  }

  async update(id: string, data: UpdateEquipmentData) {
    try {
      return await prisma.equipment.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.category && { category: data.category }),
          ...(data.brand && { brand: data.brand }),
          ...(data.model && { model: data.model }),
          ...(data.description && { description: data.description }),
          ...(data.images !== undefined && { images: data.images }),
          ...(data.specifications && { specifications: data.specifications }),
          ...(data.operatorIncluded !== undefined && { operatorIncluded: data.operatorIncluded }),
          ...(data.rentalBasis && { rentalBasis: data.rentalBasis }),
          ...(data.availabilityStatus && { availabilityStatus: data.availabilityStatus }),
          ...(data.serviceArea && { serviceArea: data.serviceArea }),
        },
      });
    } catch (error) {
      const index = mockEquipmentStore.findIndex(item => item.id === id);
      if (index >= 0) {
        mockEquipmentStore[index] = {
          ...mockEquipmentStore[index],
          ...data,
          updatedAt: new Date(),
        };
        return mockEquipmentStore[index];
      }
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return await prisma.equipment.delete({
        where: { id },
      });
    } catch (error) {
      mockEquipmentStore = mockEquipmentStore.filter(item => item.id !== id);
      return { id };
    }
  }
}

export const equipmentRepository = new EquipmentRepository();
