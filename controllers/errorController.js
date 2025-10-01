const errorController = {};

errorController.throwError = async (req, res, next) => {
  
  let err = new Error('This is a simulated 500 server error.');
  err.status = 500;
  next(err); 
};

module.exports = errorController;