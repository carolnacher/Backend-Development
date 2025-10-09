const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
 try {
 const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
 return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
 } catch (error) {
 return error.message
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

/* *****************************
* Get account data by account_id
* ***************************** */
async function getAccountById (account_id) {
try {
 const result = await pool.query(
 'SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account WHERE account_id = $1',
 [account_id]
    )
 return result.rows[0]
} catch (error) {
 return new Error("No matching account found")
}
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
 try {
  const sql = "SELECT * FROM account WHERE account_email = $1"
  const email = await pool.query(sql, [account_email])
  return email.rowCount
 } catch (error) {
   return error.message
 }
}

/* *****************************
* Update account information (name, last name, email)
* ***************************** */
async function updateAccountInfo(account_id, account_firstname, account_lastname, account_email) {
    try {
        const sql = 
            "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
        
        const result = await pool.query(sql, [
            account_firstname,
            account_lastname,
            account_email,
            account_id
        ])
        return result.rowCount
    } catch (error) {
        console.error("model error: " + error)
        return error
    }
}

/* *****************************
* Update account password
* ***************************** */
async function updateAccountPassword(account_id, account_password) {
    try {
        const sql = 
            "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
        
        const result = await pool.query(sql, [
            account_password,
            account_id
        ])
        return result.rowCount
    } catch (error) {
        console.error("model error: " + error)
        return error
    }
}

async function addReview(account_id, inv_id, rating, comment) {
  try {
    const sql = `
      INSERT INTO reviews (account_id, inv_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(sql, [account_id, inv_id, rating, comment]);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}

async function getReviewsByVehicle(inv_id) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname
      FROM reviews r
      JOIN account a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.created_at DESC;
    `;
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}

async function deleteReview(review_id, account_id) {
  try {
    const sql = `DELETE FROM reviews WHERE review_id = $1 AND account_id = $2;`;
    const result = await pool.query(sql, [review_id, account_id]);
    return result.rowCount;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
}

module.exports = {
    registerAccount, 
    getAccountByEmail, 
    checkExistingEmail,
    getAccountById,
    updateAccountInfo,
    updateAccountPassword,
    addReview,
    getReviewsByVehicle,
    deleteReview
}