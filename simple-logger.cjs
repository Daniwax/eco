/**
 * Simple logger that writes directly to AppData folder
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

class SimpleLogger {
  constructor() {
    // Simple direct path - no subfolder
    const homeDir = os.homedir();
    const appDataPath = path.join(homeDir, 'AppData', 'Roaming', 'eco');
    
    // Create main app folder if needed
    if (!fs.existsSync(appDataPath)) {
      try {
        fs.mkdirSync(appDataPath, { recursive: true });
      } catch (e) {
        // Silent fail in production
      }
    }
    
    // Create log file directly in app folder
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    this.logFile = path.join(appDataPath, `log-${timestamp}.txt`);
    
    // Write header
    try {
      fs.writeFileSync(this.logFile, '=== Eco Log ===\n');
      fs.appendFileSync(this.logFile, `Started: ${new Date().toISOString()}\n`);
      fs.appendFileSync(this.logFile, `Platform: ${process.platform}\n`);
      fs.appendFileSync(this.logFile, '========================\n\n');
    } catch (e) {
      this.logFile = null;
    }
  }
  
  log(message, data = null) {
    const timestamp = new Date().toISOString();
    let logLine = `[${timestamp}] ${message}`;
    
    if (data !== null && data !== undefined) {
      if (typeof data === 'object') {
        try {
          logLine += ' | ' + JSON.stringify(data);
        } catch (e) {
          logLine += ' | [Object]';
        }
      } else {
        logLine += ' | ' + data;
      }
    }
    
    // Try to write to file
    if (this.logFile) {
      try {
        fs.appendFileSync(this.logFile, logLine + '\n');
      } catch (e) {
        // Silent fail in production
      }
    }
  }
  
  error(message, error) {
    this.log(`ERROR: ${message}`, error?.stack || error?.message || error);
  }
  
  initialize() {
    // No-op for compatibility
  }
  
  getLogPath() {
    return this.logFile || 'no-log-file';
  }
  
  getLogsDirectory() {
    if (this.logFile) {
      return path.dirname(this.logFile);
    }
    const homeDir = os.homedir();
    return path.join(homeDir, 'AppData', 'Roaming', 'eco');
  }
}

module.exports = new SimpleLogger();