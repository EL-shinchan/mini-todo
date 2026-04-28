const express = require("express");
const multer = require("multer");
const { parseWorkoutPhoto } = require("../services/photoDraftParser");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype || !file.mimetype.startsWith("image/")) {
      return callback(new Error("Upload an image file, like JPG, PNG, or HEIC."));
    }

    return callback(null, true);
  }
});

router.post("/workout", (req, res) => {
  upload.single("photo")(req, res, async (error) => {
    if (error) {
      const message = error.code === "LIMIT_FILE_SIZE"
        ? "Image is too large. Keep it under 5MB."
        : error.message || "Could not read image upload.";
      return res.status(400).json({ message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Choose a workout photo first." });
    }

    try {
      const result = await parseWorkoutPhoto(req.file);
      return res.json(result);
    } catch (parseError) {
      const statusCode = Number(parseError.statusCode || 500);
      return res.status(statusCode).json({ message: parseError.message || "Could not extract a workout draft." });
    }
  });
});

module.exports = router;
