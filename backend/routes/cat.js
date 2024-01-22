const express = require('express');
const { createProduct, searchProduct, getProductDetail, getProductList } = require('../controllers/product');
const upload = require('../utils/upload');

const router = express.Router();

/**
 * Product build api
 */
router.post('/', upload.fields([
    { name: 'main-image', maxCount: 1 }, 
    { name: 'images', maxCount: 5 }
]), async (req, res) => {
        createProduct(req, res);
    },
    (error, req, res, next) => {
        res.status(415).send({ error: error.message })
    }
);

/**
 * Product search api
 */
router.get('/search', async (req, res) => { searchProduct(req, res) });

/**
 * Product detail api
 */
router.get('/details', async (req, res) => { getProductDetail(req, res) });

/**
 * Product list api
 */
router.get('/:category', async (req, res) => { getProductList(req, res) });

module.exports = router;