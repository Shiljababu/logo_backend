import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {   
    callback(null, uploadDir);
  },
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    const userId = req.session?.user?.id || "guest"; 
    const fileName = `${userId}-${Date.now()}${ext}`;
    callback(null, fileName);
  }
});

const fileFilter = (req, file, callback) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (allowed.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Only .jpg, .jpeg, and .png files are allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });