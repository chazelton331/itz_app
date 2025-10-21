import { useState, useEffect, useRef, useCallback } from 'react';
import { Session } from '../types/session';
import { storageService } from '../services/storage';
import { notificationService } from '../services/notifications';

export const useSession = () => {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const notificationIdRef = useRef<string | null>(null);

  // Timer effect
  useEffect(() => {
    if (isActive && currentSession) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - currentSession.startTime) / 1000);
        setElapsedTime(elapsed);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentSession]);

  const startSession = useCallback(async (taskName: string, goalDuration: number) => {
    const newSession: Session = {
      id: Date.now().toString(),
      taskName,
      goalDuration,
      startTime: Date.now(),
      duration: 0,
      completed: false,
    };

    setCurrentSession(newSession);
    setIsActive(true);
    setElapsedTime(0);

    // Request notification permissions and schedule goal notification
    const hasPermission = await notificationService.requestPermissions();
    if (hasPermission) {
      const notificationId = await notificationService.scheduleGoalNotification(goalDuration);
      notificationIdRef.current = notificationId;
    }

    return newSession;
  }, []);

  const endSession = useCallback(async (completed: boolean) => {
    if (!currentSession) return;

    const now = Date.now();
    const duration = Math.floor((now - currentSession.startTime) / 1000);

    const finishedSession: Session = {
      ...currentSession,
      endTime: now,
      duration,
      completed,
    };

    // Save to history
    await storageService.saveSession(finishedSession);

    // Cancel any scheduled notifications
    if (notificationIdRef.current) {
      await notificationService.cancelNotification(notificationIdRef.current);
      notificationIdRef.current = null;
    }

    setCurrentSession(null);
    setIsActive(false);
    setElapsedTime(0);

    return finishedSession;
  }, [currentSession]);

  const cancelSession = useCallback(async () => {
    return await endSession(false);
  }, [endSession]);

  const completeSession = useCallback(async () => {
    return await endSession(true);
  }, [endSession]);

  return {
    currentSession,
    elapsedTime,
    isActive,
    startSession,
    cancelSession,
    completeSession,
  };
};
