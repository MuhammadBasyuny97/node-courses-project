const jwt = require("jsonwebtoken");
const appError = require("../utility/appError");
const httpStatusText = require("../utility/httpStatusText");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];
  if (!authHeader) {
    const error = appError.create(
      "Token is required",
      401,
      httpStatusText.FAIL
    );
    next(error);
    //return res.status(401).json("Token is required");
  }
  const token = authHeader.split(" ")[1];
  // const token = authToken.substring(7)
  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    console.log("currentUser", currentUser);
    next();
  } catch (err) {
    const error = appError.create("Invalid Token", 401, httpStatusText.ERROR);
    next(error);
  }
  //console.log("decodedToken: ", decodedToken);
};

module.exports = verifyToken;
