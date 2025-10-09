const utilities = require("../utilities/")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
  .trim()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid email is required.")
  .custom(async (account_email) => {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists){
      throw new Error("Email exists. Please log in or use different email")
    }
  }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}


/* **********************************
 * Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // El email es requerido y debe ser un email válido
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Se requiere un email válido."),

    // La contraseña es requerida
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("La contraseña es requerida."),
  ];
};

/* **********************************
 * Check data and return errors or continue to login
 * ********************************* */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

/* **********************************
 * Account Info Update Rules
 * ********************************* */
validate.updateInfoRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please enter your name."), 

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .isLength({ min: 2 })
      .withMessage("Please enter your last name."), 

    // valid email is required and checks for existing email (but allows the current one)
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() 
      .withMessage("Please enter a valid email address.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id;
        const account = await accountModel.getAccountByEmail(account_email);
        if (account && account.account_id != account_id) {
          throw new Error("That email address already exists. Please use another one.");
        }
      }),
  ]
}

/* ******************************************
 * Check data for account info update
 * ****************************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
 
    const account = await accountModel.getAccountById(account_id);
    
    res.render("account/update", {
      title: "Update information",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
      account
    })
    return
  }
  next()
}


/* **********************************
 * Password Update Rules
 * ********************************* */
validate.passwordRules = () => {
    return [
        body("account_password")
          .trim()
          .notEmpty()
          .isStrongPassword({
              minLength: 12,
              minLowercase: 1,
              minUppercase: 1,
              minNumbers: 1,
              minSymbols: 1,
          })
          .withMessage("The password does not meet the requirements. (Minimum 12 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol)."),
    ];
};

/* ******************************************
 * Check data for password update
 * ****************************************** */
validate.checkPasswordData = async (req, res, next) => {
    const { account_id } = req.body;
    let errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        
        const account = await accountModel.getAccountById(account_id);

        res.render("account/update", {
            title: "Update information",
            nav,
            errors,
            account 
        });
        return;
    }
    next();
}


module.exports = validate