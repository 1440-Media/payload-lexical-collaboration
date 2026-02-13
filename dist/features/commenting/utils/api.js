'use client';
import { Logger } from './logger.js';
/**
 * Utility class for handling API requests
 */ export class APIUtils {
    /**
   * Create a standard error response
   * @param message The error message
   * @param details Additional error details
   * @returns A standardized error object
   */ static createErrorResponse(message, details) {
        return {
            error: message,
            ...details ? {
                details
            } : {}
        };
    }
    /**
   * Make a DELETE request to the API
   * @param endpoint The API endpoint
   * @returns The response data
   */ static async delete(endpoint) {
        try {
            // Make the request
            const response = await fetch(endpoint, {
                method: 'DELETE'
            });
            // Handle errors
            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            // Parse and return the response
            return await response.json();
        } catch (error) {
            Logger.error(`Error deleting ${endpoint}:`, error);
            throw error;
        }
    }
    /**
   * Make a GET request to the API
   * @param endpoint The API endpoint
   * @param params Query parameters
   * @returns The response data
   */ static async get(endpoint, params) {
        try {
            // Build the URL with query parameters
            const url = new URL(endpoint, window.location.origin);
            if (params) {
                Object.entries(params).forEach(([key, value])=>{
                    url.searchParams.append(key, value);
                });
            }
            // Make the request
            const response = await fetch(url.toString());
            // Handle errors
            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            // Parse and return the response
            return await response.json();
        } catch (error) {
            Logger.error(`Error fetching from ${endpoint}:`, error);
            throw error;
        }
    }
    /**
   * Get Payload API response with pagination
   * @param endpoint The API endpoint
   * @param params Query parameters
   * @returns The paginated response
   */ static async getPaginated(endpoint, params) {
        return this.get(endpoint, params);
    }
    /**
   * Make a PATCH request to the API
   * @param endpoint The API endpoint
   * @param data The request body
   * @returns The response data
   */ static async patch(endpoint, data) {
        try {
            // Make the request
            const response = await fetch(endpoint, {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PATCH'
            });
            // Handle errors
            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            // Parse and return the response
            return await response.json();
        } catch (error) {
            Logger.error(`Error patching ${endpoint}:`, error);
            throw error;
        }
    }
    /**
   * Make a POST request to the API
   * @param endpoint The API endpoint
   * @param data The request body
   * @returns The response data
   */ static async post(endpoint, data) {
        try {
            // Make the request
            const response = await fetch(endpoint, {
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            });
            // Handle errors
            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            // Parse and return the response
            return await response.json();
        } catch (error) {
            Logger.error(`Error posting to ${endpoint}:`, error);
            throw error;
        }
    }
}

//# sourceMappingURL=api.js.map