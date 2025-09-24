const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// Ruta para filtrar por clasificación
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;