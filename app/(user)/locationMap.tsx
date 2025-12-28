import OverlayHeader from "@/components/OverlayHeader";
import { useLocationContext } from "@/providers/LocationProvider";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function LocationMapScreen() {
  const {
    currentLocation,
    setCurrentLocation,
    setSelectedAddress,
    requestCurrentLocation,
  } = useLocationContext();

  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [pin, setPin] = useState(
    currentLocation ?? { latitude: 13.0397, longitude: 80.2793 }
  );

  useEffect(() => {
    if (currentLocation) setPin(currentLocation);
  }, [currentLocation]);

  const confirmLocation = async () => {
    const [geo] = await Location.reverseGeocodeAsync(pin);

    const address = [geo.name, geo.street, geo.city, geo.region]
      .filter(Boolean)
      .join(", ");

    setCurrentLocation(pin);
    setSelectedAddress(address || "Selected location");

    router.back();
  };

  const goToCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      setPin(coords);

      mapRef.current?.animateToRegion(
        {
          ...coords,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        500 // smooth animation
      );
    } catch (e) {
      console.log("Failed to get current location", e);
    }
  };

  return (
    <View className="flex-1">
      <OverlayHeader />
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: pin.latitude,
          longitude: pin.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        onPress={(e) => setPin(e.nativeEvent.coordinate)}
      >
        <Marker coordinate={pin} />
      </MapView>

      {/* Current Location Button */}
      <TouchableOpacity
        onPress={goToCurrentLocation}
        className="absolute bottom-40 right-6 bg-black/70 rounded-full p-3"
      >
        <Ionicons name="locate" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Confirm Button */}
      <TouchableOpacity
        onPress={confirmLocation}
        className="absolute bottom-[6rem] left-6 right-6 bg-primary rounded-full py-3 items-center"
      >
        <Text className="text-background font-bold text-lg">
          Confirm Location
        </Text>
      </TouchableOpacity>
    </View>
  );
}
