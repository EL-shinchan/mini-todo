const express = require("express");
const multer = require("multer");
const {
  createQueuedDraftJob,
  ensureQueueDirs,
  listDraftJobs,
  publicJob,
  uploadDir
} = require("../services/photoDraftQueue");

const router = express.Router();

ensureQueueDirs();

const upload = multer({
  dest: uploadDir,
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

router.get("/", (req, res) => {
  const status = String(req.query.status || "").trim();
  const jobs = listDraftJobs()
    .filter((job) => !status || job.status === status)
    .map(publicJob);

  res.json({ jobs });
});

router.post("/workout", (req, res) => {
  upload.single("photo")(req, res, (error) => {
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
      const job = createQueuedDraftJob(req.file);
      return res.status(202).json({
        job: publicJob(job),
        message: "Photo queued. Shinoske will process it at 22:00."
      });
    } catch (queueError) {
      return res.status(500).json({ message: queueError.message || "Could not queue workout photo." });
    }
  });
});

module.exports = router;
