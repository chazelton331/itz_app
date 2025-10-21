export interface Session {
  id: string;
  taskName: string;
  goalDuration: number; // in minutes
  startTime: number; // Unix timestamp
  endTime?: number; // Unix timestamp
  duration: number; // actual duration in seconds
  completed: boolean; // true if goal was met, false if cancelled early
}

export interface SessionStats {
  todayTotal: number; // seconds
  weekTotal: number; // seconds
  monthTotal: number; // seconds
  allTimeTotal: number; // seconds
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD format
  totalDuration: number; // seconds
  sessions: Session[];
}
