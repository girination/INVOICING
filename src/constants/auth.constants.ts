export const AUTH_CONSTANTS = {
  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 6,
    STRONG_MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: true,
  },

  // Email validation
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },

  // Name validation
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },

  // Company validation
  COMPANY: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },

  // Error codes
  ERROR_CODES: {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    NETWORK_ERROR: "NETWORK_ERROR",
    AUTH_ERROR: "AUTH_ERROR",
    UNKNOWN_ERROR: "UNKNOWN_ERROR",
    EMAIL_IN_USE: "EMAIL_IN_USE",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    EMAIL_NOT_CONFIRMED: "EMAIL_NOT_CONFIRMED",
  },

  // Success messages
  SUCCESS_MESSAGES: {
    SIGN_UP:
      "Account created successfully. Please check your email to verify your account.",
    SIGN_IN: "Successfully signed in.",
    SIGN_OUT: "Successfully signed out.",
    EMAIL_VERIFICATION:
      "Please check your email and click the confirmation link.",
  },

  // Error messages
  ERROR_MESSAGES: {
    REQUIRED_FIELD: "This field is required",
    INVALID_EMAIL: "Please enter a valid email address",
    PASSWORD_TOO_SHORT: "Password must be at least 6 characters long",
    PASSWORD_STRONG_REQUIRED:
      "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
    PASSWORDS_DO_NOT_MATCH: "Passwords do not match",
    TERMS_NOT_ACCEPTED: "You must accept the terms and conditions",
    INVALID_CREDENTIALS:
      "Invalid email or password. Please check your credentials and try again.",
    EMAIL_IN_USE:
      "An account with this email already exists. Please sign in instead.",
    EMAIL_NOT_CONFIRMED:
      "Please check your email and click the confirmation link before signing in.",
    NETWORK_ERROR: "Network error. Please check your connection and try again.",
    UNEXPECTED_ERROR: "An unexpected error occurred. Please try again.",
  },

  // Routes
  ROUTES: {
    SIGN_IN: "/signin",
    SIGN_UP: "/signup",
    DASHBOARD: "/app/dashboard",
    LANDING: "/",
  },

  // Form validation
  VALIDATION: {
    DEBOUNCE_DELAY: 300, // ms
    MIN_PASSWORD_LENGTH: 6,
    MAX_PASSWORD_LENGTH: 128,
  },
} as const;

export type AuthErrorCode =
  (typeof AUTH_CONSTANTS.ERROR_CODES)[keyof typeof AUTH_CONSTANTS.ERROR_CODES];
export type AuthSuccessMessage =
  (typeof AUTH_CONSTANTS.SUCCESS_MESSAGES)[keyof typeof AUTH_CONSTANTS.SUCCESS_MESSAGES];
export type AuthErrorMessage =
  (typeof AUTH_CONSTANTS.ERROR_MESSAGES)[keyof typeof AUTH_CONSTANTS.ERROR_MESSAGES];
