/**
 * Log levels for the application
 */
export declare enum LogLevel {
    DEBUG = "debug",
    ERROR = "error",
    INFO = "info",
    WARN = "warn"
}
/**
 * Logger utility for consistent logging across the application
 * This can be expanded to support different environments and log destinations
 */
export declare class Logger {
    /**
     * Log a debug message (only in development)
     * @param message The debug message
     * @param details Additional debug details
     */
    static debug(message: string, details?: unknown): void;
    /**
     * Log an error message
     * @param message The main error message
     * @param details Additional error details or error object
     */
    static error(message: string, details?: unknown): void;
    /**
     * Log an informational message
     * @param message The info message
     * @param details Additional info details
     */
    static info(message: string, details?: unknown): void;
    /**
     * Log a warning message
     * @param message The warning message
     * @param details Additional warning details
     */
    static warn(message: string, details?: unknown): void;
}
