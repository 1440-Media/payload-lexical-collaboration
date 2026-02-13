'use client';
/**
 * Log levels for the application
 */ export var LogLevel = /*#__PURE__*/ function(LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["ERROR"] = "error";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    return LogLevel;
}({});
/**
 * Logger utility for consistent logging across the application
 * This can be expanded to support different environments and log destinations
 */ export class Logger {
    /**
   * Log a debug message (only in development)
   * @param message The debug message
   * @param details Additional debug details
   */ static debug(message, details) {
        // Only log debug messages in development
        if (process.env.NODE_ENV !== 'production') {
            console.debug(`[DEBUG] ${message}`, details);
        }
    }
    /**
   * Log an error message
   * @param message The main error message
   * @param details Additional error details or error object
   */ static error(message, details) {
        // In production, this could be modified to send errors to a monitoring service
        console.error(`[ERROR] ${message}`, details);
    }
    /**
   * Log an informational message
   * @param message The info message
   * @param details Additional info details
   */ static info(message, details) {
        console.info(`[INFO] ${message}`, details);
    }
    /**
   * Log a warning message
   * @param message The warning message
   * @param details Additional warning details
   */ static warn(message, details) {
        console.warn(`[WARN] ${message}`, details);
    }
}

//# sourceMappingURL=logger.js.map