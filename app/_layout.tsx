import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000000',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: '#000000',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'ITZ',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="session-setup"
          options={{
            presentation: 'modal',
            title: 'New Session',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="brick"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="history"
          options={{
            title: 'History',
            headerShown: true,
          }}
        />
      </Stack>
    </>
  );
}
