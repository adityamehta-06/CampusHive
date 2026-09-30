import multer from "multer";
import path from "path";
import fs from "fs";

const __dirname = import.meta.dirname;

// uploads folder
const uploadFolder = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// save location + file name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now().toString() + path.extname(file.originalname));
  },
});

// only jpg / png
const imageFilter = function (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG and PNG images are allowed."), false);
  }
};

// multer with 2MB limit
const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export default upload;
