/**
 * Production-Grade Centralized Error Handler
 *
 * Handles API errors globally with consistent user feedback via toast notifications.
 * Aligned with backend error middleware structure for enterprise-level error handling.
 */

import { toaster } from "./toaster";
import { ApiError, ValidationError } from "@/api/client/types";

/**
 * Error code to user-friendly message mapping
 */
const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  // Auth errors
  UNAUTHORIZED: {
    title: "Authentication Required",
    description: "Please log in to continue",
  },
  FORBIDDEN: {
    title: "Access Denied",
    description: "You don't have permission to perform this action",
  },

  // Client errors
  BAD_REQUEST: {
    title: "Invalid Request",
    description: "The request contains invalid data",
  },
  VALIDATION_ERROR: {
    title: "Validation Failed",
    description: "Please check your input and try again",
  },
  NOT_FOUND: {
    title: "Not Found",
    description: "The requested resource was not found",
  },
  CONFLICT: {
    title: "Conflict",
    description: "This action conflicts with existing data",
  },
  UNPROCESSABLE_ENTITY: {
    title: "Invalid Data",
    description: "Unable to process the provided data",
  },

  // Rate limiting
  TOO_MANY_REQUESTS: {
    title: "Rate Limit Exceeded",
    description: "Too many requests. Please try again later",
  },

  // Server errors
  INTERNAL_ERROR: {
    title: "Server Error",
    description: "An unexpected error occurred. Please try again later",
  },
};

/**
 * Format validation errors from backend
 */
const formatValidationErrors = (errors: ValidationError[]): string => {
  return errors
    .map((err) => `${err.field}: ${err.message}`)
    .join("\n");
};

/**
 * Handle API errors with appropriate user feedback
 *
 * @param error - The API error object from backend
 * @param options - Configuration options
 */
export interface HandleErrorOptions {
  customMessage?: string;
  showToast?: boolean;
  silent?: boolean;
}

export const handleApiError = (
  error: ApiError,
  options: HandleErrorOptions = {}
) => {
  try {
    const { customMessage, showToast = true, silent = false } = options;

    // Silent mode - no toast
    if (silent) {
      return;
    }

    // Don't show toast if explicitly disabled
    if (!showToast) {
      return;
    }

    // Use custom message if provided
    if (customMessage) {
      toaster.error("Error", customMessage);
      return;
    }

    // Handle validation errors with details
    if (error.code === "BAD_REQUEST" && error.details?.errors) {
      const validationErrors = error.details.errors as ValidationError[];
      const formattedErrors = formatValidationErrors(validationErrors);

      toaster.error("Validation Failed", formattedErrors);
      return;
    }

    // Get user-friendly message based on error code
    const errorConfig = ERROR_MESSAGES[error.code];

    if (errorConfig) {
      // Use backend message if available, otherwise use default
      const description = error.message || errorConfig.description;
      toaster.error(errorConfig.title, description);

      // Log error details in development
      if (import.meta.env.DEV) {
        console.error("API Error Details:", {
          code: error.code,
          statusCode: error.statusCode,
          message: error.message,
          details: error.details,
          requestId: error.requestId,
          timestamp: error.timestamp,
          path: error.path,
        });
      }
      return;
    }

    // Fallback for unknown error codes
    toaster.error(
      "Error",
      error.message || "An unexpected error occurred"
    );

    // Log unexpected error codes
    if (import.meta.env.DEV) {
      console.warn("Unknown error code:", error.code, error);
    }
  } catch (e) {
    // Failsafe - don't let error handler crash
    console.error("[handleApiError] Error handler failed:", e);
    toaster.error("Error", "An error occurred");
  }
};

/**
 * Show success toast notification
 */
export const showSuccess = (message: string, title: string = "Success") => {
  toaster.success(title, message);
};

/**
 * Show error toast notification
 */
export const showError = (message: string, title: string = "Error") => {
  toaster.error(title, message);
};

/**
 * Show info toast notification
 */
export const showInfo = (message: string, title: string = "Info") => {
  toaster.info(title, message);
};

/**
 * Show warning toast notification
 */
export const showWarning = (message: string, title: string = "Warning") => {
  toaster.warn(title, message);
};
