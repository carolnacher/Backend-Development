// accountRoute.js

const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')
const utilities = require('../utilities/')


// GET route for the 'my account' view
router.get('/login', utilities.handleErrors(accountController.buildLogin))
module.exports = router;