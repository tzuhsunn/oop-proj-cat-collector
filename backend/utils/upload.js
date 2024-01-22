const multer = require('multer');
const path = require('path');

/**
 * upload config to local /upload folder
 */

// const storage = multer.diskStorage({
// destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, '../uploads');
//     cb(null, uploadPath);
// },
// filename: (req, file, cb) => {
//     // Add date and random number
//     const uniqueSuffix = Math.round(Math.random() * 1E9);
//     cb(null, file.originalname + '-' + uniqueSuffix);
// },
// limits: {
//     fileSize: 1024 * 1024 * 1 // 1MB
// }
// });
// const fileFilter = (req, file, cb) => {
// if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//     const error = new Error('Please upload an image');
//     error.status = 415;
//     cb(error);
// }
// cb(null, true);
// }
// const upload = multer({ storage: storage, fileFilter: fileFilter });


const storage =  multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    if (file.mimetype.split("/")[0] === 'image') {
        cb(null, true);
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter, 
    limits: { fileSize: 2000000 }, 
});

module.exports = upload;