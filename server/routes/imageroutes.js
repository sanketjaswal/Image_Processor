import express from "express";
import {
  downloadController,
  editController,
  uploadController,
} from "../controller/imageController.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("image"), uploadController);

router.post("/edit", upload.single("image"), editController);

router.get("/download/:filename", downloadController);
export default router;
