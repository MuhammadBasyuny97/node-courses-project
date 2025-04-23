const multer = require("multer");
const appError = require("../utility/appError");
const httpStatusText = require("../utility/httpStatusText");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("File: ", file);
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(
      appError.create(
        "File Type type must be an image",
        400,
        httpStatusText.FAIL
      ),
      false
    );
  }
};
const upload = multer({ storage: diskStorage, fileFilter });

module.exports = { upload };
