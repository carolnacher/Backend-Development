// accountRoutes.js

const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const errorHandler = require('../middleware/errorHandler');

// GET route for the path 'account'
// The actual path will be '/account' from the server.js file
router.get('/', accountController.myAccount, errorHandler);

module.exports = router;