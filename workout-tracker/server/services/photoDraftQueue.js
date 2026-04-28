const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const queueRoot = path.join(__dirname, "../../data/photo-drafts");
const uploadDir = path.join(queueRoot, "uploads");
const jobDir = path.join(queueRoot, "jobs");

function ensureQueueDirs() {
  fs.mkdirSync(uploadDir, { recursive: true });
  fs.mkdirSync(jobDir, { recursive: true });
}

function createJobId() {
  return `${new Date().toISOString().replace(/[:.]/g, "-")}-${crypto.randomBytes(4).toString("hex")}`;
}

function jobPathForId(id) {
  return path.join(jobDir, `${id}.json`);
}

function readJob(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJob(job) {
  ensureQueueDirs();
  fs.writeFileSync(jobPathForId(job.id), `${JSON.stringify(job, null, 2)}\n`);
  return job;
}

function createQueuedDraftJob(file) {
  ensureQueueDirs();
  const id = createJobId();
  const extension = path.extname(file.originalname || "").toLowerCase() || ".jpg";
  const imagePath = path.join(uploadDir, `${id}${extension}`);

  fs.renameSync(file.path, imagePath);

  const job = {
    id,
    status: "pending",
    uploadedAt: new Date().toISOString(),
    originalName: file.originalname || "workout-photo",
    mimeType: file.mimetype,
    imagePath,
    draft: null,
    error: null,
    processedAt: null
  };

  return writeJob(job);
}

function listDraftJobs() {
  ensureQueueDirs();
  return fs
    .readdirSync(jobDir)
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => readJob(path.join(jobDir, fileName)))
    .sort((a, b) => String(b.uploadedAt).localeCompare(String(a.uploadedAt)));
}

function publicJob(job) {
  return {
    id: job.id,
    status: job.status,
    uploadedAt: job.uploadedAt,
    originalName: job.originalName,
    draft: job.draft,
    error: job.error,
    processedAt: job.processedAt
  };
}

module.exports = {
  ensureQueueDirs,
  createQueuedDraftJob,
  listDraftJobs,
  publicJob,
  queueRoot,
  uploadDir,
  jobDir
};
