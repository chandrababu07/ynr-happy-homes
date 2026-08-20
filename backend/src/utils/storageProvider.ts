import fs from 'fs';
import path from 'path';

export interface SavedFileInfo {
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  storageKey: string;
}

export interface IStorageProvider {
  saveFile(file: Express.Multer.File): Promise<SavedFileInfo>;
  deleteFile(storageKey: string): Promise<boolean>;
  getFileUrl(storageKey: string): string;
}

export class LocalStorageProvider implements IStorageProvider {
  private uploadsDir: string;
  private baseUrl: string;

  constructor(uploadsDir?: string, baseUrl?: string) {
    this.uploadsDir = uploadsDir || path.join(process.cwd(), 'uploads');
    this.baseUrl = baseUrl || process.env.BASE_URL || 'http://localhost:8000';
    this.ensureUploadsDir();
  }

  private ensureUploadsDir(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<SavedFileInfo> {
    this.ensureUploadsDir();
    
    // Generate unique storage key / filename
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedBase = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const storageKey = `${Date.now()}_${sanitizedBase}${ext}`;
    const destinationPath = path.join(this.uploadsDir, storageKey);

    if (file.buffer) {
      await fs.promises.writeFile(destinationPath, file.buffer);
    } else if (file.path && file.path !== destinationPath) {
      await fs.promises.copyFile(file.path, destinationPath);
      // Clean up temp file if different
      try {
        await fs.promises.unlink(file.path);
      } catch {
        // ignore temp file unlink error
      }
    }

    const url = `${this.baseUrl}/uploads/${storageKey}`;

    return {
      filename: storageKey,
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      url,
      storageKey,
    };
  }

  async deleteFile(storageKey: string): Promise<boolean> {
    try {
      const filePath = path.join(this.uploadsDir, storageKey);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (err) {
      console.warn(`[LocalStorageProvider] Failed to delete file '${storageKey}':`, err);
      return false;
    }
  }

  getFileUrl(storageKey: string): string {
    return `${this.baseUrl}/uploads/${storageKey}`;
  }
}

// Default export storageProvider instance
export const storageProvider: IStorageProvider = new LocalStorageProvider();
