import { enquiryRepository } from '../repositories';
import { Enquiry } from '../types';

export const enquiryService = {
  async getAll(): Promise<Enquiry[]> {
    return enquiryRepository.getAll();
  },

  async create(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<Enquiry> {
    return enquiryRepository.create(enquiry);
  },

  async updateStatus(id: string, status: Enquiry['status']): Promise<boolean> {
    return enquiryRepository.updateStatus(id, status);
  },

  async delete(id: string): Promise<boolean> {
    return enquiryRepository.delete(id);
  }
};
