import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSessions } from '../hooks/useSessions';
import { statsService } from '../services/stats';
import { theme } from '../theme';

export default function HomeScreen() {
  const router = useRouter();
  const { stats, dailyStats, refresh } = useSessions();

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleStartSession = () => {
    router.push('/session-setup');
  };

  const handleViewHistory = () => {
    router.push('/history');
  };

  const todayStats = dailyStats[0];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Today's Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Today</Text>
          <Text style={styles.statsValue}>
            {statsService.formatDurationHuman(stats.todayTotal)}
          </Text>
          {todayStats && todayStats.sessions.length > 0 && (
            <Text style={styles.statsSubtext}>
              {todayStats.sessions.length} session{todayStats.sessions.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.quickStatsGrid}>
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatLabel}>This Week</Text>
            <Text style={styles.quickStatValue}>
              {statsService.formatDurationHuman(stats.weekTotal)}
            </Text>
          </View>
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatLabel}>This Month</Text>
            <Text style={styles.quickStatValue}>
              {statsService.formatDurationHuman(stats.monthTotal)}
            </Text>
          </View>
        </View>

        <View style={styles.quickStatsGrid}>
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatLabel}>Total Sessions</Text>
            <Text style={styles.quickStatValue}>{stats.totalSessions}</Text>
          </View>
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatLabel}>Completed</Text>
            <Text style={styles.quickStatValue}>{stats.completedSessions}</Text>
          </View>
        </View>

        {/* Recent Sessions */}
        {todayStats && todayStats.sessions.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Today's Sessions</Text>
            {todayStats.sessions.slice(0, 5).map((session) => (
              <View key={session.id} style={styles.sessionItem}>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionTask}>{session.taskName}</Text>
                  <Text style={styles.sessionDuration}>
                    {statsService.formatDurationHuman(session.duration)}
                    {session.completed ? ' ✓' : ' (cancelled)'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleStartSession}>
            <Text style={styles.primaryButtonText}>Start Session</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleViewHistory}>
            <Text style={styles.secondaryButtonText}>View History</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  content: {
    padding: theme.spacing.lg,
  },
  statsCard: {
    backgroundColor: theme.colors.gray[900],
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray[400],
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statsValue: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  statsSubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[500],
  },
  quickStatsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: theme.colors.gray[900],
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  quickStatLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[400],
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickStatValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.white,
  },
  recentSection: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
  },
  sessionItem: {
    backgroundColor: theme.colors.gray[900],
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  sessionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionTask: {
    fontSize: theme.fontSize.md,
    color: theme.colors.white,
    flex: 1,
  },
  sessionDuration: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[400],
  },
  actions: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.black,
  },
  secondaryButton: {
    backgroundColor: theme.colors.gray[800],
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.white,
  },
});
