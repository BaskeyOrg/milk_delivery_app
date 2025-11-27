import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function Orderlayout() {
  return (
    <Stack>
      {/* <Stack.Screen name="index" options={{ title: "Orders" }} /> */}
       <Stack.Screen name="list" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({});
