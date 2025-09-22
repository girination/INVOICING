import { AUTH_CONSTANTS } from "@/constants/auth.constants";

export interface ValidationResult {
  isValid: boolean;
  message: string;
  field?: string;
}

export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export class ValidationService {
  /**
   * Validate email format
   */
  static validateEmail(email: string): ValidationResult {
    if (!email) {
      return {
        isValid: false,
        message: AUTH_CONSTANTS.ERROR_MESSAGES.REQUIRED_FIELD,
        field: "email",
      };
    }

    if (!AUTH_CONSTANTS.EMAIL.REGEX.test(email)) {
      return {
        isValid: false,
        message: AUTH_CONSTANTS.ERROR_MESSAGES.INVALID_EMAIL,
        field: "email",
      };
    }

    return {
      isValid: true,
      message: "Valid email",
      field: "email",
    };
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): ValidationResult {
    if (!password) {
      return {
        isValid: false,
        message: AUTH_CONSTANTS.ERROR_MESSAGES.REQUIRED_FIELD,
        field: "password",
      };
    }

    if (password.length < AUTH_CONSTANTS.PASSWORD.MIN_LENGTH) {
      return {
        isValid: false,
        message: AUTH_CONSTANTS.ERROR_MESSAGES.PASSWORD_TOO_SHORT,
        field: "password",
      };
    }

    return {
      isValid: true,
      message: "Valid password",
      field: "password",
    };
  }

  /**
   * Get password requirements status
   */
  static getPasswordRequirements(password: string): PasswordRequirements {
    return {
      minLength: password.length >= AUTH_CONSTANTS.PASSWORD.STRONG_MIN_LENGTH,
      hasUppercase: AUTH_CONSTANTS.PASSWORD.REQUIRE_UPPERCASE
        ? /[A-Z]/.test(password)
        : true,
      hasLowercase: AUTH_CONSTANTS.PASSWORD.REQUIRE_LOWERCASE
        ? /[a-z]/.test(password)
        : true,
      hasNumber: AUTH_CONSTANTS.PASSWORD.REQUIRE_NUMBER
        ? /\d/.test(password)
        : true,
      hasSpecialChar: AUTH_CONSTANTS.PASSWORD.REQUIRE_SPECIAL_CHAR
        ? /[!@#$%^&*(),.?":{}|<>]/.test(password)
        : true,
    };
  }

  /**
   * Check if password meets all requirements
   */
  static isPasswordStrong(password: string): boolean {
    const requirements = this.getPasswordRequirements(password);
    return Object.values(requirements).every(Boolean);
  }

  /**
   * Validate name field
   */
  static validateName(name: string, fieldName: string): ValidationResult {
    if (!name || name.trim().length === 0) {
      return {
        isValid: false,
        message: `${fieldName} is required`,
        field: fieldName.toLowerCase().replace(/\s+/g, "_"),
      };
    }

    if (name.trim().length < 2) {
      return {
        isValid: false,
        message: `${fieldName} must be at least 2 characters long`,
        field: fieldName.toLowerCase().replace(/\s+/g, "_"),
      };
    }

    return {
      isValid: true,
      message: `Valid ${fieldName.toLowerCase()}`,
      field: fieldName.toLowerCase().replace(/\s+/g, "_"),
    };
  }

  /**
   * Validate company name
   */
  static validateCompany(company: string): ValidationResult {
    if (!company || company.trim().length === 0) {
      return {
        isValid: true, // Company is optional
        message: "Company name is optional",
        field: "company",
      };
    }

    if (company.trim().length < 2) {
      return {
        isValid: false,
        message: "Company name must be at least 2 characters long",
        field: "company",
      };
    }

    return {
      isValid: true,
      message: "Valid company name",
      field: "company",
    };
  }

  /**
   * Validate password confirmation
   */
  static validatePasswordConfirmation(
    password: string,
    confirmPassword: string
  ): ValidationResult {
    if (!confirmPassword) {
      return {
        isValid: false,
        message: "Please confirm your password",
        field: "confirmPassword",
      };
    }

    if (password !== confirmPassword) {
      return {
        isValid: false,
        message: "Passwords do not match",
        field: "confirmPassword",
      };
    }

    return {
      isValid: true,
      message: "Passwords match",
      field: "confirmPassword",
    };
  }

  /**
   * Validate terms acceptance
   */
  static validateTermsAcceptance(accepted: boolean): ValidationResult {
    if (!accepted) {
      return {
        isValid: false,
        message: "You must accept the terms and conditions",
        field: "acceptTerms",
      };
    }

    return {
      isValid: true,
      message: "Terms accepted",
      field: "acceptTerms",
    };
  }

  /**
   * Validate sign up form data
   */
  static validateSignUpForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    company: string;
    acceptTerms: boolean;
  }): { isValid: boolean; errors: ValidationResult[] } {
    const errors: ValidationResult[] = [];

    // Validate first name
    const firstNameValidation = this.validateName(data.firstName, "First name");
    if (!firstNameValidation.isValid) {
      errors.push(firstNameValidation);
    }

    // Validate last name
    const lastNameValidation = this.validateName(data.lastName, "Last name");
    if (!lastNameValidation.isValid) {
      errors.push(lastNameValidation);
    }

    // Validate email
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation);
    }

    // Validate password
    const passwordValidation = this.validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.push(passwordValidation);
    }

    // Validate password confirmation
    const confirmPasswordValidation = this.validatePasswordConfirmation(
      data.password,
      data.confirmPassword
    );
    if (!confirmPasswordValidation.isValid) {
      errors.push(confirmPasswordValidation);
    }

    // Validate company (optional)
    const companyValidation = this.validateCompany(data.company);
    if (!companyValidation.isValid) {
      errors.push(companyValidation);
    }

    // Validate terms acceptance
    const termsValidation = this.validateTermsAcceptance(data.acceptTerms);
    if (!termsValidation.isValid) {
      errors.push(termsValidation);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate sign in form data
   */
  static validateSignInForm(data: { email: string; password: string }): {
    isValid: boolean;
    errors: ValidationResult[];
  } {
    const errors: ValidationResult[] = [];

    // Validate email
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation);
    }

    // Validate password
    const passwordValidation = this.validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.push(passwordValidation);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
