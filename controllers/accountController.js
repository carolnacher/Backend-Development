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

    // Si el inicio de sesión es exitoso
    delete accountData.account_password;
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
    
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
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  console.log("Register POST body:", req.body);
  try {
    // hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const result = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
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
/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Management",
    nav,
    errors: null
  })
}

async function accountLogout(req, res) {
  res.clearCookie("jwt");       // borra el JWT
  req.flash("notice", "You have been logged out.");
  res.redirect("/");            // vuelve a la home
}

module.exports = { buildLogin, getAccountByEmail, buildRegister, registerAccount, accountLogin , buildManagement,accountLogout};