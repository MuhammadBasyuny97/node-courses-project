const express = require("express");
const { upload } = require("../middleware/uploadImage");
const router = express.Router();
const usersController = require("../controller/users-controller");
const verifyToken = require("../middleware/verifyToken");
const appError = require("../utility/appError");

// Get All Users

router.route("/").get(verifyToken, usersController.getAllUsers);

//Register
router
  .route("/register")
  .post(upload.single("avatar"), usersController.register);
//Login
router.route("/login").post(usersController.login);

module.exports = router;
