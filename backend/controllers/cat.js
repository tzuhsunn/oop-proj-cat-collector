const productModel = require('../models/product');
const fs = require('fs');
const contentType = require('content-type');
const PAGE_SIZE = 6;
const s3Uploadv2 = require('../utils/s3').s3Uploadv2;
const createConnection = require('../utils/db');
const conn = createConnection();
const { setRedisKey, getRedisKey } = require('../utils/redis');

/**
 * Product build api
 */
const createProduct = async (req, res) => {
    try {
        // check user rules
        const role = req.headers.authorization.split(' ')[1];
        if (role !== 'admin') {
            throw { code: 403, message: 'Permission denied' };
        }
        // check respose type
        const parseContentType = contentType.parse(req.headers['content-type']);
        if (parseContentType.type !== 'multipart/form-data') {
            throw { code: 400, message: 'Bad request' };            
        } else if (!req.body.id || !req.body.category || !req.body.title || !req.body.price) {
            throw { code: 400, message: 'Please fill out required fields' };            
        }

        // Get response body and file
        const productData = req.body;
        const mainImageFile = req.files['main-image'][0];
        const imagesFiles = req.files['images'];
        const colorsArray = isJSON(productData.colors) ? JSON.parse(productData.colors) : productData.colors;
        const variantsArray = isJSON(productData.variants) ? JSON.parse(productData.variants) : productData.variants;

        // upload image to s3
        const uploadS3 = await s3Uploadv2(mainImageFile, imagesFiles);
        console.log(uploadS3);

        // Get file path
        const mainImagePath = uploadS3[0].Location;
        const imagesPath = uploadS3.slice(1).map(upload => upload.Location); // image path
        
        // insert data to database
        (await conn).query('START TRANSACTION');
        const productId = await productModel.addProduct(productData, colorsArray, variantsArray, mainImagePath, imagesPath);

        // create success response
        const response = {
            data: [{
                id: productId, 
                category: productData.category, 
                title: productData.title,
                description: productData.description, 
                price: productData.price, 
                texture: productData.texture, 
                wash: productData.wash, 
                place: productData.place, 
                note: productData.note, 
                story: productData.story, 
                colors: colorsArray,
                // sizes: JSON.parse(productData.sizes),
                variants: variantsArray,
                main_image: mainImagePath,
                images: imagesPath, 
            }],
        };
        console.log(response);
        (await conn).query('COMMIT');
        res.status(200).json({ response });
        
    } catch (error) {
        (await conn).query('ROLLBACK');
        console.log(error);
        console.log(error.code);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'User already exists' });
        } 
        return res.status(error.code || 500).json({ error: error.message });
    }
};

/**
 * Product list api
 */
const getProductList = async (req, res) => {
    try {
        const category = req.params.category;
        const isAllCategory = category === 'all';
        const page = parseInt(req.query.paging) || 0; 

        if (!category) {
            return res.status(400).json({ error: 'Category is required' });
        }

        const products = await productModel.getProductsList(category, isAllCategory, page, PAGE_SIZE);

        if (!products) {
            return res.status(404).json({ error: 'Products not found' });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Product detail api
 */
const getProductDetail = async (req, res) => {
    try {
        const detailID = req.query.id;
        if (!detailID) {
            return res.status(400).json({ error: 'Product ID is required' });
        }
        
        // get cached data first
        const cachedProduct = await getRedisKey(`product:${detailID}`);
        if (cachedProduct) {
            return res.status(200).json({ data: JSON.parse(cachedProduct) });
        }

        // no cache, go to db and set key
        const product = await productModel.getProductDetail(detailID);
        if (!product) {
            return res.status(404).json({ error: 'Products not found' });
        }
        await setRedisKey(`product:${detailID}`, JSON.stringify(product));
        res.status(200).json({ data: product });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Product search api
 */
const searchProduct = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        if (!keyword) {
            return res.status(400).json({ error: 'keyword is required' });
        }
        const page = parseInt(req.query.paging) || 0;
        const offset = page * PAGE_SIZE;

        const products = await productModel.searchProduct(keyword);

        if (!products) {
            return res.status(404).json({ error: 'Products not found' });
        }
        const selectedData = products.slice(offset, offset+PAGE_SIZE);
        const response = { data: selectedData };
        if (selectedData.length === PAGE_SIZE && products.length > offset + PAGE_SIZE) {
            response.next_paging = page + 1;
        }
        return res.status(200).json(response);    
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    createProduct,
    getProductList,
    getProductDetail,
    searchProduct
};

function isJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
}
