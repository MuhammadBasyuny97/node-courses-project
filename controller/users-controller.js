const User = require("../model/user.model");
const asyncWrapper = require("../middleware/asyncWrapper");
const httpStatusText = require("../utility/httpStatusText");
const appError = require("../utility/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utility/generateJWT");

const getAllUsers = asyncWrapper(async (req, res, next) => {
  console.log("Headers", req.headers);
  //Pagination
  let { limit, page } = req.query;
  limit = limit || 10;
  page = page || 1;
  let skip = (page - 1) * limit;

  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip); // Second Parameter is the projection
  return res.json({ status: httpStatusText.SUCCESS, data: { users } });

  next(error);
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = appError.create(
      "Email and Password is required",
      401,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const user = await User.findOne({ email });
  if (!user) {
    const error = appError.create(
      "user is not found",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const matchedPassword = bcrypt.compare(req.body.password, user.password);
  console.log("Matched:", matchedPassword);
  console.log("user: ", user);

  if (user && matchedPassword) {
    // Generate Token
    const token = await generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });
    console.log("token", token);
    return res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { token },
    });
  } else {
    const error = appError.create("Something Wrong", 500, httpStatusText.ERROR);
    return next(error);
  }
});

const register = asyncWrapper(async (req, res, next) => {
  // console.log(req.body);
  const { firstName, lastName, email, password, role } = req.body;
  console.log("Req.File: ", req.file);
  const avatar = req.file.filename;
  console.log("Avatar: ", avatar);

  const oldUser = await User.findOne({ email });
  if (oldUser) {
    const error = appError.create(
      "user is already exist",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }

  //Password Hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar,
  });

  // Generate JWT Token
  //To generate strong secret key use crypto module and its method randomBytes and make on the REPL
  // require("crypto").randomBytes(32).toString("hex");

  const token = await generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;
  // console.log("Token", token);

  await newUser.save();
  return res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { course: newUser } });
});

module.exports = {
  getAllUsers,
  login,
  register,
};
