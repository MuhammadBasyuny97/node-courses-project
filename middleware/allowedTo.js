const appError = require("../utility/appError");
const httpStatusText = require("../utility/httpStatusText.js");

const allowedTo = (...roles) => {
  //console.log("roles", roles);
  return async (req, res, next) => {
    console.log("roles", roles);
    console.log("Current User is: ", req.currentUser);
    const authorized = roles.includes(req.currentUser?.role);
    console.log(authorized);
    if (!authorized) {
      const error = appError.create(
        "This user is not authorized",
        401,
        httpStatusText.FAIL
      );
      return next(error);
    }

    next();
  };
};

module.exports = allowedTo;
