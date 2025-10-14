// app/(tabs)/calendar/_layout.tsx
import { Stack } from "expo-router";

export default function CalendarLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="add" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen name="agenda" options={{ headerShown: false }} />
      <Stack.Screen name="create-event" options={{ headerShown: false }} />
      <Stack.Screen name="search" options={{ headerShown: false }} />
    </Stack>
  );
}
