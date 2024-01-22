const express = require('express');
const { userSignUp, userSignIn, userProfile } = require('../controllers/user');
const upload = require('../utils/upload');

const router = express.Router();

/**
 * User signup api
 */
router.post('/signup', async (req, res) => { userSignUp(req, res) });

/**
 * User signin api
 */
router.post('/signin', async (req, res) => { userSignIn(req, res) });

/**
 * User profile api
 */
router.get('/profile', async (req, res) => { userProfile(req, res) });

module.exports = router;