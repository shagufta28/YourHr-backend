const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig'); // Import your Cloudinary configuration
const multer = require('multer');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'resumes', // Folder where files will be stored in Cloudinary
        allowed_formats: ['pdf', 'doc', 'docx'], // Allowed file formats
    },
});

const upload = multer({ storage });

module.exports = upload;
