import { useAddressList } from "@/api/addresses";
import { Tables } from "@/assets/data/types";
import Colors from "@/constants/Colors";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Address = Tables<"addresses">;

type Props = {
  visible: boolean;
  onClose: () => void;
  onProceed: (address: Address) => void;
};

const AddressSelectionModal = ({ visible, onClose, onProceed }: Props) => {
  const { session } = useAuth();
  const router = useRouter();

  const {
    data: addresses = [],
    isLoading,
  } = useAddressList(session?.user.id ?? "");

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // Reset selection when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedAddress(null);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/30">

          {/* Modal */}
          <TouchableWithoutFeedback>
            <View className="bg-white dark:bg-neutral-900 rounded-t-3xl h-1/2 relative">

              {/* Close Button */}
              <Pressable
                onPress={onClose}
                className="absolute -top-16 self-center bg-white dark:bg-neutral-800 rounded-full p-3 shadow-lg z-10"
              >
                <Ionicons name="close" size={22} color={Colors.light.tint} />
              </Pressable>

              {/* Header */}
              <View className="flex-row justify-between items-center p-5 border-b border-gray-200 dark:border-neutral-700">
                <Text className="text-xl font-bold text-black dark:text-white">
                  Select Address
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    router.push("/(user)/address/create-address");
                  }}
                  className="flex-row items-center"
                >
                  <Ionicons name="add" size={22} color={Colors.light.tint} />
                  <Text className="ml-1 text-primary font-semibold">
                    Add Address
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Address List */}
              <ScrollView
                className="p-5"
                contentContainerStyle={{ paddingBottom: 16 }}
              >
                {isLoading ? (
                  <Text className="text-center text-gray-500">
                    Loading...
                  </Text>
                ) : addresses.length === 0 ? (
                  <Text className="text-center text-gray-500">
                    No addresses found
                  </Text>
                ) : (
                  addresses.map((address) => (
                    <TouchableOpacity
                      key={address.id}
                      onPress={() => setSelectedAddress(address)}
                      className={`p-4 rounded-2xl mb-3 border-2 ${
                        selectedAddress?.id === address.id
                          ? "border-primary"
                          : "border-gray-300 dark:border-neutral-700"
                      }`}
                    >
                      <Text className="text-gray-800 dark:text-white font-bold">
                        {address.full_name}
                      </Text>
                      <Text className="text-gray-600 dark:text-neutral-300">
                        {address.street}
                      </Text>
                      <Text className="text-gray-600 dark:text-neutral-300">
                        {address.city}, {address.state}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>

              {/* Footer */}
              <View className="p-4 border-t border-gray-200 dark:border-neutral-700">
                <TouchableOpacity
                  disabled={!selectedAddress}
                  onPress={() =>
                    selectedAddress && onProceed(selectedAddress)
                  }
                  className={`rounded-2xl py-4 flex-row justify-center items-center ${
                    selectedAddress ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <Ionicons name="cart" size={22} color="#121212" />
                  <Text className="font-bold text-lg ml-2 text-secondary">
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddressSelectionModal;
