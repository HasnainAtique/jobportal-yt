// middlewares/mutler.js - Complete updated file
import multer from "multer";

const storage = multer.memoryStorage();

// ✅ File filter for PDF validation
const fileFilter = (req, file, cb) => {
    console.log('File received:', file.originalname, file.mimetype);
    
    // Accept PDF files only
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} not allowed. Only PDF files are accepted.`), false);
    }
};

// ✅ Updated multer configuration
export const singleUpload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit for database storage
    },
    fileFilter // Add file validation
}).single("file");

// ✅ Error handling middleware
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File too large. Maximum size is 2MB.',
                success: false
            });
        }
    }
    
    if (err.message.includes('not allowed')) {
        return res.status(400).json({
            message: 'Only PDF files are allowed.',
            success: false
        });
    }
    
    next(err);
};