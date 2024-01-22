const express = require('express');
const { createCat, listAllCats } = require('../controllers/cat');
const upload = require('../utils/upload');

const router = express.Router();

/**
 * Cat build api
 */
// router.post('/', upload.fields([
//     { name: 'main-image', maxCount: 1 }, 
// ]), async (req, res) => {
//         createCat(req, res);
//     },
//     (error, req, res, next) => {
//         res.status(415).send({ error: error.message })
//     }
// );

/**
 * Cat list api
 */
router.get('/listAllCats', async (req, res) => { listAllCats(req, res) });

module.exports = router;