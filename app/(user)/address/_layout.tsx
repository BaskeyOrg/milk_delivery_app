import { Stack } from "expo-router";

export default function AddressLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Your Addresses" }}
      />
      <Stack.Screen
        name="create-address"
        options={{ title: "Add Address" }}
      />
    </Stack>
  );
}
