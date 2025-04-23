require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator"); //body is middleware
// joi , express-validator and zod are validators packages
const mongoose = require("mongoose");
const httpStatusText = require("./utility/httpStatusText");
const cors = require("cors");
const coursesRouter = require("./routes/course-routes");
const usersRouter = require("./routes/user-routes");
const path = require("path");
const app = express();

const url = process.env.MONGO_URL;
const main = async () => {
  await mongoose.connect(url);
  console.log("DataBase is Connected");
};
main().then(console.log()).catch(console.log());

//let { getAllCourses } = require("./controller/controller");
let coursesController = require("./controller/course-controller");

app.use(bodyParser.json()); // = app.use(express.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/*const corsOptions = {
  optionsSuccessStatus: 200,
};*/

app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);

//Default MiddleWare ||  Default Router  -- WildCard
//Global Middleware for not founding routes
app.use((req, res, next) => {
  res.status(404).json({
    status: httpStatusText.ERROR,
    message: "This Resource is not available",
  });
  console.log("Hi Everyone");
  next();
});

//Global MiddleWare for Error Handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 404).json({
    status: error.httpStatusText || httpStatusText.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

const port = process.env.PORT;
app.listen(port || 5000, () => {
  console.log(`Server is working on port: ${port}`);
});
