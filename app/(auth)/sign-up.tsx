import Button from "@/components/Button";
import Colors from "@/constants/Colors";
import { supabase } from "@/lib/supabase";
import { Link, Stack } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

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
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Sign Up" }} />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholder="Enter password"
        secureTextEntry
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        placeholder="Confirm password"
        secureTextEntry
      />

      <Text style={styles.error}>{errors}</Text>

      <Button text={loading ? "Creating account..." : "Create account"} onPress={signUpWithEmail} disabled={loading} />

      <Link href="/sign-in" style={styles.textButton}>
        Already have an account?
      </Link>
      <Button onPress={() => supabase.auth.signOut()} text="Sign Out" />
        <Link href="/" style={styles.textButton}>
          home screen
        </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  label: {
    color: "gray",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    marginVertical: 10,
    color: Colors.light.tint,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});
