import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const baseDir = path.join(__dirname, '../uploads');
    const url = req.originalUrl || '';
    let category = 'general';
    if (/residential/i.test(url)) category = 'residential';
    else if (/machinery/i.test(url)) category = 'machinery';
    else if (/vehicles?/i.test(url)) category = 'vehicles';
    else if (/business/i.test(url)) category = 'business';

    const uploadDir = path.join(baseDir, category);
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
    } catch (_) {}
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const url = req.originalUrl || '';
    let category = 'general';
    if (/residential/i.test(url)) category = 'residential';
    else if (/machinery/i.test(url)) category = 'machinery';
    else if (/vehicles?/i.test(url)) category = 'vehicles';
    else if (/business/i.test(url)) category = 'business';

    const roNo = req.body?.roNo;
    const moNo = req.body?.moNo;
    const voNo = req.body?.voNo;
    const boNo = req.body?.boNo;
    const anyId = req.body?.id;
    const assocId =
      (category === 'residential' && roNo) ? roNo :
      (category === 'machinery' && moNo) ? moNo :
      (category === 'vehicles' && voNo) ? voNo :
      (category === 'business' && boNo) ? boNo :
      anyId || 'unknown';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeExt = path.extname(file.originalname) || '.jpg';
    cb(null, `${category}-${assocId}-${uniqueSuffix}${safeExt}`);
  }
});

// Create upload middleware
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

export default upload;
