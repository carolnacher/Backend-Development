const pool = require("../database/") 

const reviewModel = {}

/* ****************************************
 *  Add a new review
 * *************************************** */
reviewModel.addReview = async (account_id, inv_id, rating, comment) => {
  try {
    const sql = `
      INSERT INTO review (account_id, inv_id, rating, comment)
      VALUES ($1, $2, $3, $4)
    `
    await pool.query(sql, [account_id, inv_id, rating, comment])
  } catch (error) {
    console.error("Error adding review:", error)
    throw error
  }
}

/* ****************************************
 *  Get all reviews for a specific vehicle
 * *************************************** */
reviewModel.getReviewsByVehicle = async (inv_id) => {
  try {
    const sql = `
      SELECT r.*, a.account_firstname
      FROM review AS r
      JOIN account AS a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.created_at DESC
    `
    const result = await pool.query(sql, [inv_id])
    return result.rows
  } catch (error) {
    console.error("Error fetching reviews:", error)
    throw error
  }
}

module.exports = reviewModel
