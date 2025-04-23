const express = require("express");
const { body } = require("express-validator");

const router = express.Router();
const coursesController = require("../controller/course-controller");
const { validationSchema } = require("../middleware/validationSchema");
const verifyToken = require("../middleware/verifyToken");
const userRoles = require("../utility/userRoles");
const allowedTo = require("../middleware/allowedTo");

router
  .route("/")
  .get(coursesController.getAllCourses)
  .post(
    verifyToken,
    allowedTo(userRoles.MANAGER),
    validationSchema(),
    coursesController.createCourse
  );

router
  .route("/:id")
  .get(coursesController.getSingleCourse)
  .patch(coursesController.updateCourse)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    coursesController.deleteCourse
  );
//Update a Course

//delete a course

module.exports = router;
