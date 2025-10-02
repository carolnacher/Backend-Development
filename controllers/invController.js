const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
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
}
/* ***************************
 * Build vehicle detail view
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId;
  const data = await invModel.getVehicleById(vehicle_id);

  if (data) {
    const detail = await utilities.buildDetailView(data);
    let nav = await utilities.getNav();

    const classificationSelect = await utilities.buildClassificationList()

    const vehicleName = data.inv_make + " " + data.inv_model;

    res.render("./inventory/detail", {
      title: vehicleName,
      nav,
      detail,
    });
  } else {
    // Maneja el caso en que no se encuentre el vehículo
    let nav = await utilities.getNav();
    const message = "Lo siento, no se encontró el vehículo.";
    res.render("errors/error", {
      title: "Vehicle Not Found",
      nav,
      message,
    });
  }
};

module.exports = invCont; 