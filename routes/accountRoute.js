// accountRoute.js
const regValidate = require('../utilities/account-validation')
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities/');
const validate = require('../utilities/account-validation');
const invController = require("../controllers/invController")


// GET route for the 'my account' view
router.get('/login', utilities.handleErrors(accountController.buildLogin));


router.get('/register', utilities.handleErrors(accountController.buildRegister));

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

router.get("/", utilities.handleErrors(invController.buildManagementView));

router.get("/logout", accountController.accountLogout);


// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);


module.exports = router;