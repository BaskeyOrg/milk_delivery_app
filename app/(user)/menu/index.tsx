import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

import { useProductList } from "@/api/products";
import EmptySearchState from "@/components/EmptySearchState";
import Header from "@/components/Header";
import LocationModal from "@/components/Location/LocationModal";
import ProductListItem from "@/components/ProductListItem";

export default function MenuScreen() {
  const { data: products, error, isLoading, refetch } = useProductList();

  const [refreshing, setRefreshing] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  /** 🔍 Filter products by name */
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchText.trim()) return products;

    return products.filter((product) =>
      product.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [products, searchText]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => <ProductListItem product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ gap: 10, paddingHorizontal: 10 }}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: filteredProducts.length === 0 ? 1 : 0,
        }}
        showsVerticalScrollIndicator={false}
        /** ✅ Sticky Header */
        ListHeaderComponent={
          <Header
            onPress={() => setLocationModalVisible(true)}
            searchText={searchText}
            onSearchChange={setSearchText}
          />
        }
        stickyHeaderIndices={[0]}
        /** ✅ Empty state */
        ListEmptyComponent={
          searchText ? <EmptySearchState searchText={searchText} /> : null
        }
        /** ✅ Pull to refresh */
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <LocationModal
        visible={locationModalVisible}
        onClose={() => setLocationModalVisible(false)}
      />
    </View>
  );
}
