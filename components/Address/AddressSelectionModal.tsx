import { useAddressList } from "@/api/addresses";
import { Tables } from "@/assets/data/types";
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

export default function AddressSelectionModal({
  visible,
  onClose,
  onProceed,
}: Props) {
  const { session } = useAuth();
  const router = useRouter();

  const { data: addresses = [], isLoading } = useAddressList(
    session?.user.id ?? ""
  );

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  /** Reset selection when modal opens */
  useEffect(() => {
    if (visible) setSelectedAddress(null);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* BACKDROP */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/30">
          {/* MODAL */}
          <TouchableWithoutFeedback>
            <View className="bg-background rounded-t-3xl h-[50%] relative">

              {/* FLOATING CLOSE BUTTON */}
              <Pressable
                onPress={onClose}
                className="absolute -top-16 self-center bg-surface-elevated rounded-full p-4 shadow-lg z-10"
              >
                <Ionicons name="close" size={22} color="#111827" />
              </Pressable>

              {/* HEADER */}
              <View className="flex-row items-center justify-between px-5 pt-6 pb-4 border-b border-surface-border">
                <Text className="text-xl font-bold text-text-primary">
                  Select Address
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    onClose();
                    router.push("/(user)/address/create-address");
                  }}
                  className="flex-row items-center gap-1"
                >
                  <Ionicons name="add" size={22} color="#43ce4e" />
                  <Text className="text-primary font-semibold">
                    Add New
                  </Text>
                </TouchableOpacity>
              </View>

              {/* ADDRESS LIST */}
              <ScrollView
                className="px-5 py-4"
                contentContainerStyle={{ paddingBottom: 16 }}
                showsVerticalScrollIndicator={false}
              >
                {isLoading ? (
                  <Text className="text-center text-text-secondary">
                    Loading addresses...
                  </Text>
                ) : addresses.length === 0 ? (
                  <Text className="text-center text-text-tertiary">
                    No addresses found
                  </Text>
                ) : (
                  addresses.map((address) => {
                    const active = selectedAddress?.id === address.id;

                    return (
                      <TouchableOpacity
                        key={address.id}
                        onPress={() => setSelectedAddress(address)}
                        activeOpacity={0.85}
                        className={`p-4 rounded-2xl mb-4 border ${
                          active
                            ? "border-primary bg-background-subtle"
                            : "border-surface-border bg-surface"
                        }`}
                      >
                        <Text className="text-text-primary font-semibold">
                          {address.full_name}
                        </Text>

                        <Text className="text-text-secondary mt-1">
                          {address.street}
                        </Text>

                        <Text className="text-text-secondary">
                          {address.area}, {address.city}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>

              {/* FOOTER */}
              <View className="px-5 py-4 border-t border-surface-border">
                <TouchableOpacity
                  disabled={!selectedAddress}
                  onPress={() =>
                    selectedAddress && onProceed(selectedAddress)
                  }
                  activeOpacity={0.9}
                  className={`rounded-full py-4 flex-row items-center justify-center ${
                    selectedAddress
                      ? "bg-primary"
                      : "bg-surface-elevated"
                  }`}
                >
                  <Ionicons
                    name="cart"
                    size={22}
                    color={
                      selectedAddress ? "#ffffff" : "#9ca3af"
                    }
                  />
                  <Text
                    className={`ml-2 font-bold text-lg ${
                      selectedAddress
                        ? "text-text-inverse"
                        : "text-text-tertiary"
                    }`}
                  >
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
}
