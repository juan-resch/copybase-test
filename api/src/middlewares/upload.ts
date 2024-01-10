import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = path.resolve(__dirname, "..", "temp");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    cb(null, path.resolve(__dirname, "..", "temp"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;
