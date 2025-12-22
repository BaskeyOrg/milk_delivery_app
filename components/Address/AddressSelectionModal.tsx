import { Tables } from "@/assets/data/types";
import { useAddresses } from "@/hooks/useAddresses";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Button from "../Button";

type Address = Tables<'addresses'>;

type Props = {
  visible: boolean;
  onClose: () => void;
  onProceed: (address: Address) => void;
};

const AddressSelectionModal = ({ visible, onClose, onProceed }: Props) => {
  const { session } = useAuth();
  const { addresses, loading } = useAddresses(session?.user.id ?? '');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const router = useRouter();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end">
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="bg-white dark:bg-neutral-900 rounded-t-3xl h-1/2">

          {/* Header */}
          <View className="flex-row justify-between items-center p-5 border-b border-gray-200">
            <Text className="text-xl font-bold text-black dark:text-white">Select Address one</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} />
            </TouchableOpacity>
          </View>

          {/* Address List */}
          <ScrollView className="p-5">
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              (addresses ?? [])?.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  onPress={() => setSelectedAddress(address)}
                  className={`p-4 rounded-2xl mb-3 border-2 ${
                    selectedAddress?.id === address.id
                      ? "border-white"
                      : "border-gray-200"
                  }`}
                >
                  <Text className="text-gray-600 dark:text-white font-bold">{address.full_name}</Text>
                  <Text className="text-gray-600 dark:text-white">{address.street}</Text>
                  <Text className="text-gray-600 dark:text-white">
                    {address.city}, {address.state}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          {/* Footer */}
          <View className="p-5 border-t border-gray-200">
            <View>
              <TouchableOpacity
                className={`rounded-xl py-4 ${
                  selectedAddress ? "bg-primary" : "bg-gray-300"
                } mb-3`}
                disabled={!selectedAddress}
                onPress={() => selectedAddress && onProceed(selectedAddress)}
              >
                <Button text="Continue" />
              </TouchableOpacity>

              <TouchableOpacity
                className="rounded-xl py-4 bg-white border border-gray-300"
                onPress={() => {
                  onClose();
                  router.push("/(user)/profile/create-address");
                }}
              >
                <Text className="text-center">Add new address</Text>
              </TouchableOpacity>
            </View>
          </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddressSelectionModal;
