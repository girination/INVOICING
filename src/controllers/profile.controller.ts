import { ProfileService, UserProfile } from "@/services/profile.service";
import { ValidationService } from "@/services/validation.service";
import { ErrorService } from "@/services/error.service";

export interface ProfileControllerResponse {
  success: boolean;
  data?: UserProfile;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export class ProfileController {
  /**
   * Get user profile
   */
  static async getProfile(userId: string): Promise<ProfileControllerResponse> {
    try {
      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      const response = await ProfileService.getProfile(userId);
      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      ErrorService.logError("ProfileController.getProfile", error);
      return {
        success: false,
        message: "An unexpected error occurred while fetching profile",
      };
    }
  }

  /**
   * Save user profile with validation
   */
  static async saveProfile(
    userId: string,
    profileData: Partial<UserProfile>
  ): Promise<ProfileControllerResponse> {
    try {
      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      // Validate profile data
      const validation = this.validateProfileData(profileData);
      if (!validation.isValid) {
        return {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        };
      }

      // Clean and prepare data
      const cleanedData = this.cleanProfileData(profileData);

      const response = await ProfileService.upsertProfile(userId, cleanedData);
      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      ErrorService.logError("ProfileController.saveProfile", error);
      return {
        success: false,
        message: "An unexpected error occurred while saving profile",
      };
    }
  }

  /**
   * Update specific profile fields
   */
  static async updateProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<ProfileControllerResponse> {
    try {
      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      // Validate only the fields being updated
      const validation = this.validateProfileData(updates, true);
      if (!validation.isValid) {
        return {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        };
      }

      const cleanedData = this.cleanProfileData(updates);
      const response = await ProfileService.updateProfile(userId, cleanedData);

      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      ErrorService.logError("ProfileController.updateProfile", error);
      return {
        success: false,
        message: "An unexpected error occurred while updating profile",
      };
    }
  }

  /**
   * Delete user profile
   */
  static async deleteProfile(
    userId: string
  ): Promise<ProfileControllerResponse> {
    try {
      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      const response = await ProfileService.deleteProfile(userId);
      return {
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      ErrorService.logError("ProfileController.deleteProfile", error);
      return {
        success: false,
        message: "An unexpected error occurred while deleting profile",
      };
    }
  }

  /**
   * Upload profile logo
   */
  static async uploadLogo(
    userId: string,
    file: File
  ): Promise<ProfileControllerResponse> {
    try {
      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      if (!file) {
        return {
          success: false,
          message: "File is required",
        };
      }

      // Validate file
      const fileValidation = this.validateFile(file);
      if (!fileValidation.isValid) {
        return {
          success: false,
          message: "File validation failed",
          errors: fileValidation.errors,
        };
      }

      const response = await ProfileService.uploadLogo(userId, file);
      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      ErrorService.logError("ProfileController.uploadLogo", error);
      return {
        success: false,
        message: "An unexpected error occurred while uploading logo",
      };
    }
  }

  /**
   * Validate profile data
   */
  private static validateProfileData(
    data: Partial<UserProfile>,
    isUpdate: boolean = false
  ): { isValid: boolean; errors: Array<{ field: string; message: string }> } {
    const errors: Array<{ field: string; message: string }> = [];

    // Validate email if provided
    if (data.email) {
      const emailValidation = ValidationService.validateEmail(data.email);
      if (!emailValidation.isValid) {
        errors.push({
          field: "email",
          message: emailValidation.message,
        });
      }
    }

    // Validate website URL if provided
    if (data.website) {
      const websiteValidation = this.validateWebsite(data.website);
      if (!websiteValidation.isValid) {
        errors.push({
          field: "website",
          message: websiteValidation.message,
        });
      }
    }

    // Validate tax rate if provided
    if (data.default_tax_rate !== undefined) {
      if (data.default_tax_rate < 0 || data.default_tax_rate > 100) {
        errors.push({
          field: "default_tax_rate",
          message: "Tax rate must be between 0 and 100",
        });
      }
    }

    // Validate banking information - if any banking field is provided, all three are required
    const hasBankName = data.bank_name && data.bank_name.trim() !== "";
    const hasAccountNumber =
      data.account_number && data.account_number.trim() !== "";
    const hasSwiftCode = data.swift_code && data.swift_code.trim() !== "";
    const hasAnyBankingInfo = hasBankName || hasAccountNumber || hasSwiftCode;

    if (hasAnyBankingInfo) {
      if (!hasBankName) {
        errors.push({
          field: "bank_name",
          message: "Bank name is required when providing banking information",
        });
      }
      if (!hasAccountNumber) {
        errors.push({
          field: "account_number",
          message:
            "Account number is required when providing banking information",
        });
      }
      if (!hasSwiftCode) {
        errors.push({
          field: "swift_code",
          message: "SWIFT code is required when providing banking information",
        });
      }
    }

    // Validate SWIFT code if provided
    if (data.swift_code) {
      const swiftValidation = this.validateSwiftCode(data.swift_code);
      if (!swiftValidation.isValid) {
        errors.push({
          field: "swift_code",
          message: swiftValidation.message,
        });
      }
    }

    // Validate IBAN if provided
    if (data.iban) {
      const ibanValidation = this.validateIBAN(data.iban);
      if (!ibanValidation.isValid) {
        errors.push({
          field: "iban",
          message: ibanValidation.message,
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Clean profile data
   */
  private static cleanProfileData(
    data: Partial<UserProfile>
  ): Partial<UserProfile> {
    const cleaned: Partial<UserProfile> = {};

    // Clean string fields
    if (data.business_name !== undefined) {
      cleaned.business_name = data.business_name?.trim() || null;
    }
    if (data.email !== undefined) {
      cleaned.email = data.email?.trim().toLowerCase() || null;
    }
    if (data.phone !== undefined) {
      cleaned.phone = data.phone?.trim() || null;
    }
    if (data.website !== undefined) {
      cleaned.website = data.website?.trim() || null;
    }
    if (data.address !== undefined) {
      cleaned.address = data.address?.trim() || null;
    }
    if (data.invoice_prefix !== undefined) {
      cleaned.invoice_prefix =
        data.invoice_prefix?.trim().toUpperCase() || null;
    }
    if (data.bank_name !== undefined) {
      cleaned.bank_name = data.bank_name?.trim() || null;
    }
    if (data.account_number !== undefined) {
      cleaned.account_number = data.account_number?.trim() || null;
    }
    if (data.swift_code !== undefined) {
      cleaned.swift_code = data.swift_code?.trim().toUpperCase() || null;
    }
    if (data.iban !== undefined) {
      cleaned.iban = data.iban?.trim().toUpperCase() || null;
    }

    // Copy other fields as-is
    if (data.default_currency !== undefined)
      cleaned.default_currency = data.default_currency;
    if (data.default_tax_rate !== undefined)
      cleaned.default_tax_rate = data.default_tax_rate;

    return cleaned;
  }

  /**
   * Validate website URL
   */
  private static validateWebsite(website: string): {
    isValid: boolean;
    message: string;
  } {
    if (!website) {
      return { isValid: true, message: "" };
    }

    const urlPattern = /^https?:\/\/.+\..+/;
    if (!urlPattern.test(website)) {
      return {
        isValid: false,
        message: "Please enter a valid website URL (e.g., https://example.com)",
      };
    }

    return { isValid: true, message: "" };
  }

  /**
   * Validate SWIFT code
   */
  private static validateSwiftCode(swiftCode: string): {
    isValid: boolean;
    message: string;
  } {
    if (!swiftCode) {
      return { isValid: true, message: "" };
    }

    const swiftPattern = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    if (!swiftPattern.test(swiftCode)) {
      return {
        isValid: false,
        message: "SWIFT code must be 8-11 characters (letters and numbers)",
      };
    }

    return { isValid: true, message: "" };
  }

  /**
   * Validate IBAN
   */
  private static validateIBAN(iban: string): {
    isValid: boolean;
    message: string;
  } {
    if (!iban) {
      return { isValid: true, message: "" };
    }

    // Basic IBAN validation (country code + check digits + account number)
    const ibanPattern =
      /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/;
    if (!ibanPattern.test(iban)) {
      return {
        isValid: false,
        message: "Please enter a valid IBAN",
      };
    }

    return { isValid: true, message: "" };
  }

  /**
   * Validate uploaded file
   */
  private static validateFile(file: File): {
    isValid: boolean;
    errors: Array<{ field: string; message: string }>;
  } {
    const errors: Array<{ field: string; message: string }> = [];

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.push({
        field: "file",
        message: "File size must be less than 5MB",
      });
    }

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      errors.push({
        field: "file",
        message: "File must be an image (JPEG, PNG, GIF, or WebP)",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
