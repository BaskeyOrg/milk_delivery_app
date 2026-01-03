import { useUpdateProfile } from "@/api/profile";
import GradientHeader from "@/components/GradientHeader";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ---------------- REGEX ---------------- */

const phoneRegex = /^[0-9]{10}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const defaultAvatar = require("@/assets/images/user-avatar.png");

/* ---------------- COMPONENT ---------------- */

export default function EditProfile() {
  const router = useRouter();
  const { session } = useAuth();
  const userId = session?.user.id ?? "";

  const { mutateAsync: updateProfile } = useUpdateProfile();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    phone: "",
    website: "",
    group: "",
    avatar_url: null as string | null, // storage PATH or file://
  });

  /* ---------------- FETCH PROFILE ---------------- */

  useEffect(() => {
    if (!userId) return;

    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data) {
        setForm({
          full_name: data.full_name ?? "",
          username: data.username ?? "",
          phone: data.phone ?? "",
          website: data.website ?? "",
          group: data.group ?? "",
          avatar_url: data.avatar_url ?? null,
        });
      }

      setLoading(false);
    })();
  }, [userId]);

  /* ---------------- AVATAR PREVIEW ---------------- */

  useEffect(() => {
    if (!form.avatar_url) {
      setAvatarUri(null);
      return;
    }

    // Local image
    if (form.avatar_url.startsWith("file://")) {
      setAvatarUri(form.avatar_url);
      return;
    }

    (async () => {
      const { data, error } = await supabase.storage
        .from("avatars")
        .createSignedUrl(form.avatar_url, 60 * 60);

      if (!error) setAvatarUri(data.signedUrl);
    })();
  }, [form.avatar_url]);

  /* ---------------- VALIDATION ---------------- */

  const validation = useMemo(() => {
    return {
      fullName: form.full_name.trim().length > 0,
      username: form.username.length === 0 || usernameRegex.test(form.username),
      phone: form.phone.length === 0 || phoneRegex.test(form.phone),
      website: form.website.length === 0 || form.website.startsWith("http"),
    };
  }, [form]);

  const isFormValid =
    validation.fullName && validation.username && validation.phone;

  const inputClass = (invalid: boolean) =>
    `border rounded-full px-5 py-4 bg-white text-black ${
      invalid ? "border-red-500" : "border-gray-300"
    }`;

  /* ---------------- IMAGE PICKER ---------------- */

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setForm((p) => ({ ...p, avatar_url: result.assets[0].uri }));
    }
  };

  /* ---------------- IMAGE UPLOAD ---------------- */

  const uploadImage = async () => {
    if (!form.avatar_url?.startsWith("file://")) return form.avatar_url;

    const base64 = await FileSystem.readAsStringAsync(form.avatar_url, {
      encoding: "base64",
    });

    const filePath = `${userId}/${randomUUID()}.png`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, decode(base64), {
        contentType: "image/png",
        upsert: true,
      });

    if (error) throw error;
    return data.path;
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    if (!isFormValid || saving) return;

    setSaving(true);
    try {
      const avatarPath = await uploadImage();

      await updateProfile({
        ...form,
        avatar_url: avatarPath,
      });

      router.back();
    } catch (e) {
      console.error("Profile update failed", e);
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      <GradientHeader title="Edit Profile" />

      <ScrollView
        className="flex-1 px-4"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* AVATAR */}
        <TouchableOpacity onPress={pickImage} className="self-center my-6">
          <Image
            source={avatarUri ? { uri: avatarUri } : defaultAvatar}
            className="w-28 h-28 rounded-full bg-gray-200"
          />
          <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full">
            <Ionicons name="pencil" size={18} color="white" />
          </View>
        </TouchableOpacity>

        {/* FULL NAME */}
        <TextInput
          value={form.full_name}
          onChangeText={(v) => setForm((p) => ({ ...p, full_name: v }))}
          placeholder="Full name"
          className={inputClass(!validation.fullName)}
        />
        {!validation.fullName && (
          <Text className="text-red-500 text-xs ml-3 mt-1">
            Full name is required
          </Text>
        )}

        {/* USERNAME */}
        <TextInput
          value={form.username}
          onChangeText={(v) => setForm((p) => ({ ...p, username: v }))}
          placeholder="Username"
          autoCapitalize="none"
          className={`${inputClass(!validation.username)} mt-4`}
        />
        {form.username.length > 0 && !validation.username && (
          <Text className="text-red-500 text-xs ml-3 mt-1">
            3–20 characters, letters/numbers/_
          </Text>
        )}

        {/* PHONE */}
        <TextInput
          value={form.phone}
          onChangeText={(v) => setForm((p) => ({ ...p, phone: v }))}
          placeholder="Mobile number"
          keyboardType="number-pad"
          maxLength={10}
          className={`${inputClass(!validation.phone)} mt-4`}
        />
        {form.phone.length > 0 && !validation.phone && (
          <Text className="text-red-500 text-xs ml-3 mt-1">
            Enter a valid 10-digit number
          </Text>
        )}

        {/* WEBSITE */}
        <TextInput
          value={form.website}
          onChangeText={(v) => setForm((p) => ({ ...p, website: v }))}
          placeholder="Website"
          autoCapitalize="none"
          className="border rounded-full px-5 py-4 bg-white text-black border-gray-300 mt-4"

          // className={`${inputClass(!validation.website)} mt-4`}
        />
        {/* {form.website.length > 0 && !validation.website && (
          <Text className="text-red-500 text-xs ml-3 mt-1">
            Must start with http or https
          </Text>
        )} */}

        {/* SAVE */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={!isFormValid || saving}
          className={`mt-8 rounded-full py-4 ${
            !isFormValid || saving ? "bg-gray-300" : "bg-primary"
          }`}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-semibold text-lg">
              Save Profile
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
