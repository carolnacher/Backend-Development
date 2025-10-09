const reviewModel = require("../models/review-model");
const utilities = require("../utilities");

const reviewController = {};

reviewController.addReview = async (req, res) => {
  const { inv_id, rating, comment } = req.body;
  const account_id = res.locals.accountData.account_id;

  try {
    if (!rating || rating < 1 || rating > 5) {
      req.flash("notice", "Debe seleccionar una calificación entre 1 y 5.");
      return res.redirect(`/inv/detail/${inv_id}`);
    }

    await reviewModel.addReview(account_id, inv_id, rating, comment);
    req.flash("notice", "Gracias por su reseña de seguridad.");
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    console.error(error);
    req.flash("notice", "Error al enviar la reseña. Intente nuevamente.");
    res.redirect(`/inv/detail/${inv_id}`);
  }
};

reviewController.getReviewsByVehicle = async (req, res) => {
  const inv_id = req.params.vehicleId;
  const reviews = await reviewModel.getReviewsByVehicle(inv_id);
  return reviews;
};

module.exports = reviewController;
