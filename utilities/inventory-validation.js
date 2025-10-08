const { body, validationResult } = require("express-validator")
const utilities = require("../utilities/")
const validate = {}

/* **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a make."),
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a model."),
    body("inv_year")
      .trim()
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Please provide a valid year."),
    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price."),
    body("inv_color")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a color."),
  ]
}

/* ******************************
 * Check inventory data and return errors or continue to add new inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_price, inv_color } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Inventory",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_color,
    })
    return
  }
  next()
}


 /* ******************************
  * Check inventory data and return errors or continue to update inventory
  * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_price, inv_color } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + inv_make + " " + inv_model,
      nav,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_color,
    })
    return
  }
  next()
}

module.exports = validate




