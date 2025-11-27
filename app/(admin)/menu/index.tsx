import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import { useProductList } from '@/api/products';
import ProductListItem from '@/components/ProductListItem';
import Colors from '@/constants/Colors';
import { Text } from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    padding: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 10,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold'
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
});
