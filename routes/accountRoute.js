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

router.get(
  "/", 
  utilities.checkJWTToken, 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildManagement)
);


router.get(
  "/management", 
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);

router.get("/logout", accountController.accountLogout);

// Mostrar formulario de actualización
router.get("/update/:account_id", utilities.checkJWTToken, utilities.checkLogin, accountController.buildUpdateAccount)


router.post(
    "/update", 
    utilities.checkJWTToken, 
    utilities.checkLogin, 
    regValidate.updateInfoRules(), 
    regValidate.checkUpdateData,    
    utilities.handleErrors(accountController.updateAccountInfo) 
); 

// 2. PROCESAR CAMBIO DE CONTRASEÑA

router.post(
    "/update/password", 
    utilities.checkJWTToken, 
    utilities.checkLogin, 
    regValidate.passwordRules(), 
    regValidate.checkPasswordData, 
    utilities.handleErrors(accountController.updateAccountPassword) 
);



// Procesar actualización
router.post("/update/:account_id", accountController.updateAccount)



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