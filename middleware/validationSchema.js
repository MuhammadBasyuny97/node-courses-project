const { body } = require("express-validator");

const validationSchema = () => {
  return [
    body("title")
      .notEmpty()
      .withMessage("Name is required and cannot be empty")
      .isLength({ min: 2 })
      .withMessage("Min Length must be 2 char"),
    body("price")
      .notEmpty()
      .withMessage("Price is required and cannot be empty")
      .isLength({ min: 1 })
      .withMessage("Min Length must be 1 char"),
  ];
};

module.exports = { validationSchema };
