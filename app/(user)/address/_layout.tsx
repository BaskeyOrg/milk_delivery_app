import { Stack } from "expo-router";

export default function AddressLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Addresses" }}
      />
      <Stack.Screen
        name="create-address"
        options={{ title: "Add Address" }}
      />
    </Stack>
  );
}
