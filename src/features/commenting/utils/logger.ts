'use client'

/**
 * Log levels for the application
 */
export enum LogLevel {
  DEBUG = 'debug',
  ERROR = 'error',
  INFO = 'info',
  WARN = 'warn',
}

/**
 * Logger utility for consistent logging across the application
 * This can be expanded to support different environments and log destinations
 */
export class Logger {
  /**
   * Log a debug message (only in development)
   * @param message The debug message
   * @param details Additional debug details
   */
  static debug(message: string, details?: unknown): void {
    // Only log debug messages in development
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, details)
    }
  }

  /**
   * Log an error message
   * @param message The main error message
   * @param details Additional error details or error object
   */
  static error(message: string, details?: unknown): void {
    // In production, this could be modified to send errors to a monitoring service
    console.error(`[ERROR] ${message}`, details)
  }

  /**
   * Log an informational message
   * @param message The info message
   * @param details Additional info details
   */
  static info(message: string, details?: unknown): void {
    console.info(`[INFO] ${message}`, details)
  }

  /**
   * Log a warning message
   * @param message The warning message
   * @param details Additional warning details
   */
  static warn(message: string, details?: unknown): void {
    console.warn(`[WARN] ${message}`, details)
  }
}
