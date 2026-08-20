import { IEnquiryRepository } from '../interfaces';
import { Enquiry } from '../../types';
import { storageService } from '../../services/storage';

export class LocalStorageEnquiryRepository implements IEnquiryRepository {
  async getAll(): Promise<Enquiry[]> {
    return storageService.getEnquiries();
  }

  async create(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<Enquiry> {
    return storageService.saveEnquiry(enquiry);
  }

  async updateStatus(id: string, status: Enquiry['status']): Promise<boolean> {
    return storageService.updateEnquiryStatus(id, status);
  }

  async delete(id: string): Promise<boolean> {
    return storageService.deleteEnquiry(id);
  }
}
