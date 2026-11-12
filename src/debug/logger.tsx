import fs from "fs";
import path from "path";
import { homedir } from "node:os";

const LOG_FILE = path.join(homedir(), ".bmanager", "app.log");

export const log = (message: string) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;

  fs.appendFileSync(LOG_FILE, logEntry);
};

export const cleanupLogs = (): void => {
  const cutoffDate = new Date();
  let replacement = "";
  cutoffDate.setDate(cutoffDate.getDate() - 3);

  try {
    const content = fs.readFileSync(LOG_FILE, "utf8");
    const lines = content.split("\n");

    for (const line of lines) {
      if (!line.trim()) continue;

      const timestampMatch = line.match(/^\[(.*?)\]/);

      if (timestampMatch && timestampMatch[1]) {
        const timestampString = timestampMatch[1];
        const entryDate = new Date(timestampString);

        // Check if the entry date is newer than the cutoff date
        if (entryDate >= cutoffDate) {
          if (!replacement) {
            replacement = line + "\n";
          } else {
            replacement += line + "\n";
          }
        }
      }
    }

    if (replacement.trim() !== "") {
      fs.writeFileSync(LOG_FILE, replacement);
    } else if (lines.length > 0 && replacement === "") {
      fs.writeFileSync(LOG_FILE, "");
    }
  } catch (e) {
    log(
      `WARNING! FAILED TO DELETE OLD LOGS, this can be ignored if it's your first time opening the app. Here's the error:${e}`,
    );
  }
};
