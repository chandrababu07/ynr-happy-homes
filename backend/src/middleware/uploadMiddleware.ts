import multer from 'multer';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

const DANGEROUS_EXTENSIONS = new Set([
  '.exe', '.bat', '.cmd', '.sh', '.php', '.js', '.vbs', '.msi', '.com', '.scr', '.pif'
]);

const storage = multer.memoryStorage();

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const ext = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase();
  
  if (DANGEROUS_EXTENSIONS.has(ext)) {
    return cb(new Error(`Security Violation: File extension '${ext}' is strictly prohibited`));
  }

  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new Error(`Invalid File Type: Received '${file.mimetype}'. Only JPEG, PNG, WEBP images and PDF documents are allowed`));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB max limit
  },
  fileFilter,
});
