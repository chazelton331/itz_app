import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSessions } from '../hooks/useSessions';
import { statsService } from '../services/stats';
import { theme } from '../theme';

export default function HistoryScreen() {
  const { stats, dailyStats, refresh } = useSessions();

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  const completionRate =
    stats.totalSessions > 0
      ? Math.round((stats.completedSessions / stats.totalSessions) * 100)
      : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Overall Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Time</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {statsService.formatDurationHuman(stats.allTimeTotal)}
              </Text>
              <Text style={styles.statLabel}>Total Time</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalSessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{completionRate}%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
          </View>
        </View>

        {/* Period Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.periodCard}>
            <View style={styles.periodRow}>
              <Text style={styles.periodLabel}>This Week</Text>
              <Text style={styles.periodValue}>
                {statsService.formatDurationHuman(stats.weekTotal)}
              </Text>
            </View>
            <View style={styles.periodRow}>
              <Text style={styles.periodLabel}>This Month</Text>
              <Text style={styles.periodValue}>
                {statsService.formatDurationHuman(stats.monthTotal)}
              </Text>
            </View>
            <View style={styles.periodRow}>
              <Text style={styles.periodLabel}>Today</Text>
              <Text style={styles.periodValue}>
                {statsService.formatDurationHuman(stats.todayTotal)}
              </Text>
            </View>
          </View>
        </View>

        {/* Daily Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>History by Day</Text>
          {dailyStats.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No sessions yet</Text>
              <Text style={styles.emptySubtext}>
                Start your first session to see your progress here
              </Text>
            </View>
          ) : (
            dailyStats.map((day) => (
              <View key={day.date} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayDate}>{formatDate(day.date)}</Text>
                  <Text style={styles.dayTotal}>
                    {statsService.formatDurationHuman(day.totalDuration)}
                  </Text>
                </View>
                <View style={styles.daySessions}>
                  {day.sessions.map((session) => (
                    <View key={session.id} style={styles.sessionRow}>
                      <View style={styles.sessionDot}>
                        <View
                          style={[
                            styles.sessionDotInner,
                            session.completed
                              ? styles.completedDot
                              : styles.cancelledDot,
                          ]}
                        />
                      </View>
                      <View style={styles.sessionDetails}>
                        <Text style={styles.sessionName}>{session.taskName}</Text>
                        <Text style={styles.sessionTime}>
                          {formatTime(session.startTime)} •{' '}
                          {statsService.formatDurationHuman(session.duration)}
                          {session.completed ? ' (completed)' : ' (cancelled)'}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateKey = date.toISOString().split('T')[0];
  const todayKey = today.toISOString().split('T')[0];
  const yesterdayKey = yesterday.toISOString().split('T')[0];

  if (dateKey === todayKey) {
    return 'Today';
  } else if (dateKey === yesterdayKey) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  content: {
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.gray[900],
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: '700',
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.gray[400],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  periodCard: {
    backgroundColor: theme.colors.gray[900],
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  periodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  periodLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.gray[400],
  },
  periodValue: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.white,
  },
  dayCard: {
    backgroundColor: theme.colors.gray[900],
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[800],
  },
  dayDate: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.white,
  },
  dayTotal: {
    fontSize: theme.fontSize.md,
    fontWeight: '600',
    color: theme.colors.gray[400],
  },
  daySessions: {
    gap: theme.spacing.md,
  },
  sessionRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  sessionDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.gray[800],
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  sessionDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  completedDot: {
    backgroundColor: theme.colors.white,
  },
  cancelledDot: {
    backgroundColor: theme.colors.gray[600],
  },
  sessionDetails: {
    flex: 1,
  },
  sessionName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  sessionTime: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[500],
  },
  emptyState: {
    backgroundColor: theme.colors.gray[900],
    padding: theme.spacing.xxl,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.gray[400],
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[600],
    textAlign: 'center',
  },
});
