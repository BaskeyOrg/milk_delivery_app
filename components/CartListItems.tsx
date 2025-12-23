import { CartItem } from "@/assets/data/types";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useCart } from "../providers/CartProvider";
import { defaultPizzaImage } from "./ProductListItem";
import RemoteImage from "./RemoteImage";

type CartListItemProps = {
  cartItem: CartItem;
};

const CartListItem = ({ cartItem }: CartListItemProps) => {
  const { updateQuantity } = useCart();
  const [modalVisible, setModalVisible] = useState(false);

  const itemTotal = cartItem.product.price * cartItem.quantity;

  const handleMinus = () => {
    if (cartItem.quantity === 1) {
      setModalVisible(true);
    } else {
      updateQuantity(cartItem.id, -1);
    }
  };

  const handleRemove = () => {
    updateQuantity(cartItem.id, -1);
    setModalVisible(false);
  };

  return (
    <>
      {/* Cart Item */}
      <View className="flex-row bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-700 mb-4 overflow-hidden h-40">
        {/* Left Half - Image */}
        <RemoteImage
          path={cartItem.product.image ?? undefined}
          fallback={defaultPizzaImage}
          resizeMode="cover"
          className="w-1/2 h-full"
        />

        {/* Right Half - Text + Buttons */}
        <View className="w-1/2 p-3">
          <Text className="text-black dark:text-white font-semibold text-base text-xl font-bold mb-1">
            {cartItem.product.name}
          </Text>

          <Text className="text-gray-600 dark:text-neutral-300 mt-1">
            Size: {cartItem.size}
          </Text>

          <Text className="text-primary font-bold mt-1">
            ₹ {cartItem.product.price.toFixed(2)}
          </Text>

          {/* Quantity + Total */}
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-black dark:text-white font-bold text-lg">
              ₹ {Math.ceil(itemTotal)}
            </Text>
            <View className="flex-row items-center border border-gray-300 dark:border-neutral-700 rounded-xl overflow-hidden">
              <Pressable
                onPress={handleMinus}
                className="px-3 py-1 bg-gray-100 dark:bg-neutral-800"
              >
                <FontAwesome name="minus" size={20} color="#4B5563" />
              </Pressable>

              <Text className="px-4 py-1 text-black dark:text-white font-medium">
                {cartItem.quantity}
              </Text>

              <Pressable
                onPress={() => updateQuantity(cartItem.id, 1)}
                className="px-3 py-1 bg-gray-100 dark:bg-neutral-800"
              >
                <FontAwesome name="plus" size={20} color="#4B5563" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Remove Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40 p-4">
          <View className="bg-white dark:bg-neutral-900 rounded-2xl p-5 w-full max-w-md shadow-lg">
            <Text className="text-lg font-bold text-black dark:text-white mb-4">
              Remove Item
            </Text>

            <Text className="text-gray-700 dark:text-neutral-300 mb-4">
              Are you sure you want to remove{" "}
              <Text className="font-semibold">{cartItem.product.name}</Text>?
            </Text>

            <View className="flex-row items-center mb-4">
              <RemoteImage
                path={cartItem.product.image ?? undefined}
                fallback={defaultPizzaImage}
                className="w-20 h-full rounded-xl mr-4"
                resizeMode="contain"
              />
              <View className="flex-1">
                <Text className="font-semibold text-black dark:text-white">
                  {cartItem.product.name}
                </Text>
                <Text className="text-gray-600 dark:text-neutral-300">
                  Size: {cartItem.size}
                </Text>
                <Text className="text-primary font-bold">
                  ₹ {cartItem.product.price.toFixed(2)}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-end space-x-3 gap-3">
              {/* Remove Button */}
              <Pressable
                onPress={handleRemove}
                className="px-4 py-2 rounded-2xl bg-red-500 flex-row items-center"
              >
                <AntDesign name="delete" size={18} color="#fff" />
                <Text className="ml-2 text-white font-medium">Remove</Text>
              </Pressable>

              {/* Cancel Button */}
              <Pressable
                onPress={() => setModalVisible(false)}
                className="px-4 py-2 rounded-2xl border border-gray-300 flex-row items-center"
              >
                <MaterialIcons name="cancel" size={18} color="#4B5563" />
                <Text className="ml-2 text-gray-700 dark:text-neutral-300 font-medium">
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CartListItem;
