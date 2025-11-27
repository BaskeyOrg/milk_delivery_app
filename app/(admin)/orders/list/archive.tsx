import { useAdminOrderList } from '@/api/orders';
import OrderListItem from '@/components/OrderListItem';
import { Stack } from 'expo-router';
import { ActivityIndicator, FlatList, Text } from 'react-native';

export default function OrdersScreen() {

    const { data: orders, error, isLoading } = useAdminOrderList({ archived: true });
  
    if (isLoading) {
      return <ActivityIndicator />;
    }
    if (error) {
      return <Text>{error.message}</Text>;
    }
  return (
    <>
      <Stack.Screen options={{ title: 'Archive' }} />
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderListItem order={item} />}
        contentContainerStyle={{ gap: 10, padding: 10 }}
      />
    </>
  );
}