const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Get vehicle by ID
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    )
    return result.rows[0]
  } catch (error) {
    console.error("Error fetching inventory by ID:", error)
    throw error
  }
}

/* ***************************
 * Build vehicle detail view
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  try {
    const vehicle_id = req.params.vehicleId
    const data = await invModel.getVehicleById(vehicle_id)

    if (data) {
      const detail = await utilities.buildDetailView(data)
      let nav = await utilities.getNav()
      const vehicleName = data.inv_make + " " + data.inv_model

      res.render("./inventory/detail", {
        title: vehicleName,
        nav,
        detail,
      })
    } else {
      let nav = await utilities.getNav()
      const message = "Sorry, the vehicle was not found."
      res.render("errors/error", {
        title: "Vehicle Not Found",
        nav,
        message,
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/managementView", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0] && invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Deliver Add Inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Process Add Inventory form
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body

    const result = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    )

    if (result) {
      req.flash("notice", `${inv_make} ${inv_model} was successfully added.`)
      res.redirect("/inv/")
    } else {
      req.flash("notice", "Failed to add inventory item.")
      res.status(500).render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationSelect,
        errors: null,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      })
    }
  } catch (error) {
    next(error)
  }
}

invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  } catch (error) {
    next(error)
  }
}

invCont.addClassification = async function (req, res) {
  try {
    const { classification_name } = req.body
    const addResult = await invModel.addClassification(classification_name)
    if (addResult) {
      req.flash("notice", `The classification "${classification_name}" was successfully added.`)
      let nav = await utilities.getNav()
      res.render("inventory/managementView", {
        title: "Inventory Management",
        nav,
        messages: req.flash("notice"),
      })
    } else {
      req.flash("notice", "Sorry, the classification could not be added.")
      res.status(500).render("inventory/add-classification", {
        title: "Add New Classification",
        messages: req.flash("notice"),
        classification_name,
      })
    }
  } catch (error) {
    next(error)
  }
}

// ***************************
// Build edit inventory view
// ***************************
invCont.buildEditInventoryView = async function (req, res, next) {
  try {
    const inventory_id = req.params.inventory_id; // capturamos el parámetro de la URL
    const inventoryItem = await invModel.getInventoryById(inventory_id); // función que obtiene el vehículo por id

    if (!inventoryItem) {
      // si no se encuentra el vehículo, redirigimos o mostramos un error
      return res.status(404).render("errors/404", { message: "Vehicle not found" });
    }

    // Construimos la vista de edición usando tus utilidades
    let nav = await utilities.getNav(); // por ejemplo, tu menú de navegación
    res.render("inventory/edit-inventory", {
      title: `Edit ${inventoryItem.make} ${inventoryItem.model}`,
      nav,
      inventoryItem, // pasamos el objeto del vehículo a la vista
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body

    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      return res.redirect("/inv/")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the update failed.")
      return res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont
