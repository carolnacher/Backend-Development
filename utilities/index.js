const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}
/* ****************************************
 * Build the vehicle detail view HTML
 * Expected input: Single vehicle object 
 * *************************************** */
Util.buildDetailView = function (vehicle) {
    // Check if the vehicle data is valid before proceeding
    if (!vehicle || Object.keys(vehicle).length === 0) {
        return '<p class="notice">Sorry, no vehicle data could be found.</p>';
    }

    // Format price for display
    const formattedPrice = new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
    }).format(vehicle.inv_price);

    // Format miles for display
    const formattedMiles = new Intl.NumberFormat('en-US').format(vehicle.inv_miles);

    let html = '<div id="inventory-detail" class="inv-detail-container">';
    
    // Vehicle Image
    html += '<div class="inv-detail-image">';
    html += '<img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + '" />';
    html += '</div>';
    
    // Vehicle Details and Price
    html += '<div class="inv-detail-info">';
    
    // Price
    html += '<p class="detail-price">Price: ' + formattedPrice + '</p>';

    // Description
    html += '<p class="detail-description">';
    html += '<span class="detail-label">Description:</span> ' + vehicle.inv_description;
    html += '</p>';

    // Detail List (Specs)
    html += '<div class="detail-specs">';
    html += '<h2>Vehicle Specifics</h2>';
    html += '<ul class="spec-list">';
    
    // Year
    html += '<li><span class="spec-label">Year:</span> <span>' + vehicle.inv_year + '</span></li>';
    
    // Mileage
    html += '<li><span class="spec-label">Mileage:</span> <span>' + formattedMiles + ' miles</span></li>';

    // Color
    html += '<li><span class="spec-label">Color:</span> <span>' + vehicle.inv_color + '</span></li>';
    
    // Classification (assuming classification_name is available from the model join)
    if (vehicle.classification_name) {
        html += '<li><span class="spec-label">Classification:</span> <span>' + vehicle.classification_name + '</span></li>';
    }
    
    html += '</ul>';
    html += '</div>'; // End Detail Specs
    
    html += '</div>'; // End Detail Info
    
    html += '</div>'; // End Container
    
    return html;
}

module.exports = Util;