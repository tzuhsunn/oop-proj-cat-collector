const catModel = require('../models/cat');
const fs = require('fs');
const contentType = require('content-type');
const s3Uploadv2 = require('../utils/s3').s3Uploadv2;
const createConnection = require('../utils/db');
const conn = createConnection();

/**
 * cat build api
 */
// const createCat = async (req, res) => {
//     try {
//         // check request type
//         const parseContentType = contentType.parse(req.headers['content-type']);
//         if (parseContentType.type !== 'multipart/form-data') {
//             throw { code: 400, message: 'Bad request' };            
//         } else if (!req.body.id || !req.body.category || !req.body.title || !req.body.price) {
//             throw { code: 400, message: 'Please fill out required fields' };            
//         }

//         // Get response body and file
//         const catData = req.body;
//         const mainImageFile = req.files['main-image'][0];

//         // upload image to s3
//         const uploadS3 = await s3Uploadv2(mainImageFile, imagesFiles);
//         console.log(uploadS3);

//         // Get file path
//         const mainImagePath = uploadS3[0].Location;
        
//         // insert data to database
//         (await conn).query('START TRANSACTION');
//         const productId = await productModel.addProduct(productData, colorsArray, variantsArray, mainImagePath, imagesPath);

//         // create success response
//         const response = {
//             data: [{
//                 id: productId, 
//                 main_image: mainImagePath,
//             }],
//         };
//         console.log(response);
//         (await conn).query('COMMIT');
//         res.status(200).json({ response });
        
//     } catch (error) {
//         (await conn).query('ROLLBACK');
//         console.log(error);
//         console.log(error.code);

//         return res.status(error.code || 500).json({ error: error.message });
//     }
// };

/**
 * Cat list api
 */
const listAllCats = async (req, res) => {
    try {
        const cats = await catModel.listAllCats();
        if (!cats) {
            return res.status(404).json({ error: 'cats not found' });
        }
        res.status(200).json(cats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    // createCat,
    listAllCats,
};
