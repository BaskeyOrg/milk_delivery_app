import { CartItem } from "@/assets/data/types";
import { FontAwesome } from "@expo/vector-icons";
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
    updateQuantity(cartItem.id, -1); // remove the item
    setModalVisible(false);
  };

  return (
    <>
      <View className="bg-white rounded-lg p-2 flex-row items-center mb-2">
        <RemoteImage
          path={cartItem.product.image ?? undefined}
          fallback={defaultPizzaImage}
          resizeMode="contain"
          className="w-20 aspect-square rounded-lg mr-3"
        />

        <View className="flex-1">
          <Text className="text-black font-medium text-base mb-1">
            {cartItem.product.name}
          </Text>

          <View className="flex-row items-center space-x-2">
            <Text className="text-primary font-bold">
              ₹ {cartItem.product.price.toFixed(2)}
            </Text>
            <Text className="text-gray-500 ml-3">Size: {cartItem.size}</Text>
          </View>
        </View>

        <View className="flex-row flex-col items-center justify-center space-y-1">
          <View className="flex-row items-center space-x-3">
            <FontAwesome
              onPress={handleMinus}
              name="minus"
              color="gray"
              style={{ padding: 5 }}
            />

            <Text className="text-black font-medium text-lg mx-3">
              {cartItem.quantity}
            </Text>

            <FontAwesome
              onPress={() => updateQuantity(cartItem.id, 1)}
              name="plus"
              color="gray"
              style={{ padding: 5 }}
            />
          </View>

          <Text className="text-black font-bold text-base">
            ₹ {itemTotal.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-4 w-11/12 max-w-md">
            <Text className="text-lg font-bold mb-4">Do you want to remove {cartItem.product.name} ?</Text>

            <View className="flex-row items-center mb-4">
              <RemoteImage
                path={cartItem.product.image ?? undefined}
                fallback={defaultPizzaImage}
                className="w-20 h-20 rounded-lg mr-4"
                resizeMode="contain"
              />
              <View className="flex-1">
                <Text className="font-medium text-base">{cartItem.product.name}</Text>
                <Text className="text-gray-500">Size: {cartItem.size}</Text>
                <Text className="text-primary font-bold">₹ {cartItem.product.price.toFixed(2)}</Text>
              </View>
            </View>

            <View className="flex-row justify-end space-x-4">
              <Pressable
                className="px-4 py-2 rounded-lg border border-gray-300"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </Pressable>

              <Pressable
                className="px-4 py-2 rounded-lg bg-red-500 ml-3"
                onPress={handleRemove}
              >
                <Text className="text-white font-medium">Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CartListItem;
