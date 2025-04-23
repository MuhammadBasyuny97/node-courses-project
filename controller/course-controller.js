let { body, validationResult } = require("express-validator");
const httpStatusText = require("../utility/httpStatusText.js");
const asyncWrapper = require("../middleware/asyncWrapper.js");
const Course = require("../model/course.model.js");
const AppError = require("../utility/appError.js");
const appError = require("../utility/appError.js");

const getAllCourses = asyncWrapper(async (req, res, next) => {
  //Pagination
  let { limit, page } = req.query;
  limit = limit || 10;
  page = page || 1;
  let skip = (page - 1) * limit;

  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip); // Second Parameter is the projection
  return res.json({ status: httpStatusText.SUCCESS, data: { courses } });

  next(error);
});

const getSingleCourse = asyncWrapper(async (req, res, next) => {
  const id = req.params.id; //force that the result is number;
  const course = await Course.findById(id, { __v: false });
  //const course = await Course.find({ _id: id }, {__v: false});
  if (!course) {
    /*return res.status(404).json({
      status: httpStatusText.FAIL,
      data: { course: "Course is Not Found" },
    });*/

    const error = appError.create(
      "course is not found ",
      404,
      httpStatusText.FAIL
    );

    return next(error);
  }
  res.status(200).json({ status: httpStatusText.SUCCESS, data: { course } });
});

const createCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //res.status(404).json({ status: httpStatusText.FAIL, data: errors.array() });
    const err = appError.create(errors.array(), 404, httpStatusText.FAIL);
    return next(err);
  }
  const newCourse = new Course(req.body);
  await newCourse.save();
  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
});

const updateCourse = asyncWrapper(async (req, res) => {
  const id = req.params.id;
  console.log("First");
  let updatedCourse = await Course.findByIdAndUpdate(id, {
    $set: { ...req.body },
  });
  updatedCourse = await Course.findById(id);
  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { course: updatedCourse },
  });
});

const deleteCourse = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;
  const result = await Course.deleteOne({ _id: id });
  //console.log(result);
  if (result.deletedCount === 0) {
    const error = appError.create(
      "Cannot Delete the Item",
      401,
      httpStatusText.FAIL
    );
    return next(error);
  }
  return res.status(200).json({ success: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
