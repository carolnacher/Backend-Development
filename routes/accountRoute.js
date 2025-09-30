// accountRoute.js
const regValidate = require('../utilities/account-validation')
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/');


// GET route for the 'my account' view
router.get('/login', utilities.handleErrors(accountController.buildLogin));


router.get('/register', utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);


module.exports = router;