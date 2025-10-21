import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../theme';

export default function SessionSetupScreen() {
  const router = useRouter();
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState('');

  const handleStart = () => {
    if (!taskName.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    const durationNum = parseInt(duration, 10);
    if (!duration || isNaN(durationNum) || durationNum <= 0) {
      Alert.alert('Error', 'Please enter a valid duration in minutes');
      return;
    }

    router.push({
      pathname: '/brick',
      params: {
        taskName: taskName.trim(),
        goalDuration: durationNum.toString(),
      },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>What are you working on?</Text>
            <TextInput
              style={styles.input}
              value={taskName}
              onChangeText={setTaskName}
              placeholder="e.g., Deep work on project"
              placeholderTextColor={theme.colors.gray[600]}
              autoFocus
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Goal duration (minutes)</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="e.g., 25"
              placeholderTextColor={theme.colors.gray[600]}
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>

          <View style={styles.quickDurations}>
            <Text style={styles.quickLabel}>Quick select:</Text>
            <View style={styles.quickButtons}>
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() => setDuration('15')}
              >
                <Text style={styles.quickButtonText}>15</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() => setDuration('25')}
              >
                <Text style={styles.quickButtonText}>25</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() => setDuration('45')}
              >
                <Text style={styles.quickButtonText}>45</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() => setDuration('60')}
              >
                <Text style={styles.quickButtonText}>60</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>Start Session</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    fontSize: theme.fontSize.md,
    color: theme.colors.white,
    marginBottom: theme.spacing.md,
    fontWeight: '500',
  },
  input: {
    backgroundColor: theme.colors.gray[900],
    borderWidth: 1,
    borderColor: theme.colors.gray[800],
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    fontSize: theme.fontSize.lg,
    color: theme.colors.white,
  },
  quickDurations: {
    marginTop: theme.spacing.md,
  },
  quickLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.gray[400],
    marginBottom: theme.spacing.sm,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  quickButton: {
    flex: 1,
    backgroundColor: theme.colors.gray[800],
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  quickButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.white,
    fontWeight: '600',
  },
  actions: {
    gap: theme.spacing.md,
  },
  startButton: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.black,
  },
  cancelButton: {
    backgroundColor: theme.colors.gray[900],
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: '600',
    color: theme.colors.white,
  },
});
