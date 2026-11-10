import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { storage, StorageKeys } from "../../utils/storage";

export type Profile = {
  name: string;
  username: string;
  email: string;
  image: string | null;
};

type ProfileContextType = {
  profile: Profile;
  displayName: string;
  reloadProfile: () => Promise<void>;
  setProfileImage: (uri: string | null) => Promise<void>;
  resetProfile: () => void;
};

const EMPTY_PROFILE: Profile = {
  name: "",
  username: "",
  email: "",
  image: null,
};

const ProfileContext = createContext<ProfileContextType | null>(null);

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be inside ProfileProvider");
  return ctx;
};

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);

  const reloadProfile = useCallback(async () => {
    const [entries] = await storage.multiGet([
      StorageKeys.PROFILE_NAME,
      StorageKeys.PROFILE_USERNAME,
      StorageKeys.PROFILE_EMAIL,
      StorageKeys.PROFILE_IMAGE,
    ]);
    const stored = new Map(entries);

    setProfile({
      name: stored.get(StorageKeys.PROFILE_NAME) ?? "",
      username: stored.get(StorageKeys.PROFILE_USERNAME) ?? "",
      email: stored.get(StorageKeys.PROFILE_EMAIL) ?? "",
      image: stored.get(StorageKeys.PROFILE_IMAGE) ?? null,
    });
  }, []);

  useEffect(() => {
    reloadProfile();
  }, [reloadProfile]);

  const setProfileImage = useCallback(async (uri: string | null) => {
    setProfile((prev) => ({ ...prev, image: uri }));

    if (uri) {
      await storage.setItem(StorageKeys.PROFILE_IMAGE, uri);
    } else {
      await storage.removeItem(StorageKeys.PROFILE_IMAGE);
    }
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(EMPTY_PROFILE);
  }, []);

  const displayName =
    profile.name.trim() || profile.username.trim() || "there";

  const value = useMemo(
    () => ({
      profile,
      displayName,
      reloadProfile,
      setProfileImage,
      resetProfile,
    }),
    [profile, displayName, reloadProfile, setProfileImage, resetProfile],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}
