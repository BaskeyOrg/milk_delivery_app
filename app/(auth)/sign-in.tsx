import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";
import { Link, Stack } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View className="flex-1 justify-center p-5 bg-white dark:bg-black">
      <Stack.Screen options={{ title: "Sign in" }} />

      {/* Email */}
      <Text className="text-gray-600 dark:text-gray-300 mb-1">
        Email
      </Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="jon@gmail.com"
        placeholderTextColor="#9CA3AF"
        className="border border-gray-400 dark:border-gray-600
                   bg-white dark:bg-gray-900
                   text-black dark:text-white
                   rounded-md px-3 py-2 mb-5"
      />

      {/* Password */}
      <Text className="text-gray-600 dark:text-gray-300 mb-1">
        Password
      </Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
        placeholderTextColor="#9CA3AF"
        className="border border-gray-400 dark:border-gray-600
                   bg-white dark:bg-gray-900
                   text-black dark:text-white
                   rounded-md px-3 py-2 mb-6"
      />

      {/* Button */}
      <Button
        onPress={signInWithEmail}
        text={loading ? "Signing in..." : "Sign in"}
        disabled={loading}
      />

      {/* Link */}
      <Link
        href="/sign-up"
        className="mt-4 text-center font-bold text-blue-600 dark:text-blue-400"
      >
        Create an account
      </Link>


    </View>
  );
}
