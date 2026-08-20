import { EnquiryCategoryType, EnquiryLeadStatus } from '@prisma/client';
import prisma from '../utils/prisma.js';

export interface CreateEnquiryData {
  id?: string;
  category?: EnquiryCategoryType;
  targetId?: string;
  targetTitle?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerLocation?: string;
  dateRequired?: string;
  duration?: string;
  message?: string;
  status?: EnquiryLeadStatus;
}

export interface UpdateEnquiryData {
  category?: EnquiryCategoryType;
  targetId?: string;
  targetTitle?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerLocation?: string;
  dateRequired?: string;
  duration?: string;
  message?: string;
  status?: EnquiryLeadStatus;
}

// In-Memory store fallback if database connection is offline
let mockEnquiryStore: any[] = [];

export class EnquiryRepository {
  async findAll() {
    try {
      return await prisma.enquiry.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.warn('[EnquiryRepository] Database connection error. Serving in-memory fallback store.');
      return mockEnquiryStore;
    }
  }

  async findById(id: string) {
    try {
      return await prisma.enquiry.findUnique({
        where: { id },
      });
    } catch (error) {
      return mockEnquiryStore.find((item) => item.id === id) || null;
    }
  }

  async create(data: CreateEnquiryData) {
    try {
      return await prisma.enquiry.create({
        data: {
          ...(data.id && { id: data.id }),
          category: data.category || EnquiryCategoryType.GENERAL,
          targetId: data.targetId || null,
          targetTitle: data.targetTitle || null,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail || null,
          customerLocation: data.customerLocation || null,
          dateRequired: data.dateRequired || null,
          duration: data.duration || null,
          message: data.message || null,
          status: data.status || EnquiryLeadStatus.NEW,
        },
      });
    } catch (error) {
      const newItem: any = {
        id: data.id || `enq-${Date.now()}`,
        category: data.category || EnquiryCategoryType.GENERAL,
        targetId: data.targetId || null,
        targetTitle: data.targetTitle || null,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || null,
        customerLocation: data.customerLocation || null,
        dateRequired: data.dateRequired || null,
        duration: data.duration || null,
        message: data.message || null,
        status: data.status || EnquiryLeadStatus.NEW,
        createdAt: new Date(),
      };
      mockEnquiryStore.unshift(newItem);
      return newItem;
    }
  }

  async update(id: string, data: UpdateEnquiryData) {
    try {
      return await prisma.enquiry.update({
        where: { id },
        data: {
          ...(data.category && { category: data.category }),
          ...(data.targetId !== undefined && { targetId: data.targetId }),
          ...(data.targetTitle !== undefined && { targetTitle: data.targetTitle }),
          ...(data.customerName && { customerName: data.customerName }),
          ...(data.customerPhone && { customerPhone: data.customerPhone }),
          ...(data.customerEmail !== undefined && { customerEmail: data.customerEmail }),
          ...(data.customerLocation !== undefined && { customerLocation: data.customerLocation }),
          ...(data.dateRequired !== undefined && { dateRequired: data.dateRequired }),
          ...(data.duration !== undefined && { duration: data.duration }),
          ...(data.message !== undefined && { message: data.message }),
          ...(data.status && { status: data.status }),
        },
      });
    } catch (error) {
      const index = mockEnquiryStore.findIndex((item) => item.id === id);
      if (index >= 0) {
        mockEnquiryStore[index] = {
          ...mockEnquiryStore[index],
          ...data,
        };
        return mockEnquiryStore[index];
      }
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return await prisma.enquiry.delete({
        where: { id },
      });
    } catch (error) {
      mockEnquiryStore = mockEnquiryStore.filter((item) => item.id !== id);
      return { id };
    }
  }
}

export const enquiryRepository = new EnquiryRepository();
