import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Centralized storage utility for Taskly
 * All app data is stored locally using AsyncStorage
 * Keys are namespaced with 'taskly:' prefix
 */

const KEY_PREFIX = "taskly:";

export const StorageKeys = {
  // Tasks
  TASKS: `${KEY_PREFIX}tasks`,
  TASKS_VERSION: `${KEY_PREFIX}tasks_version`,
  
  // Auth & User
  IS_LOGGED_IN: `${KEY_PREFIX}is_logged_in`,
  PROFILE_NAME: `${KEY_PREFIX}profile_name`,
  PROFILE_USERNAME: `${KEY_PREFIX}profile_username`,
  PROFILE_EMAIL: `${KEY_PREFIX}profile_email`,
  PROFILE_IMAGE: `${KEY_PREFIX}profile_image`,
  
  // Theme
  DARK_MODE: `${KEY_PREFIX}dark_mode`,
  
  // Onboarding
  HAS_SEEN_WELCOME: `${KEY_PREFIX}has_seen_welcome`,
  HAS_SEEN_CONTINUE: `${KEY_PREFIX}has_seen_continue`,
} as const;

export const storage = {
  /**
   * Get a string value from storage
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to get item ${key}:`, error);
      return null;
    }
  },

  /**
   * Set a string value in storage
   */
  async setItem(key: string, value: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to set item ${key}:`, error);
      return false;
    }
  },

  /**
   * Get and parse JSON from storage
   */
  async getJSON<T>(key: string, fallback: T): Promise<T> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch (error) {
      console.warn(`Failed to get JSON for ${key}:`, error);
      return fallback;
    }
  },

  /**
   * Stringify and save JSON to storage
   */
  async setJSON<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Failed to set JSON for ${key}:`, error);
      return false;
    }
  },

  /**
   * Remove a single item from storage
   */
  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove item ${key}:`, error);
      return false;
    }
  },

  /**
   * Remove multiple items from storage
   */
  async multiRemove(keys: string[]): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      console.warn(`Failed to remove multiple items:`, error);
      return false;
    }
  },

  /**
   * Get multiple items from storage
   */
  async multiGet(keys: string[]): Promise<[[string, string | null][], boolean]> {
    try {
      const result = await AsyncStorage.multiGet(keys);
      return [result, true];
    } catch (error) {
      console.warn(`Failed to get multiple items:`, error);
      return [keys.map((k) => [k, null]), false];
    }
  },

  /**
   * Set multiple items in storage
   */
  async multiSet(keyValuePairs: [string, string][]): Promise<boolean> {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
      return true;
    } catch (error) {
      console.warn(`Failed to set multiple items:`, error);
      return false;
    }
  },

  /**
   * Clear all app data (logout)
   */
  async clearAll(): Promise<boolean> {
    try {
      const keys = Object.values(StorageKeys);
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      console.warn(`Failed to clear all storage:`, error);
      return false;
    }
  },
};

export default storage;
