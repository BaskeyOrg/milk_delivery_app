import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/api/products";
import Button from "@/components/Button";
import { defaultPizzaImage } from "@/components/ProductListItem";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { randomUUID } from "expo-crypto";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TextInput, View } from "react-native";

export default function CreateProductScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const { id: isString } = useLocalSearchParams();
  const id = parseFloat(
    typeof isString === "string" ? isString : isString?.[0]
  );

  const {
    mutate: insertProduct,
    isPending: isCreating,
  } = useInsertProduct();

  const {
    mutate: updateProduct,
    isPending: isUpdatingProduct,
  } = useUpdateProduct();

  const { data: updatingProduct } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();

  const router = useRouter();
  const isUpdating = !!id;

  const isSubmitting = isCreating || isUpdatingProduct;

  /* ----------------------------- Load Data ----------------------------- */
  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  /* ----------------------------- Helpers ----------------------------- */
  const resetFields = () => {
    setName("");
    setPrice("");
    setImage(null);
  };

  const validateInputs = () => {
    setErrors("");

    if (!name) {
      setErrors("Name is required");
      return false;
    }

    if (!price) {
      setErrors("Price is required");
      return false;
    }

    if (isNaN(Number(price))) {
      setErrors("Price must be a number");
      return false;
    }

    return true;
  };

  /* ----------------------------- Image Picker ----------------------------- */
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

  /* ----------------------------- Submit ----------------------------- */
  const onSubmit = () => {
    if (isSubmitting) return;
    isUpdating ? onUpdate() : onCreate();
  };

  const onCreate = async () => {
    if (!validateInputs()) return;

    const imagePath = await uploadImage();

    insertProduct(
      { name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };

  const onUpdate = async () => {
    if (!validateInputs()) return;

    const imagePath = await uploadImage();

    updateProduct(
      { id, name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };

  /* ----------------------------- Delete ----------------------------- */
  const confirmation = () => {
    Alert.alert("Are you sure?", "This will delete the product", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          deleteProduct(id, {
            onSuccess: () => {
              resetFields();
              router.replace("/(admin)");
            },
          }),
      },
    ]);
  };

  /* ----------------------------- Upload Image ----------------------------- */
  const uploadImage = async () => {
    if (!image?.startsWith("file://")) return image;

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });

    const filePath = `${randomUUID()}.png`;

    const { data } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), {
        contentType: "image/png",
      });

    return data?.path;
  };

  /* ----------------------------- UI ----------------------------- */
  return (
    <View className="flex-1 justify-center bg-white px-4">
      <Stack.Screen
        options={{ title: isUpdating ? "Update Product" : "Create Product" }}
      />

      <Image
        source={{ uri: image || defaultPizzaImage }}
        className="w-1/2 aspect-square self-center rounded-lg"
      />

      <Text
        onPress={pickImage}
        className="text-center font-bold text-primary my-3"
      >
        Select Image
      </Text>

      <Text className="text-gray-500">Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
        className="bg-white border border-gray-300 rounded-md px-3 py-2 mt-1 mb-3"
      />

      <Text className="text-gray-500">Price</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="numeric"
        className="bg-white border border-gray-300 rounded-md px-3 py-2 mt-1 mb-2"
      />

      {!!errors && (
        <Text className="text-red-500 text-xs mt-1">{errors}</Text>
      )}

      <Button
        text={
          isSubmitting
            ? isUpdating
              ? "Updating..."
              : "Creating..."
            : isUpdating
            ? "Update"
            : "Create"
        }
        onPress={onSubmit}
        disabled={isSubmitting}
      />

      {isUpdating && !isSubmitting && (
        <Button
          onPress={confirmation}
          className="text-center font-bold text-red-500 mt-4"
          text="Delete Product"
        />
      )}
    </View>
  );
}
