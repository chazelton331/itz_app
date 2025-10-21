# ITZ App - Initial Release Review Guide

This guide will help you systematically review the codebase before the initial release.

---

## 1. Architecture Review

### Data Flow
- [ ] **Session Lifecycle**: Review how sessions move from creation → active → completed/cancelled
  - Start: `session-setup.tsx` → passes params → `brick.tsx`
  - Active: Memory-only state in `useSession` hook
  - End: Saved to AsyncStorage via `storageService.saveSession()`

- [ ] **State Management**: Verify hooks are used correctly
  - `useSession`: Single source of truth for active session (memory only)
  - `useSessions`: Loads historical sessions from AsyncStorage
  - No global state needed - good for this simple app

- [ ] **Navigation Flow**: Trace the navigation paths
  - Home → Session Setup (modal) → Brick → Home (on completion)
  - History is accessible from Home
  - Verify no circular redirects remain

### Key Files to Review

#### Core Logic (`hooks/`)
- [ ] **useSession.ts** (lines 1-124)
  - Verify timer updates every second correctly
  - Check notification scheduling/cancellation logic
  - Confirm session state is never persisted to AsyncStorage
  - Review cleanup in `endSession()` function

- [ ] **useSessions.ts** (lines 1-58)
  - Check AsyncStorage is read correctly
  - Verify stats calculations are delegated to `statsService`
  - Confirm refresh function works as expected

#### Services (`services/`)
- [ ] **storage.ts** (lines 1-40)
  - Verify only historical sessions are stored
  - Check `saveSession()` appends to array correctly
  - Review error handling in all async functions

- [ ] **stats.ts** (lines 1-104)
  - Review date calculations for today/week/month boundaries
  - Check time zone handling (uses local time)
  - Verify duration formatting functions (HH:MM:SS and human-readable)
  - Test edge cases: 0 seconds, very large durations

- [ ] **notifications.ts** (lines 1-79)
  - Check permission request flow
  - Verify notification is scheduled with correct trigger type
  - Confirm notifications are cancelled when sessions end

#### Screens (`app/`)
- [ ] **index.tsx** (Home Dashboard)
  - Verify stats display correctly
  - Check useFocusEffect refreshes data when screen comes into view
  - Confirm no auto-redirect logic remains

- [ ] **session-setup.tsx**
  - Test input validation (empty task name, invalid duration)
  - Verify quick-select buttons work
  - Check navigation params are passed correctly

- [ ] **brick.tsx**
  - Review session start logic (params → startSession)
  - Verify cleanup unmounts session correctly
  - Check `sessionEndedByUserRef` prevents double-save
  - Test back button handler shows confirmation

- [ ] **history.tsx**
  - Verify date grouping logic
  - Check completion status indicators
  - Test empty state display

---

## 2. Code Quality Review

### TypeScript
- [ ] Run `npx tsc --noEmit` - should pass with no errors
- [ ] Check all function parameters have explicit types
- [ ] Verify no `any` types are used
- [ ] Review interface definitions in `types/session.ts`

### Error Handling
- [ ] **AsyncStorage failures**: All try/catch blocks log errors
- [ ] **Navigation errors**: Session setup shows alerts for validation
- [ ] **Notification failures**: Gracefully degrades if permissions denied
- [ ] **Edge cases**: Empty sessions array, missing data

### Performance
- [ ] **Timer efficiency**: useEffect cleanup properly clears intervals
- [ ] **Re-renders**: Check if stats recalculate unnecessarily
- [ ] **AsyncStorage**: Only read on mount/focus, only write on session end

---

## 3. User Experience Testing

### Happy Path
1. [ ] Launch app → see empty state or existing stats
2. [ ] Tap "Start Session" → modal opens
3. [ ] Enter task and duration → navigate to brick screen
4. [ ] Timer counts up correctly
5. [ ] Progress bar fills proportionally
6. [ ] Reach goal → see "Goal reached!" message
7. [ ] Tap "Complete Session" → return to home
8. [ ] Verify session appears in "Today's Sessions"
9. [ ] Check stats are updated (today total, session count)
10. [ ] Navigate to History → see session listed

### Edge Cases
- [ ] **Cancel early**: Start session → tap "End Early" → confirm cancelled
- [ ] **Navigate away**: Start session → swipe back → verify session cancelled
- [ ] **Close app**: Start session → close app → reopen → verify no active session
- [ ] **Zero duration**: Try entering 0 minutes → should show error
- [ ] **Very long duration**: Try 1000+ minutes → timer should handle correctly
- [ ] **Rapid navigation**: Quickly tap buttons → no crashes or weird state
- [ ] **No permissions**: Deny notifications → app still works

### UI/UX Polish
- [ ] **Monochrome theme**: All colors are black/white/grey variants
- [ ] **Font sizes**: Readable on all screen sizes
- [ ] **Spacing**: Consistent padding/margins using theme values
- [ ] **Button states**: No visual feedback on press (consider adding)
- [ ] **Loading states**: Brick screen shows null initially - is this okay?
- [ ] **Back button**: Android hardware back button handled in brick mode

---

## 4. Platform-Specific Testing

### iOS
- [ ] Test on iPhone SE (small screen)
- [ ] Test on iPhone 15 Pro Max (large screen)
- [ ] Verify safe area insets work correctly
- [ ] Test notification permissions flow
- [ ] Verify "Keep Awake" works during sessions
- [ ] Test modal presentation style

### Android
- [ ] Test hardware back button behavior
- [ ] Verify notification permissions (Android 13+)
- [ ] Check edge-to-edge display
- [ ] Test on various screen sizes

---

## 5. Data Integrity

### Session Data
- [ ] **Timestamps**: Verify `startTime` and `endTime` are Unix timestamps
- [ ] **Duration calculation**: Check elapsed time matches actual time passed
- [ ] **Completion flag**: Verify only goal-reached sessions marked completed
- [ ] **Task names**: Check max length enforcement (100 chars)

### Stats Calculations
- [ ] **Today's total**: Only counts sessions from midnight onward
- [ ] **Week total**: Last 7 days calculation is correct
- [ ] **Month total**: Last 30 days calculation is correct
- [ ] **Completion rate**: Division by zero handled when no sessions

### AsyncStorage
- [ ] **Data format**: Sessions stored as JSON array
- [ ] **Key naming**: `@itz_app_sessions` is unique enough
- [ ] **Migration**: No migration needed (new app)
- [ ] **Corruption handling**: App doesn't crash if JSON is invalid

---

## 6. Security & Privacy

- [ ] **No network calls**: Verify app is 100% offline
- [ ] **No analytics**: No tracking or telemetry
- [ ] **No external dependencies**: Only React Native, Expo, and AsyncStorage
- [ ] **Local data only**: All data stays on device
- [ ] **No sensitive info**: Task names are user-controlled

---

## 7. Known Limitations & Future Improvements

### Current Limitations
- [ ] **No data export**: Users can't export their session history
- [ ] **No backup**: Data lost if app deleted
- [ ] **No pause**: Sessions can't be paused and resumed
- [ ] **No edit history**: Can't edit or delete past sessions
- [ ] **No customization**: Colors, sounds are fixed
- [ ] **Timer precision**: May drift slightly (uses setInterval)

### Potential Improvements (Not for v1)
- [ ] Add session pause/resume functionality
- [ ] Export sessions to CSV or JSON
- [ ] Add custom notification sounds
- [ ] Add daily/weekly goals
- [ ] Show streak tracking
- [ ] Add dark mode toggle (currently always dark)
- [ ] Add haptic feedback
- [ ] Add session categories/tags

---

## 8. Pre-Release Checklist

### Code
- [ ] Remove all `console.log` statements (or keep for debugging?)
- [ ] Remove unused imports
- [ ] Remove commented-out code
- [ ] Update `app.json` with correct app name/description
- [ ] Create app icon (currently using default)
- [ ] Create splash screen (currently using default)

### Documentation
- [ ] Update README.md with accurate instructions
- [ ] Add screenshots to README
- [ ] Document AsyncStorage data format (for future reference)
- [ ] Add license file if open source

### Testing
- [ ] Run on physical iOS device
- [ ] Run on physical Android device
- [ ] Test with 100+ sessions (performance)
- [ ] Test app backgrounding/foregrounding
- [ ] Test low battery scenario
- [ ] Test different time zones

### App Store Prep (if publishing)
- [ ] Create privacy policy (even though app is offline)
- [ ] Prepare app screenshots
- [ ] Write app description
- [ ] Choose app category
- [ ] Set version number (currently 1.0.0)

---

## 9. Critical Code Paths to Trace

### Session Creation → Completion
```
1. index.tsx: handleStartSession() → router.push('/session-setup')
2. session-setup.tsx: handleStart() → router.push('/brick', {params})
3. brick.tsx: useEffect → startSession(taskName, goalDuration)
4. useSession.ts: startSession() → sets state, schedules notification
5. brick.tsx: timer runs, user taps "Complete"
6. brick.tsx: handleEndSession() → completeSession()
7. useSession.ts: endSession(true) → saveSession() to AsyncStorage
8. brick.tsx: router.replace('/') → back to home
9. index.tsx: useFocusEffect → refresh() → loads new session
```

### Session Cancellation (Navigate Away)
```
1. brick.tsx: user swipes back or closes app
2. brick.tsx: useEffect cleanup runs
3. brick.tsx: checks sessionEndedByUserRef.current === false
4. brick.tsx: calls cancelSession()
5. useSession.ts: endSession(false) → saveSession() with completed=false
```

---

## 10. Questions to Answer

Before releasing, ensure you can answer:

- [ ] What happens if AsyncStorage.getItem fails?
- [ ] What happens if a session is running when the OS kills the app?
- [ ] How do sessions behave across time zones?
- [ ] What's the max number of sessions the app can handle?
- [ ] How does the timer behave when app is backgrounded?
- [ ] Are there any memory leaks in the timer logic?
- [ ] What happens on the first app launch (no data)?

---

## Review Sign-Off

Once you've completed this review, sign off on the sections:

- [ ] Architecture is sound
- [ ] Code quality is acceptable
- [ ] User flows work correctly
- [ ] Edge cases are handled
- [ ] Performance is acceptable
- [ ] No critical bugs found
- [ ] Ready for initial release

**Reviewer:** _______________
**Date:** _______________
**Notes:**

---

## Quick Test Script

Run through this in < 5 minutes:

```
1. Open app
2. Start session: "Test Task", 1 minute
3. Wait for timer to reach 1:00
4. Complete session
5. Verify appears in home stats
6. Start another session: "Quick Test", 2 minutes
7. Immediately cancel it
8. Go to History → verify both sessions
9. Check completion status is different
10. Close and reopen app → verify data persists
```

If all 10 steps work, basic functionality is good ✓
