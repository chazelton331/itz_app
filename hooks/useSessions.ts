import { useState, useEffect, useCallback } from 'react';
import { Session, SessionStats, DailyStats } from '../types/session';
import { storageService } from '../services/storage';
import { statsService } from '../services/stats';

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<SessionStats>({
    todayTotal: 0,
    weekTotal: 0,
    monthTotal: 0,
    allTimeTotal: 0,
    totalSessions: 0,
    completedSessions: 0,
    cancelledSessions: 0,
  });
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const loadedSessions = await storageService.getSessions();
      setSessions(loadedSessions);

      const calculatedStats = statsService.calculateStats(loadedSessions);
      setStats(calculatedStats);

      const grouped = statsService.groupSessionsByDay(loadedSessions);
      setDailyStats(grouped);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const refresh = useCallback(() => {
    loadSessions();
  }, [loadSessions]);

  return {
    sessions,
    stats,
    dailyStats,
    loading,
    refresh,
  };
};
