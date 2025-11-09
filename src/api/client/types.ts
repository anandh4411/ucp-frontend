/**
 * API Response Types - Aligned with Backend Error Middleware
 */

// Success response structure
export interface ApiResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

// Error response structure (matches backend ErrorResponse)
export interface ApiErrorResponse {
  success: false;
  error: {
    statusCode: number;
    code: string;
    message: string;
    details?: any;
    requestId: string;
    timestamp: string;
    path: string;
  };
}

// Frontend-friendly error object
export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
  details?: any;
  requestId?: string;
  timestamp?: string;
  path?: string;
}

// Validation error details (from backend validation middleware)
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
