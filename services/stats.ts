import { Session, SessionStats, DailyStats } from '../types/session';

export const statsService = {
  // Calculate overall stats
  calculateStats(sessions: Session[]): SessionStats {
    const now = Date.now();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

    let todayTotal = 0;
    let weekTotal = 0;
    let monthTotal = 0;
    let allTimeTotal = 0;
    let completedSessions = 0;
    let cancelledSessions = 0;

    sessions.forEach(session => {
      allTimeTotal += session.duration;

      if (session.completed) {
        completedSessions++;
      } else {
        cancelledSessions++;
      }

      if (session.startTime >= todayStart.getTime()) {
        todayTotal += session.duration;
      }

      if (session.startTime >= weekAgo) {
        weekTotal += session.duration;
      }

      if (session.startTime >= monthAgo) {
        monthTotal += session.duration;
      }
    });

    return {
      todayTotal,
      weekTotal,
      monthTotal,
      allTimeTotal,
      totalSessions: sessions.length,
      completedSessions,
      cancelledSessions,
    };
  },

  // Group sessions by day
  groupSessionsByDay(sessions: Session[]): DailyStats[] {
    const grouped = new Map<string, Session[]>();

    sessions.forEach(session => {
      const date = new Date(session.startTime);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(session);
    });

    const dailyStats: DailyStats[] = [];
    grouped.forEach((daySessions, date) => {
      const totalDuration = daySessions.reduce((sum, s) => sum + s.duration, 0);
      dailyStats.push({
        date,
        totalDuration,
        sessions: daySessions.sort((a, b) => b.startTime - a.startTime),
      });
    });

    return dailyStats.sort((a, b) => b.date.localeCompare(a.date));
  },

  // Format seconds to HH:MM:SS
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  },

  // Format seconds to human readable (e.g., "2h 15m")
  formatDurationHuman(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    }
    return '< 1m';
  },
};
