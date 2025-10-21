import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '../types/session';

const SESSIONS_KEY = '@itz_app_sessions';

export const storageService = {
  // Get all sessions
  async getSessions(): Promise<Session[]> {
    try {
      const data = await AsyncStorage.getItem(SESSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  },

  // Save a session
  async saveSession(session: Session): Promise<void> {
    try {
      const sessions = await this.getSessions();
      sessions.push(session);
      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  },

  // Clear all data (for debugging/reset)
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SESSIONS_KEY);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  },
};
