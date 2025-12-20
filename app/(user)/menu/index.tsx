import { ActivityIndicator, FlatList, Text } from 'react-native';

import { useProductList } from '@/api/products';
import ProductListItem from '@/components/ProductListItem';

export default function MenuScreen() {
  const { data: products, error, isLoading } = useProductList();

  if(isLoading){
    return <ActivityIndicator />
  }
  if(error){ 
    return <Text>{error.message}</Text>
  }

  return (
    <FlatList 
      data={products}
      renderItem={({ item }) => <ProductListItem product={item} />}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      columnWrapperStyle={{ gap: 10 }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}

    />
  );
}
