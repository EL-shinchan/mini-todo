const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const configPath = path.join(__dirname, "../../data/config.json");
const allowedTimezones = new Set(["Asia/Shanghai", "UTC", "Europe/London", "America/New_York", "America/Los_Angeles"]);
const defaultConfig = {
  photoProcessor: {
    enabled: true,
    time: "22:00",
    timezone: "Asia/Shanghai",
    frequency: "daily",
    cronJobId: "3787c796-7724-437d-afa7-daa94b3ce573"
  }
};

function ensureConfigDir() {
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
}

function readConfig() {
  ensureConfigDir();

  if (!fs.existsSync(configPath)) {
    writeConfig(defaultConfig);
    return structuredClone(defaultConfig);
  }

  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  return mergeWithDefaults(config);
}

function writeConfig(config) {
  ensureConfigDir();
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  return config;
}

function mergeWithDefaults(config) {
  return {
    ...defaultConfig,
    ...config,
    photoProcessor: {
      ...defaultConfig.photoProcessor,
      ...(config && config.photoProcessor ? config.photoProcessor : {})
    }
  };
}

function validatePhotoProcessor(input) {
  const current = readConfig().photoProcessor;
  const next = {
    ...current,
    enabled: Boolean(input.enabled),
    time: String(input.time || current.time).trim(),
    timezone: String(input.timezone || current.timezone).trim(),
    frequency: String(input.frequency || current.frequency).trim()
  };

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(next.time)) {
    throw new Error("Processor time must use HH:MM 24-hour format.");
  }

  if (!allowedTimezones.has(next.timezone)) {
    throw new Error("Unsupported timezone.");
  }

  if (next.frequency !== "daily") {
    throw new Error("Only daily processing is supported right now.");
  }

  if (!next.cronJobId) {
    throw new Error("Missing OpenClaw cron job id.");
  }

  return next;
}

function timeToCron(time) {
  const [hour, minute] = time.split(":");
  return `${Number(minute)} ${Number(hour)} * * *`;
}

function openclawBin() {
  return process.env.OPENCLAW_BIN || "/opt/homebrew/bin/openclaw";
}

function syncPhotoProcessorCron(photoProcessor) {
  const args = [
    "cron",
    "edit",
    photoProcessor.cronJobId,
    "--cron",
    timeToCron(photoProcessor.time),
    "--tz",
    photoProcessor.timezone,
    photoProcessor.enabled ? "--enable" : "--disable"
  ];

  try {
    execFileSync(openclawBin(), args, {
      cwd: path.join(__dirname, "../../.."),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
  } catch (error) {
    const stderr = error.stderr ? String(error.stderr).trim() : "";
    const stdout = error.stdout ? String(error.stdout).trim() : "";
    throw new Error(stderr || stdout || error.message || "OpenClaw cron sync failed.");
  }

  return {
    cronJobId: photoProcessor.cronJobId,
    cronExpr: timeToCron(photoProcessor.time),
    timezone: photoProcessor.timezone,
    enabled: photoProcessor.enabled
  };
}

function updatePhotoProcessorConfig(input) {
  const currentConfig = readConfig();
  const nextPhotoProcessor = validatePhotoProcessor(input);
  const sync = syncPhotoProcessorCron(nextPhotoProcessor);
  const nextConfig = {
    ...currentConfig,
    photoProcessor: nextPhotoProcessor
  };

  writeConfig(nextConfig);
  return { config: nextConfig, sync };
}

module.exports = {
  allowedTimezones,
  readConfig,
  updatePhotoProcessorConfig,
  configPath,
  timeToCron
};
