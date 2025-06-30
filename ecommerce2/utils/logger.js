import fs from "fs";
import path from "path";

export function logError(error) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${error.stack || error}\n`;
  const logPath = path.join(process.cwd(), "logs", "error.log");

  try {
    fs.appendFileSync(logPath, logMessage);
  } catch (err) {
    console.error("Error writing to log file:", err);
  }
}