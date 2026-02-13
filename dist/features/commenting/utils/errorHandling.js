'use client';
/**
 * Utility function to handle errors in async operations
 * @param operation The async operation to execute
 * @param errorMessage The error message to log
 * @param fallbackValue The fallback value to return on error
 * @returns The result of the operation or the fallback value
 */ export async function withErrorHandling(operation, errorMessage, fallbackValue) {
    try {
        return await operation();
    } catch (error) {
        console.error(`${errorMessage}:`, error);
        return fallbackValue;
    }
}
/**
 * Utility function to handle errors in async operations with custom error handler
 * @param operation The async operation to execute
 * @param errorHandler The error handler function
 * @returns The result of the operation or the result of the error handler
 */ export async function withCustomErrorHandling(operation, errorHandler) {
    try {
        return await operation();
    } catch (error) {
        return errorHandler(error);
    }
}
/**
 * Utility function to log errors
 * @param context The context of the error
 * @param error The error object
 */ export function logError(context, error) {
    console.error(`Error in ${context}:`, error);
}

//# sourceMappingURL=errorHandling.js.map