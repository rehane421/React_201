const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  // here next is a callback to move to the next middleware once we are done
  // Get token from header
  const token = req.header("x-auth-token");

  //Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
    // 401 - token not authorized
  }

  //Verify if token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    //Here req.user is the logged in user
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
