// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const errorController = require('../controllers/errorController');
const utilities = require("../utilities/")  

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:vehicleId", invController.buildByVehicleId);
router.get("/trigger-error", errorController.throwError);
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
router.get("/", utilities.handleErrors(invController.buildManagementView))

router.get("/newVehicle", utilities.handleErrors(invController.buildAddInventory))
router.post("/newVehicle", utilities.handleErrors(invController.addInventory))

router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))
router.post("/addClassification", utilities.handleErrors(invController.addClassification))

router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))
router.get("/edit/:inv_id", invController.editInventoryView)


router.post("/update/",  utilities.handleErrors(invController.updateInventory));

module.exports = router;