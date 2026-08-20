import { useState, useEffect, useCallback } from 'react';
import { Enquiry } from '../types';
import { enquiryService } from '../services/enquiryService';

export function useEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await enquiryService.getAll();
      setEnquiries(data);
    } catch (err: any) {
      console.error('Failed to load enquiries from API:', err);
      setError(err.message || 'Failed to load customer lead inquiries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submitEnquiry = async (data: Omit<Enquiry, 'id' | 'createdAt' | 'status'>) => {
    const created = await enquiryService.create(data);
    await refresh();
    return created;
  };

  const updateStatus = async (id: string, status: Enquiry['status']) => {
    const success = await enquiryService.updateStatus(id, status);
    await refresh();
    return success;
  };

  const deleteEnquiry = async (id: string) => {
    const success = await enquiryService.delete(id);
    await refresh();
    return success;
  };

  return { enquiries, loading, error, refresh, submitEnquiry, updateStatus, deleteEnquiry };
}
