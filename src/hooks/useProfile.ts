import { useState, useEffect, useCallback } from "react";
import { ProfileController } from "@/controllers/profile.controller";
import { UserProfile } from "@/services/profile.service";

export const useProfile = (userId: string | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(!!userId);

  // Check if profile has essential business information
  const hasCompleteProfile = (profile: UserProfile | null): boolean => {
    if (!profile) return false;

    // Essential fields for a complete profile
    const hasBusinessName =
      profile.business_name && profile.business_name.trim() !== "";
    const hasEmail = profile.email && profile.email.trim() !== "";
    const hasPhone = profile.phone && profile.phone.trim() !== "";
    const hasAddress = profile.address && profile.address.trim() !== "";

    // All essential contact information is required
    return hasBusinessName && hasEmail && hasPhone && hasAddress;
  };

  // Load profile when user changes
  const loadProfile = useCallback(async (userId: string) => {
    setProfileLoading(true);
    try {
      const response = await ProfileController.getProfile(userId);
      if (response.success) {
        setProfile(response.data);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Refresh profile function
  const refreshProfile = useCallback(async () => {
    if (userId) {
      await loadProfile(userId);
    }
  }, [userId, loadProfile]);

  // Load profile when userId changes
  useEffect(() => {
    if (userId) {
      setProfileLoading(true);
      loadProfile(userId);
    } else {
      setProfile(null);
      setProfileLoading(false);
    }
  }, [userId, loadProfile]);

  return {
    profile,
    profileLoading,
    hasCompleteProfile: hasCompleteProfile(profile),
    refreshProfile,
  };
};
