# ITZ App

A minimalist productivity app that helps you create focused work sessions by "bricking" your phone.

## Features

- **Brick Mode**: Full-screen timer that locks you into focused work with confirmation dialogs
- **Session Tracking**: Track productive time and tasks worked on
- **History & Stats**: View all-time statistics, trends, and session history
- **Offline First**: All data stored locally with AsyncStorage, no network required
- **Minimalist Design**: Clean black/white/grey monochrome interface

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Expo CLI installed
- iOS Simulator or Android Emulator (or physical device)

### Installation

1. Navigate to the project directory:
```bash
cd itz-app
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your platform:
- iOS: Press `i` or run `npm run ios`
- Android: Press `a` or run `npm run android`
- Web: Press `w` or run `npm run web`

## Usage

1. **Start a Session**: Tap "Start Session" on the home screen
2. **Set Your Goal**: Enter what you're working on and how long (in minutes)
3. **Focus**: Your phone enters "brick mode" with a full-screen timer
4. **Complete or Cancel**: When done, you can complete the session (if goal reached) or cancel early
5. **View Progress**: Check your stats and history at any time

## Project Structure

```
itz-app/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Home/Dashboard
│   ├── session-setup.tsx  # Session creation modal
│   ├── brick.tsx          # Brick mode timer screen
│   └── history.tsx        # History and stats
├── hooks/                  # React hooks
│   ├── useSession.ts      # Current session management
│   └── useSessions.ts     # Historical sessions
├── services/              # Business logic
│   ├── storage.ts         # AsyncStorage wrapper
│   ├── stats.ts           # Statistics calculations
│   └── notifications.ts   # Notification management
├── types/                 # TypeScript types
│   └── session.ts         # Session data models
└── theme/                 # Design system
    ├── colors.ts          # Color palette
    └── index.ts           # Theme constants
```

## Data Storage

All data is stored locally using AsyncStorage. No backend or API required.

## License

MIT
