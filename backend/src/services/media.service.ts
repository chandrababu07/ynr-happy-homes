import { mediaRepository } from '../repositories/media.repository.js';
import { storageProvider } from '../utils/storageProvider.js';
import { MediaType, MediaCategory } from '@prisma/client';

export class MediaService {
  async uploadFile(
    file: Express.Multer.File,
    meta?: {
      title?: string;
      category?: MediaCategory;
      type?: MediaType;
      equipmentId?: string;
      propertyId?: string;
      projectId?: string;
      unitId?: string;
    }
  ) {
    if (!file) {
      const error: any = new Error('No file payload uploaded');
      error.statusCode = 400;
      throw error;
    }

    const saved = await storageProvider.saveFile(file);

    const asset = await mediaRepository.create({
      title: meta?.title || file.originalname,
      filename: saved.filename,
      originalName: saved.originalName,
      mimeType: saved.mimeType,
      sizeBytes: saved.sizeBytes,
      url: saved.url,
      storageKey: saved.storageKey,
      type: meta?.type || (saved.mimeType === 'application/pdf' ? MediaType.BROCHURE : MediaType.IMAGE),
      category: meta?.category || MediaCategory.OTHER,
      equipmentId: meta?.equipmentId,
      propertyId: meta?.propertyId,
      projectId: meta?.projectId,
      unitId: meta?.unitId,
    });

    return asset;
  }

  async deleteAsset(id: string) {
    const asset = await mediaRepository.findById(id);
    if (!asset) {
      const error: any = new Error(`Media asset '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }

    // Physical File Cleanup
    if (asset.storageKey) {
      await storageProvider.deleteFile(asset.storageKey);
    }

    // Database Record Deletion
    await mediaRepository.delete(id);
    return true;
  }

  async getMediaByEntity(entityType: 'equipment' | 'property' | 'project' | 'unit', entityId: string) {
    return mediaRepository.findByEntity(entityType, entityId);
  }

  async reorderMedia(items: { id: string; sortOrder: number }[]) {
    return mediaRepository.updateSortOrder(items);
  }
}

export const mediaService = new MediaService();
