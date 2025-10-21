import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSession } from '../hooks/useSession';
import { statsService } from '../services/stats';
import { theme } from '../theme';
import { useKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';

export default function BrickScreen() {
  useKeepAwake(); // Keep screen awake during session
  const router = useRouter();
  const params = useLocalSearchParams<{ taskName: string; goalDuration: string }>();
  const { currentSession, elapsedTime, startSession, cancelSession, completeSession } = useSession();
  const hasStartedRef = useRef(false);
  const sessionEndedByUserRef = useRef(false);

  // Start session when component mounts
  useEffect(() => {
    if (!hasStartedRef.current && params.taskName && params.goalDuration) {
      const duration = parseInt(params.goalDuration, 10);
      startSession(params.taskName, duration);
      hasStartedRef.current = true;
    }
  }, [params.taskName, params.goalDuration, startSession]);

  // Cleanup: Cancel session when component unmounts IF user didn't explicitly end it
  useEffect(() => {
    return () => {
      // Only auto-cancel if session exists and user didn't explicitly end it
      if (currentSession && !sessionEndedByUserRef.current) {
        cancelSession();
      }
    };
  }, [currentSession, cancelSession]);

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleEndSession();
      return true; // Prevent default back behavior
    });

    return () => backHandler.remove();
  }, []);

  if (!currentSession) {
    return null;
  }

  const goalDurationSeconds = currentSession.goalDuration * 60;
  const progress = Math.min(elapsedTime / goalDurationSeconds, 1);
  const hasReachedGoal = elapsedTime >= goalDurationSeconds;

  const handleEndSession = () => {
    Alert.alert(
      'End Session?',
      hasReachedGoal
        ? 'You\'ve reached your goal! Complete this session?'
        : 'Are you sure you want to end this session early? Your progress will not count toward your goal.',
      [
        {
          text: 'Keep Going',
          style: 'cancel',
        },
        {
          text: hasReachedGoal ? 'Complete' : 'Cancel Session',
          style: hasReachedGoal ? 'default' : 'destructive',
          onPress: async () => {
            sessionEndedByUserRef.current = true;
            if (hasReachedGoal) {
              await completeSession();
            } else {
              await cancelSession();
            }
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Task Info */}
      <View style={styles.header}>
        <Text style={styles.taskName}>{currentSession.taskName}</Text>
        <Text style={styles.goal}>
          Goal: {currentSession.goalDuration} minutes
        </Text>
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{statsService.formatDuration(elapsedTime)}</Text>

        {/* Progress Indicator */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        <Text style={styles.progressText}>
          {hasReachedGoal
            ? '✓ Goal reached!'
            : `${Math.floor((progress * 100))}% to goal`}
        </Text>
      </View>

      {/* End Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.endButton} onPress={handleEndSession}>
          <Text style={styles.endButtonText}>
            {hasReachedGoal ? 'Complete Session' : 'End Early'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.hint}>
          {hasReachedGoal
            ? 'Tap to finish and save your progress'
            : 'Ending early will not count toward your goal'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
    padding: theme.spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
  },
  taskName: {
    fontSize: theme.fontSize.xl,
    fontWeight: '600',
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  goal: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray[400],
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 72,
    fontWeight: '700',
    color: theme.colors.white,
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: theme.colors.gray[800],
    borderRadius: 2,
    marginTop: theme.spacing.xl,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.white,
  },
  progressText: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.gray[400],
    marginTop: theme.spacing.md,
  },
  footer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  endButton: {
    backgroundColor: theme.colors.gray[900],
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray[800],
    minWidth: 200,
    alignItems: 'center',
  },
  endButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.white,
  },
  hint: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[600],
    marginTop: theme.spacing.md,
    textAlign: 'center',
    maxWidth: 300,
  },
});
