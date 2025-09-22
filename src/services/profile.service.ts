import { supabase } from "@/lib/supabase";
import { ErrorService } from "./error.service";

export interface UserProfile {
  id?: string;
  user_id?: string;
  business_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  default_currency?: string;
  default_tax_rate?: number;
  default_payment_terms?: number;
  invoice_prefix?: string;
  bank_name?: string;
  account_number?: string;
  swift_code?: string;
  iban?: string;
  logo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileServiceResponse {
  success: boolean;
  data?: UserProfile;
  message: string;
  error?: string;
}

export class ProfileService {
  /**
   * Get user profile by user ID
   */
  static async getProfile(userId: string): Promise<ProfileServiceResponse> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        ErrorService.logError("ProfileService.getProfile", error);
        return {
          success: false,
          message: "Failed to fetch profile",
          error: error.message,
        };
      }

      return {
        success: true,
        data: data || null,
        message: data ? "Profile fetched successfully" : "No profile found",
      };
    } catch (error) {
      ErrorService.logError("ProfileService.getProfile", error);
      return {
        success: false,
        message: "An unexpected error occurred while fetching profile",
        error: ErrorService.getErrorMessage(error),
      };
    }
  }

  /**
   * Create or update user profile
   */
  static async upsertProfile(
    userId: string,
    profileData: Partial<UserProfile>
  ): Promise<ProfileServiceResponse> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .upsert(
          {
            user_id: userId,
            ...profileData,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          }
        )
        .select()
        .single();

      if (error) {
        ErrorService.logError("ProfileService.upsertProfile", error);
        return {
          success: false,
          message: "Failed to save profile",
          error: error.message,
        };
      }

      return {
        success: true,
        data,
        message: "Profile saved successfully",
      };
    } catch (error) {
      ErrorService.logError("ProfileService.upsertProfile", error);
      return {
        success: false,
        message: "An unexpected error occurred while saving profile",
        error: ErrorService.getErrorMessage(error),
      };
    }
  }

  /**
   * Update specific profile fields
   */
  static async updateProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<ProfileServiceResponse> {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        ErrorService.logError("ProfileService.updateProfile", error);
        return {
          success: false,
          message: "Failed to update profile",
          error: error.message,
        };
      }

      return {
        success: true,
        data,
        message: "Profile updated successfully",
      };
    } catch (error) {
      ErrorService.logError("ProfileService.updateProfile", error);
      return {
        success: false,
        message: "An unexpected error occurred while updating profile",
        error: ErrorService.getErrorMessage(error),
      };
    }
  }

  /**
   * Delete user profile
   */
  static async deleteProfile(userId: string): Promise<ProfileServiceResponse> {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .delete()
        .eq("user_id", userId);

      if (error) {
        ErrorService.logError("ProfileService.deleteProfile", error);
        return {
          success: false,
          message: "Failed to delete profile",
          error: error.message,
        };
      }

      return {
        success: true,
        message: "Profile deleted successfully",
      };
    } catch (error) {
      ErrorService.logError("ProfileService.deleteProfile", error);
      return {
        success: false,
        message: "An unexpected error occurred while deleting profile",
        error: ErrorService.getErrorMessage(error),
      };
    }
  }

  /**
   * Upload profile logo (if needed in the future)
   */
  static async uploadLogo(
    userId: string,
    file: File
  ): Promise<ProfileServiceResponse> {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-logo.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        ErrorService.logError("ProfileService.uploadLogo", uploadError);
        return {
          success: false,
          message: "Failed to upload logo",
          error: uploadError.message,
        };
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-images").getPublicUrl(filePath);

      return {
        success: true,
        data: { logo_url: publicUrl } as UserProfile,
        message: "Logo uploaded successfully",
      };
    } catch (error) {
      ErrorService.logError("ProfileService.uploadLogo", error);
      return {
        success: false,
        message: "An unexpected error occurred while uploading logo",
        error: ErrorService.getErrorMessage(error),
      };
    }
  }
}
