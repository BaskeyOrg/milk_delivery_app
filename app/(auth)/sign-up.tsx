import Button from "@/components/Button";
import { supabase } from "@/lib/supabase";
import { Link, Stack } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    setErrors("");

    if (!email) {
      setErrors("Email is required");
      return false;
    }
    if (!password) {
      setErrors("Password is required");
      return false;
    }
    if (password.length < 6) {
      setErrors("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setErrors("Passwords do not match");
      return false;
    }
    return true;
  };

  async function signUpWithEmail() {
    if (!validateInputs()) return;

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View className="flex-1 justify-center p-5 bg-white dark:bg-black">
      <Stack.Screen options={{ title: "Sign Up" }} />

      {/* Email */}
      <Text className="text-gray-600 dark:text-gray-300 mb-1">
        Email
      </Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#9CA3AF"
        className="border border-gray-400 dark:border-gray-600
                   bg-white dark:bg-gray-900
                   text-black dark:text-white
                   rounded-md px-3 py-2 mb-4"
      />

      {/* Password */}
      <Text className="text-gray-600 dark:text-gray-300 mb-1">
        Password
      </Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
        placeholderTextColor="#9CA3AF"
        className="border border-gray-400 dark:border-gray-600
                   bg-white dark:bg-gray-900
                   text-black dark:text-white
                   rounded-md px-3 py-2 mb-4"
      />

      {/* Confirm Password */}
      <Text className="text-gray-600 dark:text-gray-300 mb-1">
        Confirm Password
      </Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm password"
        secureTextEntry
        placeholderTextColor="#9CA3AF"
        className="border border-gray-400 dark:border-gray-600
                   bg-white dark:bg-gray-900
                   text-black dark:text-white
                   rounded-md px-3 py-2 mb-2"
      />

      {/* Error message */}
      {!!errors && (
        <Text className="text-red-500 text-xs mb-3">
          {errors}
        </Text>
      )}

      {/* Button */}
      <Button
        text={loading ? "Creating account..." : "Create account"}
        onPress={signUpWithEmail}
        disabled={loading}
      />

      {/* Sign in link */}
      <Link
        href="/sign-in"
        className="mt-4 text-center font-bold text-blue-600 dark:text-blue-400"
      >
        Already have an account?
      </Link>
    </View>
  );
}
