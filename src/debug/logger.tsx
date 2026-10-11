import fs from 'fs';
import path from 'path';
import { homedir } from "node:os";

const LOG_FILE = path.join(homedir(), ".bmanager", "app.log");

export const logger = (message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    
    fs.appendFileSync(LOG_FILE, logEntry);
};