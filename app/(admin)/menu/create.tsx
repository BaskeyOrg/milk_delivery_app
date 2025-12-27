import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/api/products";
import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import RemoteImage from "@/components/RemoteImage";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const priceRegex = /^\d+(\.\d{1,2})?$/;

export default function CreateProductScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const { id: idString } = useLocalSearchParams();
  const id = Number(typeof idString === "string" ? idString : idString?.[0]);
  const isUpdating = !!id;

  const router = useRouter();

  const { data: updatingProduct } = useProduct(id);
  const { mutate: insertProduct, isPending: isCreating } = useInsertProduct();
  const { mutate: updateProduct, isPending: isUpdatingProduct } =
    useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const isSubmitting = isCreating || isUpdatingProduct || isDeleting;

  // Load data when updating
  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  const isNameValid = name.length > 0;
  const isPriceValid = priceRegex.test(price) && Number(price) > 0;
  const isFormValid = isNameValid && isPriceValid;

  // Image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Upload image
  const uploadImage = async () => {
    if (!image?.startsWith("file://")) return image;

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });

    const filePath = `${randomUUID()}.png`;

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), {
        contentType: "image/png",
      });

    if (error) throw error;
    return data.path;
  };

  // Submit handler
  const onSubmit = async () => {
    if (!isFormValid || isSubmitting) {
      setError("Please fix the errors above");
      return;
    }

    setError("");

    try {
      const imagePath = await uploadImage();

      const payload = {
        name,
        price: Number(price),
        image: imagePath,
      };

      if (isUpdating) {
        updateProduct({ id, ...payload }, { onSuccess: () => router.back() });
      } else {
        insertProduct(payload, { onSuccess: () => router.back() });
      }
    } catch {
      setError("Image upload failed");
    }
  };

  // Delete handler
  const confirmDelete = () => {
    if (isDeleting) return;

    Alert.alert("Delete product?", "This action cannot be undone", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          deleteProduct(id, { onSuccess: () => router.replace("/(admin)") }),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Stack.Screen
          options={{
            title: isUpdating ? "Update Product" : "Create Product",
          }}
        />

        <View className="flex-1 items-center px-6 bg-white dark:bg-black">
          {/* IMAGE */}
          {isUpdating ? (
            <RemoteImage
              path={image ?? undefined}
              fallback={defaultPizzaImage}
              className="w-56 h-56 rounded-3xl mt-8"
            />
          ) : (
            <Image
              source={{ uri: image || defaultPizzaImage }}
              className="w-1/2 aspect-square self-center rounded-lg mt-8"
            />
          )}

          <Text
            onPress={pickImage}
            className="text-primary font-semibold mt-3 mb-6"
          >
            Change product image
          </Text>

          {/* FORM */}
          <View className="w-full gap-4">
            {/* NAME */}
            <Text className="text-white text-sm mb-1 ml-2">Product name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Product name"
              placeholderTextColor="#9CA3AF"
              className={`border rounded-full px-5 py-3 text-black dark:text-white bg-white dark:bg-black ${
                !isNameValid
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {!isNameValid && (
              <Text className="text-red-500 text-xs mt-1 ml-2">
                Product name is required
              </Text>
            )}

            {/* PRICE */}
            <Text className="text-white text-sm mb-1 ml-2">Price</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              placeholder="Price"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
              className={`border rounded-full px-5 py-3 text-black dark:text-white bg-white dark:bg-black ${
                !isPriceValid
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {!isPriceValid && (
              <Text className="text-red-500 text-xs mt-1 ml-2">
                Enter a valid price
              </Text>
            )}

            {!!error && (
              <Text className="text-red-500 text-sm text-center">{error}</Text>
            )}

            {/* SUBMIT */}
            <Button
              text={
                isSubmitting
                  ? isUpdating
                    ? "Updating..."
                    : "Creating..."
                  : isUpdating
                  ? "Update Product"
                  : "Create Product"
              }
              onPress={onSubmit}
              disabled={!isFormValid || isSubmitting}
            />

            {/* DELETE */}
            {isUpdating && (
              <View className="mt-4 items-center">
                {isDeleting ? (
                  <>
                    <ActivityIndicator color="red" />
                    <Text className="text-red-500 mt-2">Deleting product...</Text>
                  </>
                ) : (
                  <Text
                    onPress={confirmDelete}
                    className="text-red-500 font-semibold"
                  >
                    Delete Product
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
