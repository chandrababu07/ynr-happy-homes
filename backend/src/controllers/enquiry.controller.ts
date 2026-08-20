import { Request, Response } from 'express';
import { enquiryService } from '../services/enquiry.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAllEnquiries = asyncHandler(async (_req: Request, res: Response) => {
  const enquiries = await enquiryService.getAllEnquiries();
  return res.status(200).json(ApiResponse.success('Customer enquiries retrieved successfully', enquiries));
});

export const getEnquiryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const item = await enquiryService.getEnquiryById(id);
  return res.status(200).json(ApiResponse.success('Customer enquiry details retrieved successfully', item));
});

export const createEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const item = await enquiryService.createEnquiry(req.body);
  return res.status(201).json(ApiResponse.success('Customer enquiry submitted successfully', item));
});

export const updateEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await enquiryService.updateEnquiry(id, req.body);
  return res.status(200).json(ApiResponse.success('Customer enquiry updated successfully', updated));
});

export const deleteEnquiry = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await enquiryService.deleteEnquiry(id);
  return res.status(200).json(ApiResponse.success(`Customer enquiry with ID '${id}' deleted successfully`));
});
