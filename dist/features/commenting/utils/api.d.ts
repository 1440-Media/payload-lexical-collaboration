import type { ErrorResponse, PayloadAPIResponse } from '../types/api.js';
/**
 * Utility class for handling API requests
 */
export declare class APIUtils {
    /**
     * Create a standard error response
     * @param message The error message
     * @param details Additional error details
     * @returns A standardized error object
     */
    static createErrorResponse(message: string, details?: Record<string, unknown>): ErrorResponse;
    /**
     * Make a DELETE request to the API
     * @param endpoint The API endpoint
     * @returns The response data
     */
    static delete<T>(endpoint: string): Promise<T>;
    /**
     * Make a GET request to the API
     * @param endpoint The API endpoint
     * @param params Query parameters
     * @returns The response data
     */
    static get<T>(endpoint: string, params?: Record<string, string>): Promise<T>;
    /**
     * Get Payload API response with pagination
     * @param endpoint The API endpoint
     * @param params Query parameters
     * @returns The paginated response
     */
    static getPaginated<T>(endpoint: string, params?: Record<string, string>): Promise<PayloadAPIResponse<T>>;
    /**
     * Make a PATCH request to the API
     * @param endpoint The API endpoint
     * @param data The request body
     * @returns The response data
     */
    static patch<T, D = Record<string, unknown>>(endpoint: string, data: D): Promise<T>;
    /**
     * Make a POST request to the API
     * @param endpoint The API endpoint
     * @param data The request body
     * @returns The response data
     */
    static post<T, D = Record<string, unknown>>(endpoint: string, data: D): Promise<T>;
}
