import { enquiryRepository, CreateEnquiryData, UpdateEnquiryData } from '../repositories/enquiry.repository.js';

export class EnquiryService {
  async getAllEnquiries() {
    return enquiryRepository.findAll();
  }

  async getEnquiryById(id: string) {
    const item = await enquiryRepository.findById(id);
    if (!item) {
      const error: any = new Error(`Customer enquiry with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return item;
  }

  async createEnquiry(data: CreateEnquiryData) {
    return enquiryRepository.create(data);
  }

  async updateEnquiry(id: string, data: UpdateEnquiryData) {
    await this.getEnquiryById(id);
    return enquiryRepository.update(id, data);
  }

  async deleteEnquiry(id: string) {
    await this.getEnquiryById(id);
    return enquiryRepository.delete(id);
  }
}

export const enquiryService = new EnquiryService();
