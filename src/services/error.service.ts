export interface ErrorDetails {
  code: string;
  message: string;
  field?: string;
  timestamp: Date;
}

export class ErrorService {
  /**
   * Log error with context
   */
  static logError(
    error: unknown,
    context: string,
    additionalData?: Record<string, any>
  ): void {
    const errorDetails: ErrorDetails = {
      code: this.getErrorCode(error),
      message: this.getErrorMessage(error),
      timestamp: new Date(),
    };

    console.error(`[${context}] Error:`, {
      ...errorDetails,
      ...additionalData,
      originalError: error,
    });
  }

  /**
   * Get user-friendly error message
   */
  static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === "string") {
      return error;
    }

    if (error && typeof error === "object" && "message" in error) {
      return String(error.message);
    }

    return "An unexpected error occurred";
  }

  /**
   * Get error code for categorization
   */
  static getErrorCode(error: unknown): string {
    if (error && typeof error === "object" && "code" in error) {
      return String(error.code);
    }

    if (error instanceof Error) {
      return error.name || "UNKNOWN_ERROR";
    }

    return "UNKNOWN_ERROR";
  }

  /**
   * Check if error is a network error
   */
  static isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.message.includes("network") ||
        error.message.includes("fetch") ||
        error.message.includes("timeout")
      );
    }
    return false;
  }

  /**
   * Check if error is a validation error
   */
  static isValidationError(error: unknown): boolean {
    const code = this.getErrorCode(error);
    return (
      code.includes("VALIDATION") ||
      code.includes("INVALID") ||
      code.includes("REQUIRED")
    );
  }

  /**
   * Check if error is an authentication error
   */
  static isAuthError(error: unknown): boolean {
    const code = this.getErrorCode(error);
    return (
      code.includes("AUTH") ||
      code.includes("UNAUTHORIZED") ||
      code.includes("FORBIDDEN")
    );
  }

  /**
   * Get appropriate error message based on error type
   */
  static getContextualErrorMessage(error: unknown, context: string): string {
    if (this.isNetworkError(error)) {
      return "Network error. Please check your connection and try again.";
    }

    if (this.isValidationError(error)) {
      return this.getErrorMessage(error);
    }

    if (this.isAuthError(error)) {
      return "Authentication error. Please sign in again.";
    }

    // Context-specific error messages
    switch (context) {
      case "signin":
        return "Failed to sign in. Please check your credentials and try again.";
      case "signup":
        return "Failed to create account. Please try again.";
      case "logout":
        return "Failed to sign out. Please try again.";
      default:
        return this.getErrorMessage(error);
    }
  }

  /**
   * Create standardized error response
   */
  static createErrorResponse(
    error: unknown,
    context: string
  ): {
    success: false;
    message: string;
    error: string;
    code: string;
  } {
    const message = this.getContextualErrorMessage(error, context);
    const code = this.getErrorCode(error);

    this.logError(error, context);

    return {
      success: false,
      message,
      error: this.getErrorMessage(error),
      code,
    };
  }
}
