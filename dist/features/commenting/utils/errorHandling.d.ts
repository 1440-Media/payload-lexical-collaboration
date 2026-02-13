/**
 * Utility function to handle errors in async operations
 * @param operation The async operation to execute
 * @param errorMessage The error message to log
 * @param fallbackValue The fallback value to return on error
 * @returns The result of the operation or the fallback value
 */
export declare function withErrorHandling<T>(operation: () => Promise<T>, errorMessage: string, fallbackValue: T): Promise<T>;
/**
 * Utility function to handle errors in async operations with custom error handler
 * @param operation The async operation to execute
 * @param errorHandler The error handler function
 * @returns The result of the operation or the result of the error handler
 */
export declare function withCustomErrorHandling<T>(operation: () => Promise<T>, errorHandler: (error: unknown) => Promise<T> | T): Promise<T>;
/**
 * Utility function to log errors
 * @param context The context of the error
 * @param error The error object
 */
export declare function logError(context: string, error: unknown): void;
