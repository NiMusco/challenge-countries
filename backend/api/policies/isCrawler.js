module.exports = async function (req, res, proceed) {

    //Here we would check for a valid jwt token.

    //if (req.me) {
      return proceed();
    //}
  
    // Otherwise, this request did not come from an authorized source.
    return res.forbidden();
  
  };