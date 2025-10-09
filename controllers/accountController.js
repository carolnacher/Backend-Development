const utilities = require("../utilities/")
const bcrypt = require("bcrypt")
const accountModel = require("../models/account-model")


const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */

async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
 * Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  
  try {
    const accountData = await accountModel.getAccountByEmail(account_email);
    
    // Si no se encuentra el usuario O la contraseña no coincide
    if (!accountData || !(await bcrypt.compare(account_password, accountData.account_password))) {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }

   
    delete accountData.account_password;
    const accessToken = jwt.sign(
  {
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_type: accountData.account_type, 
  },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: "1h" } 
)
    
    if (process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
    }
    
    return res.redirect("/account/");

  } catch (error) {
    console.error("Login process failed:", error); // Es mejor registrar el error
    req.flash("notice", "An internal server error occurred. Please try again later.");
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
}

/* ****************************************
*  Process Registration
* *************************************** */


async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password,account_type } = req.body
  console.log("Register POST body:", req.body);
  try {
    // hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const result = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_type,
      hashedPassword,
      
    )

    if (result) {
      req.flash("notice", "Account created successfully. Please log in.")
      res.redirect("/account/login")
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(500).render("account/register", {
        title: "Register",
        nav,
        errors: null,
      })
    }
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,wxez
    })
  }
}


/* ***************************
 * Build account management view
 * ************************** */
async function buildManagement(req, res, next) {
    let nav = await utilities.getNav();
   
    const accountData = res.locals.accountData; 

    if (!accountData) {
        return res.redirect("/account/login");
    }

    res.render("account/management", { 
        title: "Gestión de cuenta",
        nav,
        errors: null,
        account: accountData, 
    });
}


async function accountLogout(req, res) {
  res.clearCookie("jwt");       // borra el JWT
  req.flash("notice", "You have been logged out.");
  res.redirect("/");            // vuelve a la home
}

async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const account = await accountModel.getAccountById(req.params.account_id)

  res.render("account/update", {
    title: "Actualizar información",
    nav,
    account,
    errors: null
  })
}

async function updateAccount(req, res) {
  const { account_firstname, account_lastname, account_email } = req.body
  const account_id = req.params.account_id

  try {
    await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
    req.flash("notice", "Cuenta actualizada correctamente")
    res.redirect("/account/management")
  } catch (error) {
    console.error(error)
    req.flash("notice", "Error al actualizar la cuenta")
    res.redirect("/account/management")
  }
}

/* ***************************
 * Process Account Info Update
 * ************************** */
async function updateAccountInfo(req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_id } = req.body;

    try {
        const updateResult = await accountModel.updateAccountInfo(
            account_id,
            account_firstname,
            account_lastname,
            account_email
        );
        
        if (updateResult) {
            req.flash("notice", "Account information was successfully updated.");
            res.redirect("/account/"); 
        } else {
            req.flash("notice", "Sorry, the information update failed.");
            res.status(501).render("account/update", {
                title: "Update information",
                nav,
                errors: null,
                account: req.body,
                account_firstname,
                account_lastname,
                account_email,
            });
        }
    } catch (error) {
       
        console.error("Error updating info:", error);
        req.flash("notice", "Server error while updating information.");
        res.redirect("/account/update/" + account_id); 
    }
}


/* ***************************
 * Process Account Password Change
 * ************************** */
async function updateAccountPassword(req, res) {
    let nav = await utilities.getNav();
    const { account_password, account_id } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(account_password, 10);

        const updateResult = await accountModel.updateAccountPassword(
            account_id,
            hashedPassword
        );
        
        if (updateResult) {
            req.flash("notice", "Your password was successfully updated. Please log in again.");
            res.clearCookie("jwt");
            res.redirect("/account/login"); 
        } else {
            req.flash("notice", "Sorry, the password change failed.");
            res.status(501).render("account/update", {
                title: "Update information",
                nav,
                errors: null,
                account: { account_id },
            });
        }
    } catch (error) {
        console.error("Error changing password:", error);
        req.flash("notice", "Server error while changing password.");
        res.redirect("/account/update/" + account_id); 
    }
}


module.exports = { buildLogin, updateAccount, buildUpdateAccount, buildRegister, registerAccount, accountLogin , buildManagement,accountLogout, updateAccountInfo, updateAccountPassword };