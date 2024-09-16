import path from "path";
import url from "url";
import fs from "fs/promises"; // Use the promise-based API
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads");

export const uploadController = async (req, res) => {
  const file = req.file;

  if (!file) {
    console.log("No file uploaded.");
    return res.status(400).send("No file uploaded.");
  }

  // Extract file extension from the original name
  const extension = path.extname(file.originalname);
  console.log(extension);

  // Generate UUID
  const newUuid = uuidv4();
  console.log("Generated UUID:", newUuid);

  try {
    const previewBuffer = await sharp(file.buffer)
      .resize(210)
      .jpeg({ quality: 100 })
      .toBuffer();

    const previewBase64 = `data:image/jpeg;base64,${previewBuffer.toString(
      "base64"
    )}`;

    const files = await fs.readdir(uploadDir);

    const outputPath = path.join(uploadDir, newUuid + extension);

    // Check if the file exists in the uploadDir
    if (files.includes(newUuid + extension)) {
      console.log(`File found: ${outputPath}`);
    } else {
      await sharp(file.buffer).toFile(outputPath);
    }

    res.status(200).json({
      message: "Image processed.",
      preview: previewBase64,
      path: outputPath,
      uuid: newUuid + extension,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Edit Controller
export const editController = async (req, res) => {
  const body = req.body;

  if (!req.body.uuid) {
    console.log("No UUID provided.");
    return res.status(400).send("No UUID provided.");
  }

  try {
    // Check if the file exists in the uploadDir
    const files = await fs.readdir(uploadDir);

    const filePath = path.join(uploadDir, req.body.uuid);

    let fileBuffer;

    if (files.includes(req.body.uuid)) {
      console.log(`File found: ${filePath}`);
      fileBuffer = await fs.readFile(filePath);
    } else {
      console.log("File not found");
      return res.status(404).send("File not found.");
    }

    const previewBuffer = await sharp(fileBuffer)
      .resize(210)
      .rotate(Number(body.rotate))
      .modulate({
        brightness: Number(body.brightness),
        saturation: Number(body.saturation),
      })
      .normalise({
        lower: Number(body.contrastLow),
        upper: Number(body.contrastHigh),
      })
      .toBuffer();

    const previewBase64 = `data:image/jpeg;base64,${previewBuffer.toString(
      "base64"
    )}`;

    const qualityBuffer = await sharp(fileBuffer)
      .rotate(Number(body.rotate))
      .modulate({
        brightness: Number(body.brightness),
        saturation: Number(body.saturation),
        // lightness: Number(body.hue),
      })
      .normalise({
        lower: Number(body.contrastLow),
        upper: Number(body.contrastHigh),
      })
      .toBuffer();

    // Determine the output format
    const format = body.format || "jpeg";
    const formattedFileName = `edited-${body.uuid
      .split(".")
      .slice(0, -1)
      .join(".")}.${format}`;

    console.log(formattedFileName);
    // Save the modified image to a file so it can be downloaded
    const editedFilePath = path.join(uploadDir, `edited-${formattedFileName}`);
    await sharp(qualityBuffer).toFile(editedFilePath);

    res.status(200).json({
      message: "Image processed.",
      preview: previewBase64,
      path: filePath,
      downloadPath: `/download/edited-${formattedFileName}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Add a download route
export const downloadController = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  try {
    // Check if the file exists
    await fs.access(filePath);
    res.download(filePath); // Send the file for download
  } catch (error) {
    res.status(404).send("File not found");
  }
};
