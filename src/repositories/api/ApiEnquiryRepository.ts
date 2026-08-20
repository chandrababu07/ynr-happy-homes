import { IEnquiryRepository } from '../interfaces';
import { Enquiry, EnquiryCategory, EnquiryStatus } from '../../types';
import { apiClient } from '../../services/apiClient';
import { LocalStorageEnquiryRepository } from '../localStorage/LocalStorageEnquiryRepository';

function toFrontendEnquiry(item: any): Enquiry {
  return {
    id: item.id,
    category: (item.category as EnquiryCategory) || 'GENERAL',
    targetId: item.targetId || undefined,
    targetTitle: item.targetTitle || undefined,
    customerName: item.customerName,
    customerPhone: item.customerPhone,
    customerEmail: item.customerEmail || undefined,
    customerLocation: item.customerLocation || undefined,
    dateRequired: item.dateRequired || undefined,
    duration: item.duration || undefined,
    message: item.message || undefined,
    status: (item.status as EnquiryStatus) || 'NEW',
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

export class ApiEnquiryRepository implements IEnquiryRepository {
  private fallbackRepo = new LocalStorageEnquiryRepository();

  async getAll(): Promise<Enquiry[]> {
    try {
      const data = await apiClient.get<any[]>('/enquiries');
      return data.map(toFrontendEnquiry);
    } catch (err) {
      console.warn('[ApiEnquiryRepository] API connection error. Using local fallback repository:', err);
      return this.fallbackRepo.getAll();
    }
  }

  async create(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Promise<Enquiry> {
    try {
      const payload = {
        category: enquiry.category || 'GENERAL',
        targetId: enquiry.targetId || null,
        targetTitle: enquiry.targetTitle || null,
        customerName: enquiry.customerName,
        customerPhone: enquiry.customerPhone,
        customerEmail: enquiry.customerEmail || null,
        customerLocation: enquiry.customerLocation || null,
        dateRequired: enquiry.dateRequired || null,
        duration: enquiry.duration || null,
        message: enquiry.message || null,
      };

      const created = await apiClient.post<any>('/enquiries', payload);
      return toFrontendEnquiry(created);
    } catch (err) {
      console.warn('[ApiEnquiryRepository] Error submitting enquiry via API. Falling back to local storage:', err);
      return this.fallbackRepo.create(enquiry);
    }
  }

  async updateStatus(id: string, status: Enquiry['status']): Promise<boolean> {
    try {
      await apiClient.put(`/enquiries/${id}`, { status });
      return true;
    } catch (err) {
      console.warn(`[ApiEnquiryRepository] Error updating status for enquiry '${id}' via API:`, err);
      return this.fallbackRepo.updateStatus(id, status);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/enquiries/${id}`);
      return true;
    } catch (err) {
      console.warn(`[ApiEnquiryRepository] Error deleting enquiry '${id}' via API:`, err);
      return false;
    }
  }
}
